import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async (rabbitMQUrl: string) => {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    process.exit(1);
  }
};

export const getRabbitMQChannel = (): amqp.Channel => {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized');
  }
  return channel;
};