import { EmailEventType } from '@prisma/client';
import { EmailStatus } from '@prisma/client';
import prisma from '../config/database';
import RabbitMQService from './rabbitmq.service';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';


const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});


class EmailService {
  // Send an email
  async sendEmail(to: string, subject: string, body: string, eventType: string) {

    // template validation

    let finalSubject = subject;
    let finalBody = body;

    if (eventType === 'SIGN_UP') {
    finalSubject = 'Welcome to Antik Moderne DLS!';
    finalBody = `Hello, thank you for signing up!`;
  } else if (eventType === 'CHECKOUT') {
    finalSubject = 'Your Order Confirmation';
    finalBody = 'Thank you for your order!';
  } else {
    finalSubject = 'Other Subject';
    finalBody = 'Other Body';
  }

  console.log('Sending email:', finalSubject, finalBody);

    // Create an email record in the database
    const email = await prisma.email.create({
      data: {
        to,
        subject: finalSubject,
        body: finalBody,
        eventType: eventType as EmailEventType,
        status: 'PENDING',
      },
    });


    try {

      // Send the email using Mailgun
      await mg.messages.create(
        process.env.MAILGUN_DOMAIN || "sandbox3d9f355d39f34feea98417e0364cf748.mailgun.org",
        {
          from: "Mailgun Sandbox <postmaster@sandbox3d9f355d39f34feea98417e0364cf748.mailgun.org>",
          to: [to],
          subject: finalSubject,
          text: finalBody,
        }
      );


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
      console.error('Mailgun error:', error);
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