// backend/services/user-service/src/controllers/webhook.controller.ts
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import RabbitMQClient from '../config/rabbitmq';

console.log('Initializing webhook controller...');
const userService = new UserService();
console.log('UserService initialized');

export const webhookHandler = async (req: Request, res: Response) => {
  console.log('Received webhook request:', req.body);
  
  const { type, data } = req.body;

  if (!type || !data) {
    console.error('Invalid request body:', req.body);
    return res.status(400).json({ 
      error: 'Invalid request body',
      details: 'type and data are required'
    });
  }

  try {
    if (type === 'user.created') {
      if (!data.username || !data.email || !data.password) {
        return res.status(400).json({
          error: 'Missing required fields',
          details: 'username, email, and password are required'
        });
      }

      console.log('Creating user with data:', data);
      const user = await userService.createUser(data.username, data.email, data.password);
      console.log('User created successfully:', user);
      
      // Publish event
      try {
        const channel = RabbitMQClient.getInstance().getChannel();
        channel.publish(
          'user-events',
          'user.created',
          Buffer.from(JSON.stringify({
            userId: user.id,
            email: user.email
          }))
        );
        console.log('Event published successfully');
      } catch (mqError) {
        console.error('Failed to publish event:', mqError);
        // Don't fail the request if event publishing fails
      }

      res.json({ 
        status: 'success', 
        data: {
          id: user.id,
          username: user.username,
          email: user.email
          // Don't send password back
        } 
      });
    } else {
      res.status(400).json({ 
        error: 'Invalid webhook type',
        details: `Unsupported type: ${type}`
      });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};