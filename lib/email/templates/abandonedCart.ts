import { CartItem } from "@prisma/client";

export interface AbandonedCartEmailData {
  customerEmail: string;
  customerName?: string;
  cartItems: Array<{
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
  }>;
  cartTotal: number;
  recoveryUrl: string;
  discountCode?: string;
  discountAmount?: number;
}

export function generateAbandonedCartEmail(data: AbandonedCartEmailData): string {
  const {
    customerName,
    cartItems,
    cartTotal,
    recoveryUrl,
    discountCode,
    discountAmount,
  } = data;

  const greeting = customerName ? `Hi ${customerName}` : "Hello";
  const finalPrice = discountAmount
    ? cartTotal - discountAmount
    : cartTotal;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Cart is Waiting</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          .header p {
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
          }
          .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #666;
            line-height: 1.8;
          }
          .cart-items {
            margin: 30px 0;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
          }
          .cart-item {
            display: flex;
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            align-items: center;
          }
          .cart-item:last-child {
            border-bottom: none;
          }
          .item-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            margin-right: 20px;
          }
          .item-details {
            flex: 1;
          }
          .item-name {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
          }
          .item-quantity {
            font-size: 14px;
            color: #666;
          }
          .item-price {
            font-size: 16px;
            font-weight: 600;
            color: #667eea;
            white-space: nowrap;
          }
          .discount-banner {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            text-align: center;
          }
          .discount-banner h3 {
            font-size: 20px;
            margin-bottom: 10px;
          }
          .discount-code {
            background-color: rgba(255, 255, 255, 0.2);
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 2px;
            display: inline-block;
            margin-top: 10px;
            border: 2px dashed #ffffff;
          }
          .total-section {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 16px;
          }
          .total-row.final {
            border-top: 2px solid #667eea;
            padding-top: 15px;
            margin-top: 10px;
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
          }
          .discount-row {
            color: #f5576c;
            font-weight: 600;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            transition: transform 0.2s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .urgency-note {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 30px 0;
            border-radius: 4px;
          }
          .urgency-note p {
            margin: 0;
            color: #856404;
            font-size: 14px;
          }
          .benefits {
            margin: 30px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
          }
          .benefit-item {
            display: flex;
            align-items: center;
            margin: 10px 0;
            font-size: 14px;
            color: #666;
          }
          .benefit-icon {
            width: 20px;
            height: 20px;
            background-color: #667eea;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 700;
            margin-right: 10px;
            font-size: 12px;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
          }
          .footer p {
            margin: 10px 0;
            font-size: 14px;
            color: #666;
          }
          .footer a {
            color: #667eea;
            text-decoration: none;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #666;
            text-decoration: none;
            font-size: 14px;
          }
          @media only screen and (max-width: 600px) {
            .content {
              padding: 30px 20px;
            }
            .header h1 {
              font-size: 24px;
            }
            .cart-item {
              flex-direction: column;
              text-align: center;
            }
            .item-image {
              margin: 0 auto 15px;
            }
            .item-details {
              text-align: center;
            }
            .total-row {
              font-size: 14px;
            }
            .total-row.final {
              font-size: 18px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>🛒 Your Cart is Waiting!</h1>
            <p>You left some amazing items behind</p>
          </div>

          <!-- Content -->
          <div class="content">
            <p class="greeting">${greeting},</p>

            <p class="message">
              We noticed you left some wonderful items in your cart. Don't worry, we've saved them for you!
              Complete your purchase now and treat yourself to these natural wellness products.
            </p>

            <!-- Cart Items -->
            <div class="cart-items">
              ${cartItems
                .map(
                  (item) => `
                <div class="cart-item">
                  <img src="${item.productImage}" alt="${item.productName}" class="item-image">
                  <div class="item-details">
                    <div class="item-name">${item.productName}</div>
                    <div class="item-quantity">Quantity: ${item.quantity}</div>
                  </div>
                  <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              `
                )
                .join("")}
            </div>

            ${
              discountCode
                ? `
              <!-- Discount Banner -->
              <div class="discount-banner">
                <h3>🎁 Special Gift for You!</h3>
                <p>Complete your purchase and save $${discountAmount?.toFixed(2)}</p>
                <div class="discount-code">${discountCode}</div>
                <p style="margin-top: 10px; font-size: 14px;">Use this code at checkout</p>
              </div>
            `
                : ""
            }

            <!-- Total Section -->
            <div class="total-section">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>$${cartTotal.toFixed(2)}</span>
              </div>
              ${
                discountAmount
                  ? `
                <div class="total-row discount-row">
                  <span>Discount:</span>
                  <span>-$${discountAmount.toFixed(2)}</span>
                </div>
              `
                  : ""
              }
              <div class="total-row final">
                <span>Total:</span>
                <span>$${finalPrice.toFixed(2)}</span>
              </div>
            </div>

            <!-- Urgency Note -->
            <div class="urgency-note">
              <p>⏰ <strong>Hurry!</strong> Items in your cart are in high demand. Complete your purchase within 24 hours to guarantee availability.</p>
            </div>

            <!-- CTA Button -->
            <div class="button-container">
              <a href="${recoveryUrl}" class="cta-button">Complete My Purchase →</a>
            </div>

            <!-- Benefits -->
            <div class="benefits">
              <div class="benefit-item">
                <div class="benefit-icon">✓</div>
                <span>Free shipping on orders over $50</span>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">✓</div>
                <span>30-day money-back guarantee</span>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">✓</div>
                <span>100% natural and organic ingredients</span>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">✓</div>
                <span>Eco-friendly packaging</span>
              </div>
            </div>

            <p class="message">
              Have questions? Our customer support team is here to help! Simply reply to this email or visit our website.
            </p>

            <p class="message" style="margin-top: 30px; font-size: 14px; color: #999;">
              If you've already completed your purchase, please disregard this email.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p><strong>Flanagan Crafted Naturals</strong></p>
            <p>Handcrafted Natural Wellness Products from Costa Rica</p>

            <div class="social-links">
              <a href="https://facebook.com/flanagancr">Facebook</a> |
              <a href="https://instagram.com/flanagancr">Instagram</a> |
              <a href="https://flanagancostarica.com">Website</a>
            </div>

            <p style="margin-top: 20px; font-size: 12px; color: #999;">
              You're receiving this email because you started a checkout on our website.
              <br>
              <a href="{unsubscribe_url}">Unsubscribe from cart reminders</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generateFollowUpAbandonedCartEmail(
  data: AbandonedCartEmailData
): string {
  const { customerName, cartItems, cartTotal, recoveryUrl, discountCode } = data;
  const greeting = customerName ? `Hi ${customerName}` : "Hello";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Last Chance - Your Cart Expires Soon</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
          }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header {
            background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 { font-size: 28px; margin-bottom: 10px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .urgent-banner {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .urgent-banner h3 { color: #856404; margin-bottom: 10px; }
          .urgent-banner p { color: #856404; margin: 0; }
          .countdown {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
          }
          .countdown h2 { font-size: 24px; margin-bottom: 15px; }
          .countdown-timer {
            font-size: 48px;
            font-weight: 700;
            letter-spacing: 2px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 18px 50px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);
          }
          .button-container { text-align: center; margin: 30px 0; }
          .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
          }
          .footer p { margin: 10px 0; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Last Chance!</h1>
            <p>Your cart expires in 6 hours</p>
          </div>

          <div class="content">
            <p style="font-size: 18px; margin-bottom: 20px;">${greeting},</p>

            <div class="urgent-banner">
              <h3>⚠️ Your items are about to be released!</h3>
              <p>We've been holding these items for you, but they're in high demand. Complete your purchase now to avoid missing out.</p>
            </div>

            <div class="countdown">
              <h2>Time Remaining</h2>
              <div class="countdown-timer">06:00:00</div>
              <p style="margin-top: 15px;">After this, we can't guarantee availability</p>
            </div>

            ${
              discountCode
                ? `
              <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <h3 style="margin-bottom: 10px;">💝 EXCLUSIVE OFFER - EXPIRING SOON!</h3>
                <p style="margin-bottom: 15px;">Use code <strong>${discountCode}</strong> for an extra discount</p>
                <p style="font-size: 14px; opacity: 0.9;">This offer expires with your cart</p>
              </div>
            `
                : ""
            }

            <div class="button-container">
              <a href="${recoveryUrl}" class="cta-button">Claim My Items Now →</a>
            </div>

            <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
              Still deciding? Our customer support team is here to help!
            </p>
          </div>

          <div class="footer">
            <p><strong>Flanagan Crafted Naturals</strong></p>
            <p>Handcrafted Natural Wellness Products from Costa Rica</p>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
              This is your final reminder about your abandoned cart.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
