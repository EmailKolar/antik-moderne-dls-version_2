import { EmailEventType } from '@prisma/client';
import { EmailStatus } from '@prisma/client';
import prisma from '../config/database';
import RabbitMQService from './rabbitmq.service';



class EmailService {
  // Send an email
  async sendEmail(to: string, subject: string, body: string, eventType: string) {
    // Create an email record in the database
    const email = await prisma.email.create({
      data: {
        to,
        subject,
        body,
        eventType: EmailEventType.CHECKOUT,
        status: 'PENDING',
      },
    });
  

    try {
      // Simulate sending the email (replace with actual email-sending logic)
      console.log(`Sending email to ${to} with subject "${subject}"`);

     

      
      // Update the email status to SENT
      const updatedEmail = await prisma.email.update({
        where: { id: email.id },
        data: { status: 'SENT', sentAt: new Date() },
      });

     // Publish a message to RabbitMQ
      await RabbitMQService.publish('email.sent', {
        id: updatedEmail.id,
        to: updatedEmail.to,
        subject: updatedEmail.subject,
        eventType: updatedEmail.eventType,
        status: updatedEmail.status,
        sentAt: updatedEmail.sentAt,
      }); 

      return updatedEmail;
    } catch (error) {
      // Update the email status to FAILED
      await prisma.email.update({
        where: { id: email.id },
        data: { status: 'FAILED' },
      });

      // Publish a failure message to RabbitMQ
      await RabbitMQService.publish('email.failed', {
        id: email.id,
        to: email.to,
        subject: email.subject,
        eventType: email.eventType,
        status: 'FAILED',
      });

      throw new Error('Failed to send email');
    }
  }

  // Get email details by ID
  async getEmailById(id: string) {
    return prisma.email.findUnique({
      where: { id },
    });
  }

/*   // Get all emails (with optional filters)
  async getAllEmails(status?: string, eventType?: string) {
    return prisma.email.findMany({
      where: {
        status: status || undefined,
        eventType: eventType || undefined,
      },
    });
  } */

  // Resend a failed email
  async resendEmail(id: string) {
    const email = await this.getEmailById(id);
    if (!email || email.status !== 'FAILED') {
      throw new Error('Email not found or not in FAILED status');
    }

    // Resend the email
    return this.sendEmail(email.to, email.subject, email.body, email.eventType);
  }
}

export default new EmailService();