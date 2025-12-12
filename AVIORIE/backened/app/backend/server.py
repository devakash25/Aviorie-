import smtplib
from email.mime.text import MIMEText

async def send_email_notification(to_email: str, subject: str, content: str, background_tasks: BackgroundTasks):
    def send():
        try:
            msg = MIMEText(content)
            msg['Subject'] = subject
            msg['From'] = 'your_email@example.com'
            msg['To'] = to_email
            
            with smtplib.SMTP('smtp.example.com', 587) as server:
                server.starttls()
                server.login('your_email@example.com', 'your_password')
                server.sendmail('your_email@example.com', to_email, msg.as_string())
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
    
    background_tasks.add_task(send)