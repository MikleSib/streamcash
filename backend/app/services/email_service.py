import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import List, Optional
from jinja2 import Template

from app.core.config import settings


class EmailService:
    def __init__(self):
        self.smtp_server = settings.EMAIL_HOST
        self.smtp_port = settings.EMAIL_PORT
        self.username = settings.EMAIL_HOST_USER
        self.password = settings.EMAIL_HOST_PASSWORD
        self.use_tls = settings.EMAIL_USE_TLS

    async def send_email(
        self,
        to_emails: List[str],
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
        attachments: Optional[List[str]] = None
    ) -> bool:
        """Отправить email"""
        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.username
            message["To"] = ", ".join(to_emails)

            if text_content:
                text_part = MIMEText(text_content, "plain")
                message.attach(text_part)

            html_part = MIMEText(html_content, "html")
            message.attach(html_part)

            if attachments:
                for attachment_path in attachments:
                    with open(attachment_path, "rb") as attachment:
                        part = MIMEBase('application', 'octet-stream')
                        part.set_payload(attachment.read())
                        encoders.encode_base64(part)
                        part.add_header(
                            'Content-Disposition',
                            f'attachment; filename= {attachment_path.split("/")[-1]}'
                        )
                        message.attach(part)

            context = ssl.create_default_context()
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls(context=context)
                if self.username and self.password:
                    server.login(self.username, self.password)
                text = message.as_string()
                server.sendmail(self.username, to_emails, text)

            print(f"Email sent successfully to: {', '.join(to_emails)}")
            return True

        except Exception as e:
            print(f"Failed to send email: {str(e)}")
            return False

    async def send_donation_notification(
        self,
        streamer_email: str,
        donor_name: str,
        amount: float,
        message: str,
        streamer_name: str
    ) -> bool:
        """Отправить уведомление о донате стримеру"""
        
        subject = f"💰 Новый донат от {donor_name} - {amount}₽"
        
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .donation-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .amount { font-size: 24px; font-weight: bold; color: #28a745; }
                .message { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0; font-style: italic; }
                .footer { background: #6c757d; color: white; padding: 20px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Новый донат!</h1>
                    <p>Кто-то поддержал ваш стрим</p>
                </div>
                <div class="content">
                    <p>Привет, {{ streamer_name }}!</p>
                    <p>У вас новый донат:</p>
                    
                    <div class="donation-info">
                        <p><strong>От:</strong> {{ donor_name }}</p>
                        <p><strong>Сумма:</strong> <span class="amount">{{ amount }}₽</span></p>
                        {% if message %}
                        <div class="message">
                            <strong>Сообщение:</strong><br>
                            "{{ message }}"
                        </div>
                        {% endif %}
                    </div>
                    
                    <p>Продолжайте в том же духе! 🚀</p>
                    
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="{{ frontend_url }}/dashboard" 
                           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Перейти в панель управления
                        </a>
                    </p>
                </div>
                <div class="footer">
                    <p>СтримКэш - лучший сервис для приёма донатов</p>
                    <p>Это автоматическое уведомление. Не отвечайте на это письмо.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        template = Template(html_template)
        html_content = template.render(
            streamer_name=streamer_name,
            donor_name=donor_name,
            amount=amount,
            message=message,
            frontend_url=settings.FRONTEND_URL
        )
        
        return await self.send_email(
            to_emails=[streamer_email],
            subject=subject,
            html_content=html_content
        )

    async def send_welcome_email(self, user_email: str, username: str) -> bool:
        """Отправить приветственное письмо новому пользователю"""
        
        subject = f"Добро пожаловать в СтримКэш, {username}!"
        
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .feature { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
                .cta-button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
                .footer { background: #6c757d; color: white; padding: 20px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Добро пожаловать!</h1>
                    <p>Спасибо за регистрацию в СтримКэш</p>
                </div>
                <div class="content">
                    <p>Привет, {{ username }}!</p>
                    <p>Поздравляем с успешной регистрацией! Теперь вы можете:</p>
                    
                    <div class="feature">
                        <h3>⚡ Получать донаты мгновенно</h3>
                        <p>Настройте красивые алерты и начните зарабатывать уже сегодня</p>
                    </div>
                    
                    <div class="feature">
                        <h3>🎨 Кастомизировать алерты</h3>
                        <p>Загружайте свои гифки, звуки и создавайте уникальные уведомления</p>
                    </div>
                    
                    <div class="feature">
                        <h3>📊 Отслеживать статистику</h3>
                        <p>Анализируйте доходы и следите за активностью ваших зрителей</p>
                    </div>
                    
                    <p style="text-align: center;">
                        <a href="{{ frontend_url }}/dashboard" class="cta-button">
                            Начать настройку
                        </a>
                    </p>
                    
                    <p>Если у вас есть вопросы, обращайтесь в нашу поддержку!</p>
                </div>
                <div class="footer">
                    <p>СтримКэш - лучший сервис для приёма донатов</p>
                    <p>Если вы получили это письмо по ошибке, просто проигнорируйте его.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        template = Template(html_template)
        html_content = template.render(
            username=username,
            frontend_url=settings.FRONTEND_URL
        )
        
        return await self.send_email(
            to_emails=[user_email],
            subject=subject,
            html_content=html_content
        )

    async def send_password_reset_email(self, user_email: str, reset_token: str) -> bool:
        """Отправить письмо для сброса пароля"""
        
        subject = "Сброс пароля СтримКэш"
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .cta-button { background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
                .footer { background: #6c757d; color: white; padding: 20px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Сброс пароля</h1>
                    <p>Запрос на восстановление доступа</p>
                </div>
                <div class="content">
                    <p>Вы запросили сброс пароля для вашего аккаунта СтримКэш.</p>
                    
                    <div class="warning">
                        <strong>⚠️ Важно:</strong> Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
                    </div>
                    
                    <p>Для создания нового пароля нажмите на кнопку ниже:</p>
                    
                    <p style="text-align: center;">
                        <a href="{{ reset_url }}" class="cta-button">
                            Сбросить пароль
                        </a>
                    </p>
                    
                    <p style="font-size: 12px; color: #6c757d;">
                        Ссылка действительна в течение 1 часа.<br>
                        Если кнопка не работает, скопируйте эту ссылку в браузер:<br>
                        {{ reset_url }}
                    </p>
                </div>
                <div class="footer">
                    <p>СтримКэш - лучший сервис для приёма донатов</p>
                    <p>Это автоматическое уведомление. Не отвечайте на это письмо.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        template = Template(html_template)
        html_content = template.render(
            reset_url=reset_url
        )
        
        return await self.send_email(
            to_emails=[user_email],
            subject=subject,
            html_content=html_content
        )


email_service = EmailService()