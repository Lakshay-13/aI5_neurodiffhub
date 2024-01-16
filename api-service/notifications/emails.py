import os
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig


conf = ConnectionConfig(
    MAIL_USERNAME="neurodiff",
    MAIL_PASSWORD="addvvgwqvfmnbjnq",
    MAIL_FROM="admin@neurodiff.io",
    MAIL_FROM_NAME="NeuroDiff",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_TLS=True,
    MAIL_SSL=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER='./templates/email'
)


def send_email(background_tasks: BackgroundTasks, subject: str, email_to: str, body: dict):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        template_body=body,
        subtype='html',
    )

    fm = FastMail(conf)

    background_tasks.add_task(
        fm.send_message, message, template_name='resetpassword.html')


def send_notification_email(background_tasks: BackgroundTasks, subject: str, email_to: str, body: dict):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        template_body=body,
        subtype='html',
    )

    fm = FastMail(conf)

    background_tasks.add_task(
        fm.send_message, message, template_name='projectmail.html')

def send_detailsnotification_email(background_tasks: BackgroundTasks, subject: str, email_to: list, body: dict):
    message = MessageSchema(
        subject=subject,
        recipients=email_to,
        template_body=body,
        subtype='html',
    )

    fm = FastMail(conf)

    background_tasks.add_task(
        fm.send_message, message, template_name='projectdeetsmail.html')
