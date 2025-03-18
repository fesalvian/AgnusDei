document.getElementById('bugReportForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Evita o envio tradicional do formulário

    const formData = new FormData(this);  // Captura todos os dados do formulário, incluindo o arquivo

    fetch('/enviar-bug', {
        method: 'POST',
        body: formData  // Envia os dados como FormData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Relato de bug enviado com sucesso! Obrigado por ajudar a melhorar o site.');
        } else {
            alert('Erro ao enviar o relato. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});