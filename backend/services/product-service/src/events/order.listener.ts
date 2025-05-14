import { getChannel } from "../services/rabbitmq.service";
import { prisma } from "../config/database";

export async function orderListener() {
  const channel = getChannel();
  if (!channel) {
    console.error("RabbitMQ channel not initialized");
    return;
  }

  await channel.assertQueue("order.created", { durable: false });
  await channel.assertQueue("order.confirmed", { durable: false });
  await channel.assertQueue("order.rejected", { durable: false });

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
            console.error(`Product with ID ${item.productId} not found`);
            throw new Error(`Product with ID ${item.productId} not found`);
          }

          if (product.stock < item.quantity) {
            console.error(`Not enough stock for product ID ${item.productId}`);
            throw new Error(`Not enough stock for product ID ${item.productId}`);
          }
        }

        // Process the order and update the product stock
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // If all products have sufficient stock, publish 'order.confirmed'
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

        // Acknowledge the message after successful processing
        console.log(`Order confirmed: ${order.orderId}`);
        channel.ack(msg);
      } catch (error) {
         const reason =
          error instanceof Error ? error.message : "Unknown error occurred";

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
        // Reject the message without requeuing
        channel.nack(msg, false, false);
      }
    }
  });
}