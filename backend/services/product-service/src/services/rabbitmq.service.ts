import { getRabbitMQChannel } from '../config/rabbitmq';
import { prisma } from '../config/database';

class RabbitMQService {
  async startOrderListener() {
    const channel = getRabbitMQChannel(); 

    await channel.assertQueue("order.created", { durable: true });
    await channel.assertQueue("order.confirmed", { durable: true });
    await channel.assertQueue("order.rejected", { durable: true });

    channel.consume("order.created", async (msg) => {
      if (msg !== null) {
        const order = JSON.parse(msg.content.toString());
        console.log("Received order:", order);

        try {
          // Check if the products exist and have enough stock
          for (const item of order.items) {
            const product = await prisma.product.findUnique({
              where: { id: item.productId },
            });

            if (!product) {
              throw new Error(`Product with ID ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
              throw new Error(`Not enough stock for product ID ${item.productId}`);
            }
          }

          // Update the product stock
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }

          // Publish 'order.confirmed'
          channel.sendToQueue(
            "order.confirmed",
            Buffer.from(
              JSON.stringify({
                orderId: order.orderId,
                status: "confirmed",
                items: order.items,
              })
            )
          );
          console.log(`Order confirmed: ${order.orderId}`);
          channel.ack(msg);
        } catch (error) {
          const reason = error instanceof Error ? error.message : "Unknown error occurred";
          channel.sendToQueue(
            "order.rejected",
            Buffer.from(
              JSON.stringify({
                orderId: order.orderId,
                status: "rejected",
                reason,
                items: order.items,
              })
            )
          );
          console.log(`Order rejected: ${order.orderId}`);
          channel.nack(msg, false, false);
        }
      }
    });
  }
}

export default new RabbitMQService();