// Função para mostrar/ocultar tópicos com animação suave
function toggleTopic(topicId) {
    const topic = document.getElementById(topicId);
    const header = document.querySelector(`[onclick="toggleTopic('${topicId}')]`);
    
    if (!topic || !header) {
        console.error(`Elemento não encontrado para ID ${topicId}`);
        return;
    }
    
    // Alterna a classe 'active' no cabeçalho
    header.classList.toggle('active');
    
    // Alterna a classe 'show' na lista com animação
    topic.classList.toggle('show');
    
    // Atualiza o ícone
    const icon = header.querySelector('.toggle-icon');
    if (icon) {
        icon.style.transform = topic.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
    }
}

// Função para mostrar uma oração
function showPrayer(prayerId, element) {
    const loadingAnimation = document.querySelector('.loading-animation');
    const prayerTitle = document.getElementById('prayer-title');
    const prayerContent = document.getElementById('prayer-content');
    
    // Remove a classe 'active' de todos os itens e adiciona ao clicado
    document.querySelectorAll('.prayer-list li').forEach(li => {
        li.classList.remove('active');
    });
    
    if (element) {
        element.classList.add('active');
    }
    
    // Mostra a animação de carregamento
    loadingAnimation.style.display = "block";
    
    // Limpa o conteúdo anterior
    prayerTitle.textContent = "";
    prayerContent.innerHTML = "";
    
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
                prayerContent.innerHTML = `<p class="error">${data.error}</p>`;
            } else {
                prayerTitle.textContent = data.titulo;
                prayerContent.innerHTML = formatPrayerText(data.conteudo);
                
                // Rolagem suave para o topo do conteúdo
                window.scrollTo({
                    top: document.querySelector('.middle-panel').offsetTop,
                    behavior: 'smooth'
                });
            }
        })
        .catch(error => {
            console.error("Erro ao buscar oração:", error);
            prayerTitle.textContent = "Erro";
            prayerContent.innerHTML = '<p class="error">Não foi possível carregar a oração.</p>';
        })
        .finally(() => {
            loadingAnimation.style.display = "none";
            
            // Fecha o menu mobile se estiver em uma tela pequena
            if (window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
}

// Função para formatar o texto da oração
function formatPrayerText(prayerText) {
    if (!prayerText) return '';
    
    const paragraphs = prayerText.split('\n\n');
    let formattedHTML = '';
    
    paragraphs.forEach(para => {
        if (!para.trim()) return;
        
        if (para.toLowerCase().includes('amém') || para.toLowerCase().includes('amen')) {
            formattedHTML += `<p class="amen">${para}</p>`;
        } else {
            const withLineBreaks = para.replace(/\n/g, '<br>');
            formattedHTML += `<p>${withLineBreaks}</p>`;
        }
    });
    
    return formattedHTML;
}

// Função para carregar as orações da API
function loadPrayers() {
    const loadingAnimation = document.querySelector('.loading-animation');
    const tradicionaisList = document.getElementById('oracoes-tradicionais');
    const especificasList = document.getElementById('oracoes-especificas');
    const novenasList = document.getElementById('oracoes-novenas');
    
    // Mostra a animação de carregamento
    loadingAnimation.style.display = "block";
    
    fetch('/api/oracoes')
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro na requisição: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Limpa as listas antes de adicionar novos itens
            tradicionaisList.innerHTML = '';
            especificasList.innerHTML = '';
            novenasList.innerHTML = '';
            
            // Adiciona as orações tradicionais (categoria_id = 1)
            const tradicionais = data.filter(oracao => oracao.categoria_id === 1);
            tradicionais.forEach(oracao => {
                const li = document.createElement('li');
                li.textContent = oracao.titulo;
                li.onclick = (e) => showPrayer(oracao.id, e.currentTarget);
                tradicionaisList.appendChild(li);
            });
            
            // Adiciona as orações específicas (categoria_id = 2)
            const especificas = data.filter(oracao => oracao.categoria_id === 2);
            especificas.forEach(oracao => {
                const li = document.createElement('li');
                li.textContent = oracao.titulo;
                li.onclick = (e) => showPrayer(oracao.id, e.currentTarget);
                especificasList.appendChild(li);
            });
            
            // Adiciona as novenas (categoria_id = 3)
            const novenas = data.filter(oracao => oracao.categoria_id === 3);
            novenas.forEach(oracao => {
                const li = document.createElement('li');
                li.textContent = oracao.titulo;
                li.onclick = (e) => showPrayer(oracao.id, e.currentTarget);
                novenasList.appendChild(li);
            });
            
            // Mostra a primeira categoria por padrão
            if (tradicionais.length > 0) {
                tradicionaisList.classList.add('show');
                document.querySelector('[onclick="toggleTopic(\'oracoes-tradicionais\')"]').classList.add('active');
            }
        })
        .catch(error => {
            console.error("Erro ao buscar orações:", error);
            const errorMsg = '<li class="error">Erro ao carregar as orações</li>';
            tradicionaisList.innerHTML = errorMsg;
            especificasList.innerHTML = errorMsg;
            novenasList.innerHTML = errorMsg;
        })
        .finally(() => {
            loadingAnimation.style.display = "none";
        });
}

// Função para mostrar/ocultar o menu mobile
function toggleMobileMenu() {
    const leftPanel = document.querySelector('.left-panel');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.overlay');
    
    leftPanel.classList.toggle('active');
    menuBtn.classList.toggle('active');
    
    if (leftPanel.classList.contains('active')) {
        overlay.classList.add('active');
        overlay.onclick = toggleMobileMenu; // Fecha o menu ao clicar no overlay
    } else {
        overlay.classList.remove('active');
    }
}

// Cria o overlay dinamicamente
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Cria o overlay para mobile
    createOverlay();
    
    // Carrega as orações
    loadPrayers();
    
    // Fecha o menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const leftPanel = document.querySelector('.left-panel');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            const overlay = document.querySelector('.overlay');
            
            leftPanel.classList.remove('active');
            menuBtn.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
});