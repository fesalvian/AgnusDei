document.addEventListener('DOMContentLoaded', function() {
    const artigosContainer = document.getElementById('artigos-container');
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    
    // Função para carregar e exibir artigos
    async function carregarArtigos(categoria = 'todos') {
        try {
            const response = await fetch(`/api/artigos?categoria=${categoria}`);
            if (!response.ok) throw new Error('Falha ao carregar artigos');
            const artigos = await response.json();
        } catch (error) {
            console.error('Erro ao carregar artigos:', error);
            artigosContainer.innerHTML = '<p class="erro-carregamento">Ocorreu um erro ao carregar os artigos.</p>';
        }
    }
    
    // Função para criar o HTML de um card de artigo
    function criarArtigoCard(artigo) {
        // Formatando a data (DD/MM/AAAA)
        const dataFormatada = new Date(artigo.data_postagem).toLocaleDateString('pt-BR');
        
        const article = document.createElement('article');
        article.className = 'artigo-card';
        article.dataset.categoria = artigo.categoria;
        
        article.innerHTML = `
            <div class="artigo-imagem">
                <img src="${artigo.imagem_capa}" alt="${artigo.titulo}">
            </div>
            <div class="artigo-corpo">
                <span class="artigo-categoria">${formatarCategoria(artigo.categoria)}</span>
                <h2 class="artigo-titulo">${artigo.titulo}</h2>
                <p class="artigo-resumo">${artigo.resumo}</p>
                <div class="artigo-metadados">
                    <span class="artigo-data">${dataFormatada}</span>
                    <span class="artigo-tempo-leitura">${artigo.tempo_estimado_leitura} min de leitura</span>
                </div>
                <a href="artigo-completo.html?id=${artigo.id}" class="artigo-link">Ler mais</a>
            </div>
        `;
        
        return article;
    }
    
    // Função para formatar o nome da categoria
    function formatarCategoria(categoria) {
        const categorias = {
            'reflexoes': 'Reflexões',
            'estudos': 'Estudos Bíblicos',
            'testemunhos': 'Testemunhos'
        };
        return categorias[categoria] || categoria;
    }
    
    // Event listeners para os filtros
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover classe 'active' de todos os botões
            filtroBtns.forEach(b => b.classList.remove('active'));
            // Adicionar classe 'active' apenas ao botão clicado
            this.classList.add('active');
            // Carregar artigos da categoria selecionada
            carregarArtigos(this.dataset.categoria);
        });
    });
    
    // Carregar todos os artigos inicialmente
    carregarArtigos();
});
