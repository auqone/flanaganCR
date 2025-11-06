export interface LowInventoryEmailData {
  products: Array<{
    id: string;
    name: string;
    stock: number;
    threshold: number;
    image: string;
    price: number;
  }>;
  dashboardUrl: string;
}

export function generateLowInventoryAlertEmail(
  data: LowInventoryEmailData
): string {
  const { products, dashboardUrl } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Low Inventory Alert</title>
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
          .header h1 { font-size: 28px; margin-bottom: 10px; }
          .content { padding: 40px 30px; }
          .alert-banner {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .alert-banner h3 { color: #856404; margin-bottom: 10px; }
          .product-list { margin: 30px 0; }
          .product-item {
            display: flex;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 15px;
            align-items: center;
          }
          .product-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            margin-right: 20px;
          }
          .product-details { flex: 1; }
          .product-name { font-size: 16px; font-weight: 600; margin-bottom: 5px; }
          .product-stock {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
          }
          .product-stock.critical {
            background-color: #dc3545;
            color: #ffffff;
          }
          .product-stock.low {
            background-color: #ffc107;
            color: #333;
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
            margin-top: 20px;
          }
          .button-container { text-align: center; margin: 30px 0; }
          .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
          }
          .footer p { margin: 10px 0; font-size: 14px; color: #666; }
          @media only screen and (max-width: 600px) {
            .product-item { flex-direction: column; text-align: center; }
            .product-image { margin: 0 auto 15px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Low Inventory Alert</h1>
            <p>Action Required - Restock Needed</p>
          </div>

          <div class="content">
            <div class="alert-banner">
              <h3>📦 ${products.length} Product${products.length > 1 ? "s" : ""} Running Low</h3>
              <p>The following products are running low on stock and need immediate attention.</p>
            </div>

            <div class="product-list">
              ${products
                .map((product) => {
                  const isCritical = product.stock === 0;
                  const stockClass = isCritical ? "critical" : "low";
                  const stockLabel = isCritical
                    ? "OUT OF STOCK"
                    : `${product.stock} remaining`;

                  return `
                    <div class="product-item">
                      <img src="${product.image}" alt="${product.name}" class="product-image">
                      <div class="product-details">
                        <div class="product-name">${product.name}</div>
                        <div style="margin: 10px 0;">
                          <span class="product-stock ${stockClass}">${stockLabel}</span>
                        </div>
                        <div style="font-size: 14px; color: #666;">
                          Price: $${product.price.toFixed(2)} |
                          Threshold: ${product.threshold} units
                        </div>
                      </div>
                    </div>
                  `;
                })
                .join("")}
            </div>

            <div class="button-container">
              <a href="${dashboardUrl}" class="cta-button">Manage Inventory →</a>
            </div>

            <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
              <h3 style="margin-bottom: 15px;">📊 Recommended Actions:</h3>
              <ul style="padding-left: 20px; color: #666;">
                <li style="margin: 10px 0;">Review supplier stock availability</li>
                <li style="margin: 10px 0;">Update product quantities or mark as out of stock</li>
                <li style="margin: 10px 0;">Consider adjusting low stock thresholds</li>
                <li style="margin: 10px 0;">Set up automatic reordering if available</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p><strong>Flanagan Crafted Naturals - Admin Dashboard</strong></p>
            <p>This is an automated inventory alert. You're receiving this because you're an administrator.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
              Alert triggered at ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
