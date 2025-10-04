import { Order, Cart, OrderItem } from '@/lib/automation/types';

export function OrderConfirmationEmail(order: Order): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px; text-align: center; background-color: #000000;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Sellery</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; color: #171717;">Thank you for your order!</h2>
              <p style="margin: 0 0 20px; color: #666; line-height: 1.6;">
                Hi ${order.customerName},
              </p>
              <p style="margin: 0 0 30px; color: #666; line-height: 1.6;">
                We've received your order and will send you another email when it ships.
              </p>

              <!-- Order Number -->
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
                <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #171717;">#${order.id}</p>
              </div>

              <!-- Order Items -->
              <h3 style="margin: 0 0 20px; font-size: 18px; color: #171717;">Order Details</h3>
              ${order.items.map(item => `
                <div style="border-bottom: 1px solid #e5e5e5; padding: 15px 0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color: #171717; font-weight: 500;">${item.name}</td>
                      <td style="text-align: right; color: #666;">x ${item.quantity}</td>
                    </tr>
                    <tr>
                      <td style="padding-top: 5px; color: #666; font-size: 14px;">$${item.price.toFixed(2)} each</td>
                      <td style="text-align: right; padding-top: 5px; color: #171717; font-weight: 500;">$${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  </table>
                </div>
              `).join('')}

              <!-- Total -->
              <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #171717;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size: 18px; font-weight: bold; color: #171717;">Total</td>
                    <td style="text-align: right; font-size: 18px; font-weight: bold; color: #171717;">$${order.total.toFixed(2)}</td>
                  </tr>
                </table>
              </div>

              <!-- Shipping Address -->
              <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 4px;">
                <h4 style="margin: 0 0 10px; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</h4>
                <p style="margin: 0; color: #171717; line-height: 1.6;">
                  ${order.shippingAddress.street}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                  ${order.shippingAddress.country}
                </p>
              </div>

              <!-- CTA Button -->
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://sellery.com/account/orders/${order.id}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 4px; font-weight: 500;">
                  View Order Status
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f5f5f5; text-align: center;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@sellery.com" style="color: #000000;">support@sellery.com</a>
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} Sellery. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function ShippingNotificationEmail(order: Order, trackingNumber: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order Has Shipped!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px; text-align: center; background-color: #000000;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Sellery</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background-color: #22c55e; color: white; padding: 40px; border-radius: 50%; margin-bottom: 20px;">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>

              <h2 style="margin: 0 0 20px; font-size: 24px; color: #171717; text-align: center;">Your order is on the way!</h2>
              <p style="margin: 0 0 30px; color: #666; line-height: 1.6; text-align: center;">
                Order #${order.id} has been shipped and is heading your way.
              </p>

              <div style="background-color: #f5f5f5; padding: 30px; border-radius: 4px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Tracking Number</p>
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #171717; letter-spacing: 1px;">${trackingNumber}</p>
              </div>

              <div style="text-align: center;">
                <a href="https://track.example.com/${trackingNumber}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 4px; font-weight: 500;">
                  Track Your Package
                </a>
              </div>

              <p style="margin: 30px 0 0; color: #666; font-size: 14px; line-height: 1.6;">
                Estimated delivery: <strong>3-5 business days</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px; background-color: #f5f5f5; text-align: center;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@sellery.com" style="color: #000000;">support@sellery.com</a>
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} Sellery. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function AbandonedCartEmail(cart: Cart): string {
  const discountCode = 'COMEBACK10';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You left something behind...</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px; text-align: center; background-color: #000000;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Sellery</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; color: #171717;">You left something behind!</h2>
              <p style="margin: 0 0 30px; color: #666; line-height: 1.6;">
                We noticed you didn't complete your purchase. The items in your cart are still waiting for you!
              </p>

              <!-- Cart Items -->
              ${cart.items.map(item => `
                <div style="border-bottom: 1px solid #e5e5e5; padding: 15px 0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color: #171717; font-weight: 500;">${item.name}</td>
                      <td style="text-align: right; color: #171717; font-weight: 500;">$${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  </table>
                </div>
              `).join('')}

              <div style="margin-top: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size: 18px; font-weight: bold; color: #171717;">Total</td>
                    <td style="text-align: right; font-size: 18px; font-weight: bold; color: #171717;">$${cart.total.toFixed(2)}</td>
                  </tr>
                </table>
              </div>

              <!-- Discount Banner -->
              <div style="margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: bold;">Special Offer: 10% OFF</p>
                <p style="margin: 0 0 20px; color: #ffffff; opacity: 0.9;">Complete your purchase and save!</p>
                <div style="background-color: #ffffff; padding: 15px; border-radius: 4px; display: inline-block;">
                  <p style="margin: 0; font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px;">${discountCode}</p>
                </div>
              </div>

              <div style="text-align: center;">
                <a href="https://sellery.com/cart?code=${discountCode}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 4px; font-weight: 500; font-size: 16px;">
                  Complete My Purchase
                </a>
              </div>

              <p style="margin: 30px 0 0; color: #999; font-size: 12px; text-align: center;">
                This offer expires in 24 hours
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px; background-color: #f5f5f5; text-align: center;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@sellery.com" style="color: #000000;">support@sellery.com</a>
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} Sellery. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
