
# Agnus Dei ✝️

Bem-vindo ao **Agnus Dei**, um site dedicado à fé católica, inspirado no trabalho de São Carlo Acutis. Este projeto foi desenvolvido com o objetivo de evangelizar e compartilhar conhecimentos sobre a Igreja Católica, incluindo a vida de Jesus, seus ensinamentos, milagres, orações, reflexões, santos e festas litúrgicas.

## Sobre o Projeto

O **Agnus Dei** é um site desenvolvido por **Felipe Salviano** como um projeto pessoal para disseminar a palavra de Deus e ajudar as pessoas a se aproximarem da fé católica. O site não possui fins lucrativos e foi criado no tempo livre, com muito amor e dedicação.

### Objetivos:
- Evangelizar e compartilhar a fé católica. ✝️
- Fornecer conteúdo inspirador e educativo sobre a vida de Jesus, seus ensinamentos e milagres.
- Oferecer orações e reflexões para fortalecer a espiritualidade.
- Conectar as pessoas aos santos e às festas litúrgicas.

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido com as seguintes tecnologias:

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript
  - [Flask](https://flask.palletsprojects.com/) (para renderização de templates)

- **Backend:**
  - Python (Flask)
  - MySQL (banco de dados)

- **Ferramentas:**
  - [Git](https://git-scm.com/) (controle de versão)
  - [GitHub](https://github.com/) (hospedagem do código)
  - [Insomnia](https://insomnia.rest/) (testes de API)

## 📂 Estrutura do Projeto

A estrutura do projeto é organizada da seguinte forma:

```
AgnusDei/
├── app.py                  # Arquivo principal do Flask
├── requirements.txt        # Dependências do projeto
├── .env                    # Variáveis de ambiente
├── src/                    # Código fonte
│   ├── __init__.py         # Inicialização do módulo
│   ├── database.py         # Conexão com o banco de dados
│   ├── contato.py          # Lógica para o formulário de contato
├── static/                 # Arquivos estáticos (CSS, JS, imagens)
│   ├── css/
│   └── js/
└── templates/              # Templates HTML
    ├── base.html           # Template base
    ├── home.html           # Página inicial
    ├── contato.html        # Página de contato
    └── ...                 # Outras páginas
```

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

- Python 3.x instalado.
- MySQL instalado e configurado.
- Git instalado (opcional, para clonar o repositório).

### Passos para Configuração

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/fesalvian/AgnusDei.git
   cd AgnusDei
   ```

2. **Crie um ambiente virtual (opcional, mas recomendado):**

   ```bash
   python -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```

3. **Instale as dependências:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure o arquivo `.env`:**

   Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias:

   ```plaintext
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=seu_banco_de_dados
   EMAIL_USER=seuemail@hotmail.com
   EMAIL_PASS=suasenha
   ```

5. **Execute o servidor Flask:**

   ```bash
   python app.py
   ```

6. **Acesse o site:**

   Abra o navegador e acesse:
   ```
   http://localhost:5000
   ```

## 📝 Funcionalidades

- **Página Inicial:** Apresenta uma introdução ao site e links para outras seções.
- **Vida de Jesus:** Detalhes sobre a vida de Jesus Cristo.
- **Ensino de Jesus:** Reflexões sobre os ensinamentos de Jesus.
- **Milagres de Jesus:** Descrição dos milagres realizados por Jesus.
- **Oração e Reflexão:** Oração e reflexões para fortalecer a fé.
- **Santos e Jesus:** Informações sobre a relação entre os santos e Jesus.
- **Festas Litúrgicas:** Detalhes sobre as festas litúrgicas da Igreja Católica.
- **Formulário de Contato:** Permite que os usuários relatem bugs ou entrem em contato.

## 🤝 Como Contribuir

Contribuições são bem-vindas! Se você quiser contribuir para o projeto, siga os passos abaixo:

1. Faça um **fork** do repositório.
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-feature`).
3. Faça commit das suas alterações (`git commit -m 'Adicionando nova feature'`).
4. Faça um push para a branch (`git push origin feature/nova-feature`).
5. Abra um **Pull Request** no repositório original.

## 📄 Licença

Este projeto está sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com ❤️ a Deus por [Felipe Salviano](https://github.com/fesalvian).




