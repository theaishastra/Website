/* ═══════════════════════════════════════════════════════════════
   AI SHASTRA — CONTACT FORM BACKEND (Google Apps Script)

   SETUP
   1. Go to https://sheets.google.com and create a new blank Sheet.
      Rename it "AI Shastra Contact Submissions" (or anything you like).
   2. In the Sheet: Extensions → Apps Script. Delete the default
      code and paste this whole file in.
   3. Update ADMIN_EMAIL below if needed (defaults to your Gmail).
   4. Click Deploy → New deployment → type: "Web app".
        - Execute as: Me
        - Who has access: Anyone
      Click Deploy, authorize the permissions it asks for.
   5. Copy the "Web app URL" (ends in /exec) it gives you.
   6. Paste that URL into APPSCRIPT_URL in Website/contact-form.js.

   Re-deploy (Deploy → Manage deployments → Edit → New version)
   any time you change this file — editing alone does not update
   the live URL's code.
   ═══════════════════════════════════════════════════════════════ */

const ADMIN_EMAIL = 'theaishastra@gmail.com';
const SHEET_NAME = 'Submissions';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const fullName = (data.full_name || '').toString().trim();
    const email = (data.email || '').toString().trim();
    const phone = (data.phone || '').toString().trim();
    const message = (data.message || '').toString().trim();

    if (!fullName || !email || !message) {
      return jsonResponse({ ok: false, error: 'Missing required fields.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ ok: false, error: 'Invalid email address.' });
    }

    appendToSheet(fullName, email, phone, message);
    sendAdminNotification(fullName, email, phone, message);
    sendVisitorAutoReply(fullName, email);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Full Name', 'Email', 'Phone', 'Message']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendToSheet(fullName, email, phone, message) {
  getSheet().appendRow([new Date(), fullName, email, phone, message]);
}

function sendAdminNotification(fullName, email, phone, message) {
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Contact: ${fullName}`,
    replyTo: email,
    body:
      `New contact form submission from The AI Shastra website.\n\n` +
      `Name: ${fullName}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || '(not provided)'}\n\n` +
      `Message:\n${message}`,
  });
}

function sendVisitorAutoReply(fullName, email) {
  MailApp.sendEmail({
    to: email,
    subject: `We've received your message — The AI Shastra`,
    replyTo: ADMIN_EMAIL,
    body:
      `Hi ${fullName},\n\n` +
      `Thanks for reaching out to The AI Shastra! We've received your message ` +
      `and typically respond within 4 hours.\n\n` +
      `If it's urgent, you can also reach us on WhatsApp at +91 83285 26155.\n\n` +
      `— The AI Shastra Team`,
  });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
