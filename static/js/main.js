window.addEventListener('scroll', function() {
    const backgroundImage = document.querySelector('.background-image');
    const scrollPosition = window.scrollY;

    // Ajuste a velocidade do movimento do background
    const velocidadeFundo = 0.5; // Fundo move-se mais devagar que o conteúdo
    backgroundImage.style.transform = `translateY(-${scrollPosition * velocidadeFundo}px)`;
});

// Adiciona um evento de clique ao botão
document.getElementById('startButton').addEventListener('click', function() {
    window.location.href = 'home'; // Redireciona para home.html
});