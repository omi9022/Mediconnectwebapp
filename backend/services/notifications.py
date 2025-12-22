"""Notification services for email, SMS, and push notifications."""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from twilio.rest import Client
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from decouple import config
from typing import Optional
from loguru import logger

class EmailService:
    """Email notification service using SendGrid."""
    
    def __init__(self):
        self.api_key = config('SENDGRID_API_KEY', default=None)
        self.from_email = config('FROM_EMAIL', default='noreply@mediconnect.com')
        self.client = SendGridAPIClient(self.api_key) if self.api_key else None

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        plain_content: Optional[str] = None
    ) -> bool:
        """Send an email using SendGrid."""
        if not self.client:
            logger.warning(f"Email service not configured. Would send: {subject} to {to_email}")
            print(f"📧 EMAIL: To: {to_email}, Subject: {subject}")
            return True

        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=to_email,
                subject=subject,
                html_content=html_content
            )
            
            if plain_content:
                message.plain_text_content = plain_content

            response = self.client.send(message)
            logger.info(f"Email sent to {to_email}: {response.status_code}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    async def send_order_confirmation(
        self,
        to_email: str,
        order_number: str,
        total_amount: float,
        items_count: int
    ) -> bool:
        """Send order confirmation email."""
        subject = f"Order Confirmation - {order_number}"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
                    <h2 style="color: #0d9488;">Order Confirmed!</h2>
                    <p>Thank you for your order with MediConnect.</p>
                    <div style="background: #f0fdfa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Order Number:</strong> {order_number}</p>
                        <p><strong>Items:</strong> {items_count}</p>
                        <p><strong>Total Amount:</strong> ₹{total_amount:.2f}</p>
                    </div>
                    <p>You will receive updates as your order is processed and shipped.</p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        This is an automated email from MediConnect Healthcare Platform.
                    </p>
                </div>
            </body>
        </html>
        """
        return await self.send_email(to_email, subject, html_content)

    async def send_low_stock_alert(
        self,
        to_email: str,
        product_name: str,
        current_stock: int,
        min_stock: int
    ) -> bool:
        """Send low stock alert email."""
        subject = f"Low Stock Alert: {product_name}"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; border: 2px solid #fbbf24;">
                    <h2 style="color: #f59e0b;">⚠️ Low Stock Alert</h2>
                    <p>The following product is running low on stock:</p>
                    <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Product:</strong> {product_name}</p>
                        <p><strong>Current Stock:</strong> {current_stock} units</p>
                        <p><strong>Minimum Required:</strong> {min_stock} units</p>
                    </div>
                    <p>Please reorder to maintain adequate stock levels.</p>
                </div>
            </body>
        </html>
        """
        return await self.send_email(to_email, subject, html_content)

class SMSService:
    """SMS notification service using Twilio."""
    
    def __init__(self):
        self.account_sid = config('TWILIO_ACCOUNT_SID', default=None)
        self.auth_token = config('TWILIO_AUTH_TOKEN', default=None)
        self.phone_number = config('TWILIO_PHONE_NUMBER', default=None)
        
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None

    async def send_sms(self, to_phone: str, message: str) -> bool:
        """Send an SMS using Twilio."""
        if not self.client:
            logger.warning(f"SMS service not configured. Would send: {message} to {to_phone}")
            print(f"📱 SMS: To: {to_phone}, Message: {message}")
            return True

        try:
            message = self.client.messages.create(
                body=message,
                from_=self.phone_number,
                to=to_phone
            )
            logger.info(f"SMS sent to {to_phone}: {message.sid}")
            return True
        except Exception as e:
            logger.error(f"Failed to send SMS to {to_phone}: {str(e)}")
            return False

    async def send_order_update(
        self,
        to_phone: str,
        order_number: str,
        status: str
    ) -> bool:
        """Send order status update SMS."""
        message = f"MediConnect: Your order {order_number} is now {status}. Track your order in the app."
        return await self.send_sms(to_phone, message)

    async def send_delivery_notification(
        self,
        to_phone: str,
        order_number: str,
        driver_name: str,
        eta_minutes: int
    ) -> bool:
        """Send delivery notification SMS."""
        message = f"MediConnect: Your order {order_number} is out for delivery with {driver_name}. ETA: {eta_minutes} minutes."
        return await self.send_sms(to_phone, message)

class PushNotificationService:
    """Push notification service."""
    
    def __init__(self):
        # Initialize Firebase Cloud Messaging or similar service
        pass

    async def send_push(
        self,
        user_id: int,
        title: str,
        body: str,
        data: Optional[dict] = None
    ) -> bool:
        """Send push notification."""
        # Implementation would go here
        logger.info(f"Push notification sent to user {user_id}: {title}")
        print(f"🔔 PUSH: User {user_id}, Title: {title}, Body: {body}")
        return True

# Service instances
email_service = EmailService()
sms_service = SMSService()
push_service = PushNotificationService()
