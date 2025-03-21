from flask import request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_HOST = "smtp.office365.com"  # Para Outlook/Hotmail
EMAIL_PORT = 587
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

def relatar_bug():
    try:
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")
        screenshot = request.files.get("screenshot")

        if not name or not email or not message:
            return jsonify({"error": "Todos os campos são obrigatórios"}), 400

        # Criando e-mail
        msg = MIMEMultipart()
        msg["From"] = EMAIL_USER
        msg["To"] = EMAIL_USER
        msg["Subject"] = "Novo Bug Reportado no Site"

        body = f"Nome: {name}\nE-mail: {email}\n\nDescrição do Bug:\n{message}"
        msg.attach(MIMEText(body, "plain"))

        # Se houver uma imagem anexada
        if screenshot:
            filename = screenshot.filename
            attachment = MIMEBase("application", "octet-stream")
            attachment.set_payload(screenshot.read())
            encoders.encode_base64(attachment)
            attachment.add_header("Content-Disposition", f"attachment; filename={filename}")
            msg.attach(attachment)

        # Enviar o e-mail
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, EMAIL_USER, msg.as_string())
        server.quit()

        return jsonify({"message": "Bug reportado com sucesso!"})

    except Exception as e:
        return jsonify({"error": f"Erro ao processar o pedido: {str(e)}"}), 500
    
print("Função relatar_bug definida.")