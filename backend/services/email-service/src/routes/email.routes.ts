import { Router } from 'express';
import EmailController from '../controllers/email.controller';

const router = Router();

// Send an email
router.post('/emails', EmailController.sendEmail);

// Get email details by ID
router.get('/emails/:id', EmailController.getEmailById);

// Get all emails (optional: with filters like status or eventType)
router.get('/emails', EmailController.getAllEmails);

export default router;