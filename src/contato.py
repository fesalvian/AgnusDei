from flask import request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT"))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
print("EMAIL_USER:", EMAIL_USER)
print("EMAIL_PASS:", EMAIL_PASS)

def relatar_bug():
    try:
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")
        screenshot = request.files.get("screenshot")

        if not name or not email or not message:
            return jsonify({"error": "Todos os campos são obrigatórios"}), 400

        # Criando o corpo do e-mail
        msg = MIMEMultipart()
        msg["From"] = EMAIL_USER
        msg["To"] = EMAIL_USER
        msg["Subject"] = "Novo Bug Reportado no Site"

        body = f"""
        Novo bug reportado!

        Nome: {name}
        E-mail: {email}

        Mensagem:
        {message}
        """

        msg.attach(MIMEText(body, "plain"))

        # Se houver uma imagem, adiciona como anexo
        if screenshot and screenshot.filename:
            filename = screenshot.filename
            attachment = MIMEBase("application", "octet-stream")
            attachment.set_payload(screenshot.read())
            encoders.encode_base64(attachment)
            attachment.add_header(
                "Content-Disposition",
                f"attachment; filename={filename}"
            )
            msg.attach(attachment)

        # Enviando o e-mail
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, EMAIL_USER, msg.as_string())

        return jsonify({"message": "Bug reportado com sucesso!"})

    except Exception as e:
        return jsonify({"error": f"Erro ao processar o pedido: {str(e)}"}), 500
    
print("Função relatar_bug definida.")

import smtplib

try:
    server = smtplib.SMTP("smtp-relay.brevo.com", 587)
    server.starttls()
    server.login("EMAIL_USER", "EMAIL_PASS")
    print("✅ Login bem-sucedido!")
except Exception as e:
    print("❌ Erro:", e)
finally:
    server.quit()
