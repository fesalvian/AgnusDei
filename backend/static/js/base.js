document.querySelector('.menu-toggle').addEventListener('click', function() {
    const menu = document.querySelector('.navegacao ul');
    menu.classList.toggle('active');
});

function copiarPix() {
    const chavePix = "361a3c9c-9099-40f9-81f6-3e274bac3de0";  // Insira sua chave real
    navigator.clipboard.writeText(chavePix)
      .then(() => {
        alert("✅ Chave Pix copiada com sucesso!");
      })
      .catch(err => {
        console.error('Erro ao copiar a chave Pix:', err);
      });
  }