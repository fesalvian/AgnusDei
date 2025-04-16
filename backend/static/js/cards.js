document.addEventListener("DOMContentLoaded", function () {
    // URL da API
    const apiUrl = "/api/personagens";

    // Container onde os cards serão exibidos
    const container = document.getElementById("cards-grid");
    if (!container) {
        console.error("Elemento 'cards-grid' não encontrado.");
        return;
    }

    // Elemento da animação de carregamento
    const loadingAnimation = document.getElementById("loading-animation");

    // Função para escapar caracteres especiais
    const escapeHtml = (str) => {
        if (!str) return ""; // Se o valor for null ou undefined, retorna uma string vazia
        return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };

    // Função para buscar os personagens
    async function fetchPersonagens() {
        try {
            console.log("Iniciando busca de personagens...");
                        // Mostra a animação de carregamento
                        loadingAnimation.style.display = "flex";
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Erro ao buscar personagens");
            }
            const personagens = await response.json();

            // Exibe os personagens na página
            personagens.forEach(personagem => {
                const card = document.createElement("a");
                card.className = "card";
                card.href = `/personagem/${personagem.id}`; // Link para a página de detalhes
                card.innerHTML = `
                    <img src="${escapeHtml(personagem.img)}" alt="${escapeHtml(personagem.nome)}">
                    <div class="card-content">
                        <h3>${escapeHtml(personagem.nome)}</h3>
                        <p>${escapeHtml(personagem.subtitulo)}</p>
                    </div>
                `;
                container.appendChild(card);
            });
        } catch (error) {
            console.error("Erro:", error);
            container.innerHTML = "<p>Erro ao carregar os personagens.</p>";
        }finally {
            // Esconde a animação de carregamento, independentemente do resultado
            loadingAnimation.style.display = "none";
        }
    }

    // Chama a função para buscar os personagens
    fetchPersonagens();
});