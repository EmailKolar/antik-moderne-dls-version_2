import { Request, Response } from 'express';
import EmailService from '../services/email.service';

class EmailController {
  // Send an email
  async sendEmail(req: Request, res: Response) {
    try {
      const { to, subject, body, eventType } = req.body;
      const email = await EmailService.sendEmail(to, subject, body, eventType);
      res.status(201).json(email);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }

  // Get email details by ID
  async getEmailById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const email = await EmailService.getEmailById(id);
      if (!email) {
        return res.status(404).json({ error: 'Email not found' });
      }
      res.status(200).json(email);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }

  // Get all emails
  async getAllEmails(req: Request, res: Response) {
    try {
      const { status, eventType } = req.query;
      const emails = await EmailService.getAllEmails(status as string, eventType as string);
      res.status(200).json(emails);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }
}

export default new EmailController();