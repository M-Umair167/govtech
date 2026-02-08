from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from app.api.deps import get_current_user
from app.models.user import User
from app.core.config import settings
import smtplib
from email.message import EmailMessage

router = APIRouter()

class ContactMessage(BaseModel):
    name: str
    email: str
    subject: str
    message: str

@router.post("/contact/send")
async def send_contact_message(
    form_data: ContactMessage,
    current_user: User = Depends(get_current_user)
):
    """
    Send an email to the admin from the contact form.
    Only logged-in users can access this endpoint (enforced by get_current_user).
    """
    if not settings.MAIL_USERNAME or not settings.MAIL_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Email configuration is missing on the server."
        )

    try:
        # Create the email content
        email = EmailMessage()
        email["Subject"] = f"New Contact Message: {form_data.subject}"
        email["From"] = settings.MAIL_USERNAME
        email["To"] = settings.MAIL_USERNAME  # Send to self (admin)
        email["Reply-To"] = current_user.email  # Allow replying to the user

        # Email Body
        body_content = f"""
        You have received a new message from the GovTech Contact Form.

        User Details:
        ------------
        Name: {form_data.name}
        Email: {form_data.email} (Account Email: {current_user.email})

        Message:
        --------
        {form_data.message}
        """
        email.set_content(body_content)

        # Send via Gmail SMTP
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
            smtp.send_message(email)

        return {"message": "Message sent successfully"}

    except Exception as e:
        print(f"Error sending email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send message. Please try again later."
        )
