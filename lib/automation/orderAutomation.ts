import { Order } from './types';

/**
 * Forward order to Spocket for fulfillment
 */
export async function forwardOrderToSpocket(order: Order): Promise<{ success: boolean; supplierOrderId?: string }> {
  try {
    const response = await fetch('https://api.spocket.co/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SPOCKET_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: order.id,
        items: order.items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: {
          name: order.customerName,
          address1: order.shippingAddress.street,
          city: order.shippingAddress.city,
          province: order.shippingAddress.state,
          zip: order.shippingAddress.zipCode,
          country: order.shippingAddress.country,
          phone: order.shippingAddress.phone
        },
        customer_email: order.customerEmail
      })
    });

    if (!response.ok) {
      throw new Error(`Spocket API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      supplierOrderId: data.order_id
    };
  } catch (error) {
    console.error('Failed to forward order to Spocket:', error);
    return {
      success: false
    };
  }
}

/**
 * Forward order to AutoDS for fulfillment
 */
export async function forwardOrderToAutoDS(order: Order): Promise<{ success: boolean; supplierOrderId?: string }> {
  try {
    const response = await fetch('https://api.autods.com/v1/orders', {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.AUTODS_API_KEY || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        external_order_id: order.id,
        products: order.items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity
        })),
        shipping: {
          name: order.customerName,
          address: order.shippingAddress.street,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          zip: order.shippingAddress.zipCode,
          country: order.shippingAddress.country
        }
      })
    });

    if (!response.ok) {
      throw new Error(`AutoDS API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      supplierOrderId: data.order_id
    };
  } catch (error) {
    console.error('Failed to forward order to AutoDS:', error);
    return {
      success: false
    };
  }
}

/**
 * Check order status from supplier
 */
export async function checkSupplierOrderStatus(supplierOrderId: string, supplier: 'spocket' | 'autods'): Promise<string> {
  try {
    if (supplier === 'spocket') {
      const response = await fetch(`https://api.spocket.co/v1/orders/${supplierOrderId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.SPOCKET_API_KEY}`
        }
      });

      const data = await response.json();
      return data.status; // 'pending', 'processing', 'shipped', 'delivered'
    } else if (supplier === 'autods') {
      const response = await fetch(`https://api.autods.com/v1/orders/${supplierOrderId}`, {
        headers: {
          'X-API-Key': process.env.AUTODS_API_KEY || ''
        }
      });

      const data = await response.json();
      return data.status;
    }

    return 'unknown';
  } catch (error) {
    console.error('Failed to check order status:', error);
    return 'error';
  }
}

/**
 * Process new order - complete automation flow
 */
export async function processNewOrder(order: Order): Promise<void> {
  console.log(`Processing order ${order.id}...`);

  // 1. Forward to supplier (choose your default supplier)
  const supplierResult = await forwardOrderToSpocket(order);

  if (!supplierResult.success) {
    // Alert admin
    await sendAutomationAlert('Order Forwarding', new Error(`Failed to forward order ${order.id}`));
    return;
  }

  // 2. Update order with supplier info
  // await updateOrderInDatabase(order.id, {
  //   supplierOrderId: supplierResult.supplierOrderId,
  //   status: 'processing'
  // });

  // 3. Send confirmation email
  // await sendOrderConfirmationEmail(order);

  console.log(`Order ${order.id} processed successfully!`);
}

/**
 * Send automation alert to admin
 */
async function sendAutomationAlert(system: string, error: Error): Promise<void> {
  // This would integrate with your email service
  console.error(`🚨 Automation Alert: ${system}`, error);
}
