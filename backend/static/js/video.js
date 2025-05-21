document.addEventListener("DOMContentLoaded", function () {
  fetch('/api/video-destaque')
    .then(response => response.json())
    .then(video => {
      if(video.url_video) {
        document.getElementById('video-titulo').innerText = video.titulo;
        document.getElementById('video-descricao').innerText = video.descricao;
        document.getElementById('video-container').innerHTML = `
          <iframe width="560" height="315" src="${video.url_video}" 
            frameborder="0" allowfullscreen></iframe>`;
      }
    })
    .catch(error => {
      console.error("Erro ao carregar o vídeo:", error);
      document.getElementById('video-container').innerHTML = "<p>Não foi possível carregar o vídeo.</p>";
    });
});
