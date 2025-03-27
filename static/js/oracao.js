// Função para mostrar/ocultar tópicos
function toggleTopic(topicId) {
    const topic = document.getElementById(topicId);
    if (!topic) {
        console.error(`Elemento com ID ${topicId} não encontrado.`);
        return;
    }
    console.log(`Alternando visibilidade do elemento com ID ${topicId}`);
    topic.classList.toggle('hidden');
}

// Função para mostrar/ocultar seções
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const icon = document.getElementById(`icon-${sectionId}`);
    if (section.style.display === "none") {
        section.style.display = "block";
        icon.textContent = "-";
    } else {
        section.style.display = "none";
        icon.textContent = "+";
    }
}

function showPrayer(prayerId) {
    const loadingAnimation = document.getElementById('loading-animation-oracoes');
    const prayerTitle = document.getElementById('prayer-title');
    const prayerContent = document.getElementById('prayer-content');

    // Mostra a animação de carregamento
    loadingAnimation.style.display = "flex";

    // Limpa o conteúdo anterior
    prayerTitle.textContent = "";
    prayerContent.innerHTML = ""; // Usar innerHTML para limpeza também

    fetch(`/api/oracoes/${prayerId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro na requisição: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                prayerTitle.textContent = "Erro";
                prayerContent.innerHTML = data.error; // Usar innerHTML para mensagens de erro também
            } else {
                prayerTitle.textContent = data.titulo;
                // 🔥 Substituição crucial aqui - formata o texto com parágrafos e <br>:
                prayerContent.innerHTML = formatPrayerText(data.conteudo); 
            }
        })
        .catch(error => {
            console.error("Erro ao buscar oração:", error);
            prayerTitle.textContent = "Erro";
            prayerContent.innerHTML = "Não foi possível carregar a oração.";
        })
        .finally(() => {
            loadingAnimation.style.display = "none";
        });
}



// Função para carregar as orações da API
function loadPrayers() {
    const loadingAnimation = document.getElementById('loading-animation-oracoes');
    const tradicionaisList = document.getElementById('oracoes-tradicionais');
    const especificasList = document.getElementById('oracoes-especificas');
    const novenasList = document.getElementById('oracoes-novenas');

    // Mostra a animação de carregamento
    loadingAnimation.style.display = "flex";

    // Limpa as listas antes de adicionar novos itens
    tradicionaisList.innerHTML = '';
    especificasList.innerHTML = '';
    novenasList.innerHTML = '';

    fetch('/api/oracoes')
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro na requisição: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dados recebidos da API:", data);  // Log dos dados recebidos

            // Filtra e adiciona as orações tradicionais (categoria_id = 1)
            const tradicionais = data.filter(oracao => oracao.categoria_id === 1);
            console.log("Orações tradicionais filtradas:", tradicionais);  // Log das orações tradicionais
            tradicionais.forEach(oracao => {
                console.log("Adicionando oração tradicional:", oracao.titulo);  // Log de cada oração
                const li = document.createElement('li');
                li.textContent = oracao.titulo;
                li.onclick = () => showPrayer(oracao.id);
                tradicionaisList.appendChild(li);
            });

            // Filtra e adiciona as orações específicas (categoria_id = 2)
            const especificas = data.filter(oracao => oracao.categoria_id === 2);
            console.log("Orações específicas filtradas:", especificas);  // Log das orações específicas
            especificas.forEach(oracao => {
                console.log("Adicionando oração específica:", oracao.titulo);  // Log de cada oração
                const li = document.createElement('li');
                li.textContent = oracao.titulo;
                li.onclick = () => showPrayer(oracao.id);
                especificasList.appendChild(li);
            });

            // Filtra e adiciona as orações específicas (categoria_id = 3)
            const novenas = data.filter(oracao => oracao.categoria_id === 3);
            console.log("Orações Novenas filtradas:", novenas);  // Log das orações novenas
            novenas.forEach(oracao => {
                console.log("Adicionando oração novena:", oracao.titulo);  // Log de cada oração
                const li = document.createElement('li');
                li.textContent = oracao.titulo;
                li.onclick = () => showPrayer(oracao.id);
                novenasList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Erro ao buscar orações:", error);
            tradicionaisList.innerHTML = "<p>Erro ao carregar as orações.</p>";
            especificasList.innerHTML = "<p>Erro ao carregar as orações.</p>";
            novenasList.innerHTML = "<p>Erro ao carregar as orações.</p>";
        })
        .finally(() => {
            // Esconde a animação de carregamento, independentemente do resultado
            loadingAnimation.style.display = "none";
        });
}

function formatPrayerText(prayerText) {
    // Divide o texto em parágrafos (assumindo que estão separados por quebras de linha no BD)
    const paragraphs = prayerText.split('\n\n');
    
    let formattedHTML = '';
    
    paragraphs.forEach(para => {
        if (para.toLowerCase().includes('amém')) {
            formattedHTML += `<p class="amen">${para}</p>`;
        } else {
            // Substitui quebras de linha simples por <br>
            const withLineBreaks = para.replace(/\n/g, '<br>');
            formattedHTML += `<p>${withLineBreaks}</p>`;
        }
    });
    
    return formattedHTML;
}

// Carrega as orações quando a página é carregada
// Função para mostrar/ocultar o menu em dispositivos móveis
function toggleMobileMenu() {
    const leftPanel = document.querySelector('.left-panel');
    leftPanel.classList.toggle('collapsed');

    // Ajuste para evitar sobreposição
    const overlay = document.querySelector('.overlay');
    if (leftPanel.classList.contains('active')) {
        if (!overlay) {
            createOverlay();
        }
    } else {
        removeOverlay();
    }
}
// Modifique o event listener existente para fechar o menu após seleção (mobile)
document.addEventListener('DOMContentLoaded', function() {
    loadPrayers();
    
    // Fecha o menu mobile quando um item é selecionado
    document.querySelectorAll('.left-panel li').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768 && e.target.closest('.left-panel li')) 
            {
                document.querySelector('.left-panel').classList.add('collapsed');
            }
        });
    });
});