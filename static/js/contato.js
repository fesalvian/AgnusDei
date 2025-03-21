document.getElementById("bugReportForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let formData = new FormData(this);

    try {
        let response = await fetch("/api/relatar-bug", {
            method: "POST",
            body: formData
        });

        let result = await response.json();

        if (response.ok) {
            alert("Bug relatado com sucesso! Obrigado pelo seu feedback.");
            this.reset();
        } else {
            alert("Erro ao enviar o bug: " + result.error);
        }
    } catch (error) {
        alert("Erro na conexão com o servidor.");
    }
});