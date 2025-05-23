document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = '/api/artigos';
    const container = document.getElementById('artigos-container');
    const loading = document.getElementById('loading-animation');
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('pt-BR');

    // Modal Handling
    const modal = document.getElementById('article-modal');
    const modalContent = document.getElementById('modal-content');
    const modalLoading = document.getElementById('modal-loading');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalBody = document.getElementById('modal-body');

    function formatCategoria(categoria) {
        const categorias = {
            'tradicoes': 'Tradições',
            'estudos': 'Estudos Bíblicos',
            'reflexoes': 'Reflexões'
        };
        return categorias[categoria] || categoria;
    }

    const safeHTML = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    const renderArtigo = (artigo) => `
        <article class="artigo-card" data-categoria="${artigo.categoria}">
            <div class="artigo-imagem">
                <img src="${safeHTML(artigo.imagem_capa)}" 
                     alt="${safeHTML(artigo.titulo)}" 
                     loading="lazy">
            </div>
            <div class="artigo-corpo">
                <span class="artigo-categoria">${formatCategoria(artigo.categoria)}</span>
                <h2>${safeHTML(artigo.titulo)}</h2>
                <p class="artigo-resumo">${safeHTML(artigo.resumo)}</p>
                <div class="artigo-metadados">
                    <time>${formatDate(artigo.data_postagem)}</time>
                    <span>${artigo.tempo_estimado_leitura} min</span>
                </div>
                <a href="/artigo/${artigo.slug}" class="artigo-link">Ler mais</a>
            </div>
        </article>
    `;

    const loadArtigos = async (categoria = 'todos') => {
        try {
            loading.style.display = 'flex';
            const response = await fetch(`${API_BASE}?categoria=${categoria}`);
            
            if (!response.ok) throw new Error(`${response.status} - ${response.statusText}`);
            
            const artigos = await response.json();
            container.innerHTML = artigos.map(renderArtigo).join('');
            
        } catch (error) {
            console.error('Erro:', error);
            container.innerHTML = `<p class="error">Erro ao carregar artigos: ${error.message}</p>`;
        } finally {
            loading.style.display = 'none';
        }
    };

    // Fechar modal
document.querySelector('.close-modal').addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fechar ao clicar fora
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Modifique o event listener dos links
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('artigo-link')) {
    e.preventDefault();
    const slug = e.target.getAttribute('href').split('/').pop();
    loadFullArticle(slug);
  }
});

// Fechar modal
document.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Fechar ao clicar fora
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Função para carregar artigo completo
  async function loadFullArticle(slug) {
    try {
      modal.style.display = 'block';
      modalContent.style.display = 'none';
      modalLoading.style.display = 'flex';
      
      const response = await fetch(`/api/artigo/${slug}`);
      if (!response.ok) throw new Error('Artigo não encontrado');
      
      const artigo = await response.json();
      
      // Preencher modal
      modalTitle.textContent = artigo.titulo;
      modalImage.src = artigo.imagem_capa || '/static/img/default.jpg';
      modalImage.alt = artigo.titulo;
      modalBody.innerHTML = artigo.conteudo;
      
      // Mostrar conteúdo com animação
      modalLoading.style.display = 'none';
      modalContent.style.display = 'block';
      
    } catch (error) {
      console.error('Erro:', error);
      modalLoading.innerHTML = `<p class="error">Erro ao carregar artigo: ${error.message}</p>`;
    }
  }
  

  

  // Modifique o event listener dos links p abrir o modal
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('artigo-link')) {
      e.preventDefault();
      const slug = e.target.getAttribute('href').split('/').pop();
      loadFullArticle(slug);
    }
  });

    // Filtros e inicialização
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadArtigos(btn.dataset.categoria);
        });
    });

    loadArtigos();
});