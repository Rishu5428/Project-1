import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

logger = logging.getLogger(__name__)

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = os.environ.get("SMTP_EMAIL", "craftmywebsite1@gmail.com")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "craftmywebsite1@gmail.com")

async def send_email(to_email: str, subject: str, body: str):
    """Send email using Gmail SMTP"""
    try:
        message = MIMEMultipart()
        message["From"] = SMTP_EMAIL
        message["To"] = to_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "html"))

        await aiosmtplib.send(
            message,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_EMAIL,
            password=SMTP_PASSWORD,
            start_tls=True,
        )
        logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

async def send_contact_notification(contact_data: dict):
    """Send notification email when someone submits contact form"""
    subject = f"New Contact Form Submission - Astha Bliss Cafe"
    body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #2d5016; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
                    New Contact Form Submission
                </h2>
                <p><strong>Name:</strong> {contact_data.get('name')}</p>
                <p><strong>Email:</strong> {contact_data.get('email')}</p>
                <p><strong>Phone:</strong> {contact_data.get('phone', 'Not provided')}</p>
                <p><strong>Message:</strong></p>
                <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d4af37; border-radius: 5px;">
                    {contact_data.get('message')}
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    This is an automated notification from Astha Bliss Cafe website.
                </p>
            </div>
        </body>
    </html>
    """
    await send_email(ADMIN_EMAIL, subject, body)

async def send_review_notification(review_data: dict):
    """Send notification email when someone submits a review"""
    subject = f"New Review Submitted - Astha Bliss Cafe"
    stars = "⭐" * review_data.get('rating', 0)
    body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #2d5016; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
                    New Review Submitted
                </h2>
                <p><strong>Customer Name:</strong> {review_data.get('name')}</p>
                <p><strong>Type:</strong> {review_data.get('customer_type')}</p>
                <p><strong>Rating:</strong> {stars} ({review_data.get('rating')}/5)</p>
                <p><strong>Review:</strong></p>
                <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d4af37; border-radius: 5px;">
                    {review_data.get('review')}
                </p>
                <p><strong>Status:</strong> <span style="color: #ff9800;">Pending Approval</span></p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    Log in to the admin panel to approve or manage this review.
                </p>
            </div>
        </body>
    </html>
    """
    await send_email(ADMIN_EMAIL, subject, body)
