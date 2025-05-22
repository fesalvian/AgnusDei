document.addEventListener("DOMContentLoaded", function () {
  fetch('/api/video-destaque')
    .then(response => {
      if (!response.ok) {
        throw new Error("Resposta da API não foi ok");
      }
      return response.json();
    })
    .then(video => {
      if (video && video.url_video) {
        document.getElementById('video-titulo').innerText = video.titulo || 'Vídeo em destaque';
        document.getElementById('video-descricao').innerText = video.descricao || '';
        document.getElementById('video-container').innerHTML = `
          <iframe width="560" height="315" src="${video.url_video}" 
            frameborder="0" allowfullscreen></iframe>`;
      } else {
        document.getElementById('video-container').innerHTML = "<p>Nenhum vídeo disponível.</p>";
      }
    })
    .catch(error => {
      console.error("Erro ao carregar o vídeo:", error);
      document.getElementById('video-container').innerHTML = "<p>Não foi possível carregar o vídeo.</p>";
    });
});
