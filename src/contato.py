from flask import request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from ..app import app

@app.route('/enviar-bug', methods=['POST'])
def enviar_bug():
    nome = request.form.get('name')
    email = request.form.get('email')
    mensagem = request.form.get('message')
    screenshot = request.files.get('screenshot')  # Captura o arquivo enviado

    # Configurações do e-mail
    remetente = "seu-email@dominio.com"
    senha = "sua-senha"
    destinatario = "seu-email@dominio.com"  # E-mail para receber o relato
    assunto = f"Relato de Bug - {nome}"

    # Cria a mensagem
    msg = MIMEMultipart()
    msg['Subject'] = assunto
    msg['From'] = remetente
    msg['To'] = destinatario

    # Corpo do e-mail
    corpo = f"""
    Nome: {nome}
    E-mail: {email}
    Mensagem:
    {mensagem}
    """
    msg.attach(MIMEText(corpo, 'plain'))

    # Anexa o screenshot, se enviado
    if screenshot:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(screenshot.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename={screenshot.filename}')
        msg.attach(part)

    try:
        # Envia o e-mail
        with smtplib.SMTP('smtp.dominio.com', 587) as server:  # Substitua pelo seu servidor SMTP
            server.starttls()
            server.login(remetente, senha)
            server.sendmail(remetente, destinatario, msg.as_string())
        return jsonify({"success": True})
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")
        return jsonify({"success": False})