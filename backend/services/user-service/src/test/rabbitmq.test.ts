import { RabbitMQService } from '../services/rabbitmq.service';

async function testRabbitMQ() {
  const rabbitMQ = new RabbitMQService();
  
  try {
    // Test connection
    console.log('Testing RabbitMQ connection...');
    await rabbitMQ.connect();
    console.log('✓ Connected successfully');

    // Test publishing
    console.log('\nTesting message publishing...');
    const testMessage = {
      test: 'Hello RabbitMQ!',
      timestamp: new Date().toISOString()
    };
    await rabbitMQ.publish('test.queue', testMessage);
    console.log('✓ Message published successfully');

    // Test consuming
    console.log('\nTesting message consumption...');
    await rabbitMQ.consume('test.queue', (message) => {
      console.log('✓ Message received:', message);
    });
    console.log('✓ Consumer set up successfully');

    // Wait a bit to see if we receive the message
    console.log('\nWaiting for messages... (press Ctrl+C to exit)');
    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await rabbitMQ.close();
    console.log('\nConnection closed');
  }
}

// Run the test
testRabbitMQ(); 