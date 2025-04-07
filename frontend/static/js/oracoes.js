// ==============================================
// FUNÇÕES GLOBAIS (para eventos onclick no HTML)
// ==============================================

// Versão robusta da função toggleTopic
function toggleTopic(topicId) {
    console.log(`Tentando alternar: ${topicId}`); // Para debug
    
    // 1. Encontre a lista de orações
    const topicList = document.getElementById(topicId);
    if (!topicList) {
        console.error(`Elemento com ID ${topicId} não encontrado no DOM`);
        return;
    }

    // 2. Encontre o header correspondente
    let categoryHeader = null;
    const headers = document.querySelectorAll('.category-header');
    
    headers.forEach(header => {
        if (header.getAttribute('onclick')?.includes(topicId)) {
            categoryHeader = header;
        }
    });

    if (!categoryHeader) {
        console.error(`Header para ${topicId} não encontrado`);
        return;
    }

    // 3. Execute a lógica de toggle
    topicList.classList.toggle('expanded');
    
    // 4. Atualize o ícone
    const icon = categoryHeader.querySelector('.toggle-icon');
    if (icon) {
        icon.style.transform = topicList.classList.contains('expanded') 
            ? 'rotate(180deg)' 
            : 'rotate(0)';
    }
}

// Função para debug - verifique no console do navegador
function debugElements() {
    console.log('Elementos encontrados:', {
        tradicionais: document.getElementById('oracoes-tradicionais'),
        especificas: document.getElementById('oracoes-especificas'),
        novenas: document.getElementById('oracoes-novenas'),
        headers: document.querySelectorAll('.category-header')
    });
}

// Chame esta função no console para verificar os elementos
// debugElements();
function toggleMobileMenu() {
    const leftPanel = document.querySelector('.left-panel');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.overlay');
    
    leftPanel.classList.toggle('active');
    menuBtn.classList.toggle('active');
    
    if (leftPanel.classList.contains('active')) {
        overlay.classList.add('active');
        overlay.onclick = toggleMobileMenu;
    } else {
        overlay.classList.remove('active');
    }
}

// ==============================================
// MÓDULO PRINCIPAL (executado quando DOM estiver pronto)
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa componentes
    initOverlay();
    loadPrayers();
    setupEventListeners();
    
    // Fecha menu quando redimensionar para desktop
    window.addEventListener('resize', handleWindowResize);
});

// ==============================================
// FUNÇÕES DE APOIO (escopo do módulo)
// ==============================================

function initOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
}

function handleWindowResize() {
    if (window.innerWidth > 768) {
        const leftPanel = document.querySelector('.left-panel');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const overlay = document.querySelector('.overlay');
        
        leftPanel.classList.remove('active');
        menuBtn.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function setupEventListeners() {
    // Pode adicionar event listeners aqui se migrar de onclick
    // document.querySelector('.mobile-menu-btn').addEventListener('click', toggleMobileMenu);
}

// ==============================================
// FUNÇÕES DE CARREGAMENTO DE DADOS
// ==============================================

async function loadPrayers() {
    const loadingAnimation = document.querySelector('.loading-animation');
    const lists = {
        tradicionais: document.getElementById('oracoes-tradicionais'),
        especificas: document.getElementById('oracoes-especificas'),
        novenas: document.getElementById('oracoes-novenas')
    };
    
    try {
        loadingAnimation.style.display = "block";
        const response = await fetch('/api/oracoes');
        
        if (!response.ok) throw new Error("Erro na requisição");
        
        const data = await response.json();
        
        // Limpa e preenche as listas
        Object.values(lists).forEach(list => list.innerHTML = '');
        fillPrayerList(lists.tradicionais, data.filter(o => o.categoria_id === 1));
        fillPrayerList(lists.especificas, data.filter(o => o.categoria_id === 2));
        fillPrayerList(lists.novenas, data.filter(o => o.categoria_id === 3));
        
        // Abre a primeira categoria por padrão
        if (lists.tradicionais.children.length > 0) {
            lists.tradicionais.classList.add('expanded');
            document.querySelector('[onclick="toggleTopic(\'oracoes-tradicionais\')"]')
                .classList.add('active');
        }
    } catch (error) {
        console.error("Erro ao buscar orações:", error);
        showErrorInLists(lists);
    } finally {
        loadingAnimation.style.display = "none";
    }
}

function fillPrayerList(listElement, prayers) {
    prayers.forEach(prayer => {
        const li = document.createElement('li');
        li.textContent = prayer.titulo;
        li.onclick = (e) => {
            e.stopPropagation();
            showPrayer(prayer.id, e.currentTarget);
        };
        listElement.appendChild(li);
    });
}

function showErrorInLists(lists) {
    const errorMsg = '<li class="error">Erro ao carregar as orações</li>';
    Object.values(lists).forEach(list => list.innerHTML = errorMsg);
}

// ==============================================
// FUNÇÕES DE EXIBIÇÃO DE ORAÇÕES
// ==============================================

async function showPrayer(prayerId, element) {
    const loadingAnimation = document.querySelector('.loading-animation');
    const prayerTitle = document.getElementById('prayer-title');
    const prayerContent = document.getElementById('prayer-content');
    
    try {
        // Reset e preparação
        document.querySelectorAll('.prayer-list li').forEach(li => li.classList.remove('active'));
        if (element) element.classList.add('active');
        
        loadingAnimation.style.display = "block";
        prayerTitle.textContent = "";
        prayerContent.innerHTML = "";
        
        // Carrega a oração
        const response = await fetch(`/api/oracoes/${prayerId}`);
        if (!response.ok) throw new Error("Erro na requisição");
        
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        
        // Exibe a oração
        prayerTitle.textContent = data.titulo;
        prayerContent.innerHTML = formatPrayerText(data.conteudo);
        
        // Rolagem suave
        window.scrollTo({
            top: document.querySelector('.middle-panel').offsetTop,
            behavior: 'smooth'
        });
        
    } catch (error) {
        console.error("Erro ao buscar oração:", error);
        prayerTitle.textContent = "Erro";
        prayerContent.innerHTML = `<p class="error">${error.message || 'Não foi possível carregar a oração.'}</p>`;
    } finally {
        loadingAnimation.style.display = "none";
        if (window.innerWidth <= 768) toggleMobileMenu();
    }
}

function formatPrayerText(prayerText) {
    if (!prayerText) return '';
    
    return prayerText.split('\n\n')
        .filter(para => para.trim())
        .map(para => {
            const isAmen = para.toLowerCase().includes('amém') || para.toLowerCase().includes('amen');
            const content = para.replace(/\n/g, '<br>');
            return `<p ${isAmen ? 'class="amen"' : ''}>${content}</p>`;
        })
        .join('');
}