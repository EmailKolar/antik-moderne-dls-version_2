import { getChannel } from "../services/rabbitmq.service";
import { prisma } from "../config/database";

export async function orderListener() {
  const channel = getChannel();
  if (!channel) {
    console.error("RabbitMQ channel not initialized");
    return;
  }

  await channel.assertQueue("order.created", { durable: false });

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

        // Acknowledge the message after successful processing
        channel.ack(msg);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error processing order:", error.message);
        } else {
          console.error("Error processing order:", error);
        }

        // Reject the message without requeuing
        channel.nack(msg, false, false);
      }
    }
  });
}