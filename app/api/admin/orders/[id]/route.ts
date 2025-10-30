import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/api-middleware";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface OrderUpdateData {
  status?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  aliexpressOrderId?: string;
  aliexpressOrderUrl?: string;
  adminNotes?: string;
}

async function handlePUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data: OrderUpdateData = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (data.status) {
      updateData.status = data.status;

      // Set timestamps based on status
      if (data.status === 'SHIPPED' && !existingOrder.shippedAt) {
        updateData.shippedAt = new Date();
      }
      if (data.status === 'DELIVERED' && !existingOrder.deliveredAt) {
        updateData.deliveredAt = new Date();
      }
    }

    if (data.trackingNumber !== undefined) {
      updateData.trackingNumber = data.trackingNumber;
    }
    if (data.trackingUrl !== undefined) {
      updateData.trackingUrl = data.trackingUrl;
    }
    if (data.aliexpressOrderId !== undefined) {
      updateData.aliexpressOrderId = data.aliexpressOrderId;
    }
    if (data.aliexpressOrderUrl !== undefined) {
      updateData.aliexpressOrderUrl = data.aliexpressOrderUrl;
    }
    if (data.adminNotes !== undefined) {
      updateData.adminNotes = data.adminNotes;
    }

    // Update order
    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Send shipping notification email if status changed to SHIPPED and tracking info provided
    if (
      data.status === 'SHIPPED' &&
      data.trackingNumber &&
      resend &&
      existingOrder.status !== 'SHIPPED'
    ) {
      try {
        await resend.emails.send({
          from: "Flanagan Crafted Naturals <orders@resend.dev>",
          to: order.shippingEmail,
          subject: `Your order ${order.orderNumber} has shipped!`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #f8f8f8; padding: 20px; text-align: center; border-bottom: 2px solid #e0e0e0; }
                  .logo { max-width: 250px; height: auto; margin: 0 auto; }
                  .content { padding: 20px; background: #f9f9f9; }
                  .tracking { background: #fff; padding: 15px; margin: 20px 0; border-radius: 5px; border: 2px solid #4CAF50; }
                  .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                  .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <img src="https://YOUR_DOMAIN/logo.jpg" alt="Flanagan Crafted Naturals" class="logo" style="max-width: 200px;">
                    <h1 style="margin: 10px 0 0 0;">Your Order Has Shipped! 📦</h1>
                  </div>
                  <div class="content">
                    <p>Hi ${order.shippingName},</p>
                    <p>Great news! Your order from <strong>Flanagan Crafted Naturals</strong> has been shipped and is on its way to you.</p>

                    <div class="tracking">
                      <h3>Tracking Information</h3>
                      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                      <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
                      ${data.trackingUrl ? `
                        <a href="${data.trackingUrl}" class="button">Track Your Package</a>
                      ` : ''}
                    </div>

                    <p><strong>Shipping Address:</strong></p>
                    <p>
                      ${order.shippingName}<br>
                      ${order.shippingAddress}<br>
                      ${order.shippingCity}, ${order.shippingState} ${order.shippingZip}<br>
                      ${order.shippingCountry}
                    </p>

                    <p><strong>Items Ordered:</strong></p>
                    <ul>
                      ${order.orderItems.map((item: any) => `
                        <li>${item.productName} × ${item.quantity}</li>
                      `).join('')}
                    </ul>

                    <p>Estimated delivery: 5-15 business days</p>
                    <p>Thank you for shopping with Flanagan Crafted Naturals!</p>
                  </div>
                  <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Flanagan Crafted Naturals. All rights reserved.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        console.log(`Shipping notification sent for order ${order.orderNumber}`);
      } catch (emailError) {
        console.error("Error sending shipping notification:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

async function handleGET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export const PUT = withAdminAuth(handlePUT);
export const GET = withAdminAuth(handleGET);
