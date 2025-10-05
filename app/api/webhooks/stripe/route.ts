import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Retrieve full session with shipping details
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      // Retrieve line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      // Send confirmation email
      if (!resend) {
        console.warn("Resend not configured, skipping email");
        return NextResponse.json({ received: true });
      }

      await resend.emails.send({
        from: "Sellery <orders@resend.dev>", // You'll update this with your domain
        to: session.customer_details?.email || "",
        subject: "Order Confirmation - Sellery",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #000; color: #fff; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .order-details { background: #fff; padding: 15px; margin: 20px 0; border-radius: 5px; }
                .item { padding: 10px 0; border-bottom: 1px solid #eee; }
                .total { font-size: 18px; font-weight: bold; margin-top: 15px; padding-top: 15px; border-top: 2px solid #000; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Order Confirmed!</h1>
                </div>
                <div class="content">
                  <p>Hi ${session.customer_details?.name || "there"},</p>
                  <p>Thank you for your order! We're excited to get your items to you.</p>

                  <div class="order-details">
                    <h2>Order Details</h2>
                    <p><strong>Order ID:</strong> ${session.id}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

                    <h3>Items:</h3>
                    ${lineItems.data.map(item => `
                      <div class="item">
                        <strong>${item.description}</strong><br>
                        Quantity: ${item.quantity} × $${((item.amount_total || 0) / 100 / (item.quantity || 1)).toFixed(2)}
                        = $${((item.amount_total || 0) / 100).toFixed(2)}
                      </div>
                    `).join('')}

                    <div class="total">
                      Total: $${((session.amount_total || 0) / 100).toFixed(2)}
                    </div>
                  </div>

                  <div class="order-details">
                    <h3>Shipping Address</h3>
                    <p>
                      ${fullSession.customer_details?.name}<br>
                      ${fullSession.customer_details?.address?.line1 || ''}<br>
                      ${fullSession.customer_details?.address?.line2 ? fullSession.customer_details.address.line2 + '<br>' : ''}
                      ${fullSession.customer_details?.address?.city || ''}, ${fullSession.customer_details?.address?.state || ''} ${fullSession.customer_details?.address?.postal_code || ''}<br>
                      ${fullSession.customer_details?.address?.country || ''}
                    </p>
                  </div>

                  <p><strong>What's next?</strong></p>
                  <ul>
                    <li>You'll receive a shipping confirmation email once your order ships</li>
                    <li>Estimated delivery: 3-5 business days</li>
                    <li>Track your order in your account</li>
                  </ul>

                  <p>If you have any questions, please don't hesitate to contact us.</p>

                  <p>Thank you for shopping with Sellery!</p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Sellery. All rights reserved.</p>
                  <p>This is an automated confirmation email.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      console.log(`Order confirmation email sent for session ${session.id}`);
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      // Don't fail the webhook if email fails
    }
  }

  return NextResponse.json({ received: true });
}
