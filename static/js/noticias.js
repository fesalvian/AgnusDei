document.addEventListener("DOMContentLoaded", async function () {
    const feedContainer = document.getElementById("feed-noticias");

    try {
        const response = await fetch("/api/noticias");
        const data = await response.json();

        let htmlContent = "";
        data.forEach(item => {
            htmlContent += `
                <div class="noticia">
                    
                    <div class="noticia-texto">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <p>Data da postagem: ${item.pubDate}</p>
                        <a href="${item.link}" target="_blank">Leia mais</a>
                    </div>
                </div>
            `;
        });

        feedContainer.innerHTML = htmlContent;
    } catch (error) {
        console.error("Erro ao carregar as notícias:", error);
        feedContainer.innerHTML = "<p>Não foi possível carregar as notícias.</p>";
    }
});