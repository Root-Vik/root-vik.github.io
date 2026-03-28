const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the parent directory (the website)
app.use(express.static(path.join(__dirname, '..')));

// SMTP Configuration (Brevo / Sendinblue)
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: 'a5cfcb001@smtp-brevo.com',
    pass: 'nsRbcJ5Xq1VKWmzp'
  }
});

// Notification recipients
const NOTIFY_EMAILS = [
  'hrutvikbarot@gmail.com',
  'h.barot1997@gmail.com'
];

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message, service, phone, company, budget } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Simple email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    // Email to admin / team
    await transporter.sendMail({
      from: '"Digital Gabbar" <noreply@vivah-setu.in>',
      to: NOTIFY_EMAILS.join(', '),
      subject: `New Contact Form Submission — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#0c0c0d;padding:24px;border-radius:10px;color:#e8e8ea">
            <h2 style="color:#8b5cf6;margin-top:0">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr style="border-bottom:1px solid #222226">
                <td style="padding:12px 0;color:#6b6b78;width:120px;vertical-align:top">Name</td>
                <td style="padding:12px 0;color:#e8e8ea"><strong>${escapeHtml(name)}</strong></td>
              </tr>
              <tr style="border-bottom:1px solid #222226">
                <td style="padding:12px 0;color:#6b6b78;vertical-align:top">Email</td>
                <td style="padding:12px 0;color:#8b5cf6"><a href="mailto:${escapeHtml(email)}" style="color:#8b5cf6">${escapeHtml(email)}</a></td>
              </tr>
              ${phone ? `<tr style="border-bottom:1px solid #222226"><td style="padding:12px 0;color:#6b6b78;vertical-align:top">Phone</td><td style="padding:12px 0;color:#e8e8ea">${escapeHtml(phone)}</td></tr>` : ''}
              ${company ? `<tr style="border-bottom:1px solid #222226"><td style="padding:12px 0;color:#6b6b78;vertical-align:top">Company</td><td style="padding:12px 0;color:#e8e8ea">${escapeHtml(company)}</td></tr>` : ''}
              ${service ? `<tr style="border-bottom:1px solid #222226"><td style="padding:12px 0;color:#6b6b78;vertical-align:top">Service</td><td style="padding:12px 0;color:#e8e8ea">${escapeHtml(service)}</td></tr>` : ''}
              ${budget ? `<tr style="border-bottom:1px solid #222226"><td style="padding:12px 0;color:#6b6b78;vertical-align:top">Budget</td><td style="padding:12px 0;color:#e8e8ea">${escapeHtml(budget)}</td></tr>` : ''}
              <tr>
                <td style="padding:12px 0;color:#6b6b78;vertical-align:top">Message</td>
                <td style="padding:12px 0;color:#e8e8ea;white-space:pre-wrap">${escapeHtml(message)}</td>
              </tr>
            </table>
          </div>
          <p style="color:#6b6b78;font-size:12px;margin-top:16px;text-align:center">Sent from digi-gabbar.xyz contact form</p>
        </div>
      `
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: '"Digital Gabbar" <noreply@vivah-setu.in>',
      to: email,
      subject: 'Thank you for contacting Digital Gabbar',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#0c0c0d;padding:32px;border-radius:10px;color:#e8e8ea">
            <h2 style="color:#8b5cf6;margin-top:0">Thank you, ${escapeHtml(name)}!</h2>
            <p style="color:#9494a0;line-height:1.7">We've received your message and will get back to you within 24 hours.</p>
            <p style="color:#9494a0;line-height:1.7">In the meantime, feel free to reach us directly:</p>
            <p style="margin:16px 0">
              <span style="color:#6b6b78">Email:</span> <a href="mailto:rootvik23@gmail.com" style="color:#8b5cf6">rootvik23@gmail.com</a><br>
              <span style="color:#6b6b78">Phone:</span> <a href="tel:+917567279350" style="color:#8b5cf6">+91 7567279350</a>
            </p>
            <hr style="border:none;border-top:1px solid #222226;margin:24px 0">
            <p style="color:#6b6b78;font-size:13px;margin:0">Best regards,<br><strong style="color:#e8e8ea">Digital Gabbar</strong><br>Software Development Studio</p>
          </div>
        </div>
      `
    });

    res.json({ success: true, message: 'Email sent successfully.' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

// HTML escaping utility
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// SPA fallback — serve index.html for unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Digital Gabbar API running on http://localhost:${PORT}`);
});
