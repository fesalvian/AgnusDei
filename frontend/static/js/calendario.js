document.addEventListener("DOMContentLoaded", function () {
    const calendarioSection = document.getElementById("calendario-liturgico");

    async function carregarCalendarioLiturgico() {
        try {
            const response = await fetch("https://liturgia.up.railway.app/v2/");
            if (!response.ok) throw new Error("Erro ao buscar os dados da API");
    
            const dados = await response.json();
            console.log("Resposta da API:", dados); // Verificar a estrutura no console
    
            // Ajustando para a estrutura correta da API
            const primeiraLeitura = dados.leituras?.primeiraLeitura?.[0]?.referencia || "Não disponível";
            const salmo = dados.leituras?.salmo?.[0]?.referencia || "Não disponível";
            const evangelho = dados.leituras?.evangelho?.[0]?.referencia || "Não disponível";
    
            document.getElementById("calendario-liturgico").innerHTML = `
                <h2>Liturgia do Dia</h2>
                <p><strong>Data:</strong> ${dados.data || "Não disponível"}</p>
                <p><strong>Cor Litúrgica:</strong> ${dados.cor || "Não disponível"}</p>
                <p><strong>1ª Leitura:</strong> ${primeiraLeitura}</p>
                <p><strong>Salmo:</strong> ${salmo}</p>
                <p><strong>Evangelho:</strong> ${evangelho}</p>
                <p><strong>Oração da Coleta:</strong> ${dados.oracoes.coleta}</p>
                <p><strong>Oferendas:</strong> ${dados.oracoes.oferendas}</p>
                <p><strong>Comunhão:</strong> ${dados.oracoes.comunhao}</p>

                <h3><strong>Primeira Leitura:</strong> ${dados.leituras.primeiraLeitura[0].titulo, "-", dados.leituras.primeiraLeitura[0].referencia}</h3>
                <p><strong>Texto da Primeira Leitura:</strong> ${dados.leituras.primeiraLeitura[0].texto}</p>

                <h3><strong>Salmo Responsorial:</strong> ${dados.leituras.salmo[0].referencia}</h3>
                <p><strong>Texto do Salmo:</strong> ${dados.leituras.salmo[0].texto}</p>

                <h3><strong>Evangelho:</strong> ${dados.leituras.evangelho[0].titulo, "-", dados.leituras.evangelho[0].referencia}</h3>
                <p><strong>Texto do Evangelho:</strong> ${dados.leituras.evangelho[0].texto}</p>

                <p><strong>Antífona de Entrada:</strong> ${dados.antifonas.entrada}</p>
                <p><strong>Antífona de Comunhão:</strong> ${dados.antifonas.comunhao}</p>
            `;
        } catch (error) {
            console.error("Erro ao carregar calendário litúrgico:", error);
            document.getElementById("calendario-liturgico").innerHTML = "<p>Não foi possível carregar a liturgia do dia.</p>";
        }
    }
    
    carregarCalendarioLiturgico();
    

});
