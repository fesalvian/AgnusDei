// Animação de revelação ao scroll
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}

// Botão voltar ao topo
function setupBackToTopButton() {
    const btnTopo = document.getElementById('btnTopo');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btnTopo.style.display = 'flex';
        } else {
            btnTopo.style.display = 'none';
        }
    });
    
    btnTopo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Efeito de digitação nos títulos
function typeWriterEffect() {
    const titles = document.querySelectorAll('h1, h2');
    let delay = 0;
    
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const speed = 50;
            
            function type() {
                if (i < text.length) {
                    title.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            type();
        }, delay);
        
        delay += 500;
    });
}

// Highlight do menu ativo ao scroll
function highlightActiveMenu() {
    const sections = document.querySelectorAll('.secao');
    const menuItems = document.querySelectorAll('.menu-interno a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });
}

function setupLeiaMais() {
    const botoesLeiaMais = document.querySelectorAll('.leia-mais');
    
    botoesLeiaMais.forEach(botao => {
        botao.addEventListener('click', function() {
            const secao = this.closest('.secao');
            secao.classList.toggle('expandida');
            
            // Atualiza o texto do botão
            if (secao.classList.contains('expandida')) {
                this.textContent = 'Mostrar menos';
            } else {
                this.textContent = 'Leia mais';
            }
        });
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona classe reveal a todas as seções
    document.querySelectorAll('.secao, h1, h2, h3, .milagre').forEach(el => {
        el.classList.add('reveal');
    });
    
    setupBackToTopButton();
    highlightActiveMenu();
    revealOnScroll();
    setupLeiaMais();
    
    // Ativa o efeito de digitação apenas no h1 principal
    const mainTitle = document.querySelector('h1');
    if (mainTitle) {
        const text = mainTitle.textContent;
        mainTitle.textContent = '';
        
        let i = 0;
        const speed = 50;
        
        function type() {
            if (i < text.length) {
                mainTitle.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    window.addEventListener('scroll', revealOnScroll);


    // Dados dos milagres
    const milagres = {
        "agua-em-vinho": {
    titulo: "Água em Vinho: O Milagre que Revelou a Glória de Cristo",
    texto: `<p>Em <strong>João 2:1-11</strong>, nas bodas de Caná, Jesus realizou seu primeiro milagre de forma discreta mas poderosa. Quando o vinho acabou, a Virgem Maria interveio: "Eles não têm mais vinho". Jesus então ordenou que enchessem seis talhas de pedra com água - cerca de 600 litros! Ao provarem, o mestre-sala se surpreendeu: "Tu guardaste o melhor vinho até agora!"</p>
    <p>🔹 <strong>Significado Profundo:</strong> Mais que resolver um problema social, este milagre:<br>
    - Revelou Jesus como o Noivo celestial (cf. Ap 19:9)<br>
    - Simbolizou a transformação da Lei Antiga (água) em Nova Aliança (vinho)<br>
    - Mostrou que em Cristo o melhor está sempre por vir!</p>`
},
        "cura-paralitico": {
    titulo: "Choque Religioso: O Homem que Andou com Um Perdão",
    texto: `<p><strong>Marcos 2:1-12</strong> narra a cena eletrizante: quatro amigos arrombam o teto para baixar um paralítico até Jesus. O Mestre primeiro declara: "Filho, teus pecados estão perdoados", causando rebuliço entre os escribas que O acusavam de blasfêmia.</p>
    <p>Então Jesus desafia: "O que é mais fácil? Dizer 'perdoados são teus pecados' ou 'levanta e anda'?" Ordena ao homem: "Eu te digo, levanta-te, toma tua cama e vai para casa!" Imediatamente, diante da multidão atônita, o paralítico se levanta!</p>
    <p>🔹 <strong>Revolução Teológica:</strong><br>
    - Jesus provou ter autoridade para perdoar pecados (prerrogativa divina)<br>
    - Mostrou que muitas enfermidades têm raiz espiritual<br>
    - Demonstrou que a fé comunitária opera milagres</p>`
},
        "multiplicacao-paes": {
    titulo: "Fome de 5.000 Saciada: O Banquete Messiânico",
    texto: `<p>Em <strong>Mateus 14:13-21</strong>, numa região desértica, Jesus transforma cinco pães e dois peixes numa refeição para multidões. Os discípulos recolhem doze cestos cheios de sobras!</p>
    <p>🔹 <strong>Sinais Proféticos:</strong><br>
    - Cumpre a promessa de Salmo 132:15 sobre Deus saciando os pobres<br>
    - Prefigura a Eucaristia (João 6:35)<br>
    - Revela Jesus como novo Moisés (cf. Êxodo 16)</p>
    <p>💡 <em>Curiosidade:</em> Este é o único milagre relatado nos 4 Evangelhos!</p>`
},
"tempestade-acalmada": {
    titulo: "Caos no Mar da Galileia: Quando o Vento Obedece",
    texto: `<p><strong>Marcos 4:35-41</strong> descreve a cena dramática: uma tempestade tão forte que aterrorizou pescadores experientes. Jesus dormia na popa! Ao ser acordado, repreendeu o vento: "Cala-te, aquieta-te!" Imediatamente veio bonança.</p>
    <p>🔹 <strong>Lições Atemporais:</strong><br>
    - Jesus é o Senhor da criação (Sl 107:29)<br>
    - Demonstrou poder sobre o caos (simbolismo cósmico)<br>
    - Questionou: "Por que sois tão tímidos? Ainda não tendes fé?"</p>
    <p>🌪️ <em>Dado impactante:</em> A região do Mar da Galileia tem tempestades súbitas devido a diferenças térmicas nas montanhas.</p>`
},
"ressurreicao-lazaro": {
    titulo: "Lázaro: 4 Dias Morto e o Grito que Abalou a História",
    texto: `<p>Em <strong>João 11:1-44</strong>, Jesus chega tarde de propósito: "Esta enfermidade não é para morte, mas para glória de Deus". Ao encontrar Marta, declara: "Eu sou a ressurreição e a vida".</p>
    <p>Diante do túmulo, ordena: "Tirai a pedra!" Marta protesta: "Já cheira mal, é o quarto dia!" Jesus ora e grita: "Lázaro, vem para fora!" O morto sai com as faixas funerárias.</p>
    <p>🔹 <strong>Consequências:</strong><br>
    - Foi o estopim para Sua crucificação (Jo 11:53)<br>
    - Provou que a morte física não é o fim<br>
    - Antecipou Sua própria ressurreição</p>
    <p>⚰️ <em>Dado cultural:</em> Os judeus acreditavam que a alma permanecia perto do corpo por 3 dias.</p>`
},
"cego-de-nascenca": {
    titulo: "Barro e Saliva: A Cura que Cegou os Fariseus",
    texto: `<p>Em <strong>João 9:1-41</strong>, Jesus faz lodo com saliva, unge os olhos do cego e manda lavar no tanque de Siloé. O homem volta vendo!</p>
    <p>Os fariseus o interrogam furiosos. O ex-cego responde com ironia: "Uma coisa sei: eu era cego e agora vejo!" Quando Jesus o encontra novamente, revela-se como o Messias.</p>
    <p>🔹 <strong>Ironia Divina:</strong><br>
    - O cego físico recebe luz espiritual<br>
    - Os "videntes" religiosos permanecem cegos<br>
    - Usou método que violava o legalismo sabático</p>
    <p>🧑‍⚖️ <em>Contexto:</em> Havia debate rabínico se cegueira congênita era incurável.</p>`
},
"exorcismo-gadara": {
    titulo: "Poder Infernal Derrotado: O Caso 'Legião'",
    texto: `<p>Em <strong>Marcos 5:1-20</strong>, Jesus enfrenta um homem possuído por uma legião de demônios (cerca de 6.000!). O endemoninhado:<br>
    - Arrebentava correntes<br>
    - Vivia entre túmulos<br>
    - Gritava dia e noite</p>
    <p>Jesus ordena: "Espírito imundo, sai dele!" Os demônios suplicam para entrar em porcos - e 2.000 animais se lançam ao mar!</p>
    <p>🔹 <strong>Impacto:</strong><br>
    - Demonstrou autoridade sobre hierarquias demoníacas<br>
    - Mostrou que o valor de uma alma é maior que riquezas (os porcos perdidos)<br>
    - O homem liberto se torna o primeiro missionário gentio</p>
    <p>⚔️ <em>Dado histórico:</em> Gadara era cidade grega - Jesus cruzou fronteiras culturais para este milagre.</p>`
},
"cura-centuriao": {
    titulo: "Fé que Comoveu o Céu: O Centurião Romano",
    texto: `<p>Em <strong>Mateus 8:5-13</strong>, um oficial romano implora por seu servo paralítico. Jesus oferece ir até sua casa, mas o centurião protesta:<br>
    <em>"Senhor, não sou digno... mas dize apenas uma palavra, e meu servo será curado!"</em></p>
    <p>Jesus se admira: "Nem em Israel achei fé como esta!" E na mesma hora o servo é curado à distância.</p>
    <p>🔹 <strong>Lições Revolucionárias:</strong><br>
    - Único milagre onde Jesus "se surpreende"<br>
    - Quebrou barreiras étnicas (um gentio com fé exemplar)<br>
    - Ilustrou o princípio da autoridade espiritual</p>
    <p>🛡️ <em>Contexto:</em> Centuriões eram odiados pelos judeus - este construíra uma sinagoga (Lc 7:5).</p>`
},
"ressurreicao-jesus": {
    titulo: "A Maior Prova: Jesus Venceu a Morte",
    texto: `<p><strong>Mateus 28, Marcos 16, Lucas 24, João 20</strong> relatam:<br>
    - O túmulo selado e vigiado por soldados<br>
    - A pedra removida por um anel<br>
    - As mulheres encontrando o túmulo vazio<br>
    - As aparições a discípulos (inclusive a 500 pessoas de uma vez - 1Co 15:6)</p>
    <p>🔹 <strong>Evidências Irrefutáveis:</strong><br>
    1. <strong>Túmulo vazio</strong> - Os inimigos nunca apresentaram o corpo<br>
    2. <strong>Transformação dos discípulos</strong> - De covardes a mártires<br>
    3. <strong>Profecia cumprida</strong> - Sl 16:10; Is 53:10</p>
    <p>✝️ <em>Impacto Eterno:</em> "Se Cristo não ressuscitou, é vã a nossa fé" (1Co 15:14). Este milagre é o alicerce do Cristianismo.</p>`
},
"andar-sobre-aguas": {
    titulo: "Dominando o Abismo: Quando as Leis da Física se Curvam",
    texto: `<p>Em <strong>Mateus 14:22-33</strong>, durante a quarta vigília (3h-6h da manhã), os discípulos lutavam contra ventos contrários no Mar da Galileia. Jesus aparece <em>"andando sobre o mar"</em>. Os discípulos gritam de terror, pensando ser um fantasma. Sua resposta ecoa o nome divino (Êxodo 3:14): <em>"Tende bom ânimo; sou Eu, não temais!"</em></p>

    <p>Pedro, desafiador, pede: <em>"Senhor, se és Tu, manda-me ir ter contigo"</em>. Ao pisar nas águas, começa a afundar e clama: <em>"Senhor, salva-me!"</em> Jesus o segura e repreende: <em>"Homem de pequena fé, por que duvidaste?"</em></p>

    <p>🔹 <strong>Simbolismo Profundo:</strong><br>
    - <strong>Teofania</strong>: Revela Jesus como Javé que "anda sobre as asas do vento" (Sl 104:3)<br>
    - <strong>Cosmologia judaica</strong>: Dominar o mar = vencer o caos primordial (Jó 38:8-11)<br>
    - <strong>Jornada espiritual</strong>: Pedro representa a fé que vacila mas é sustentada por Cristo</p>

    <p>🌪️ <em>Dado científico:</em> O fenômeno de "caminhar sobre águas" exigiria pressão de 1.7 milhões kg/m² - impossível para humanos.</p>`
},
"transfiguracao": {
    titulo: "A Cúpula Celestial: Moisés, Elias e a Voz que Abalou o Tabor",
    texto: `<p><strong>Mateus 17:1-13</strong> descreve Jesus levando Pedro, Tiago e João a um "alto monte" (tradicionalmente o Monte Tabor). Ali, Seu rosto <em>"resplandeceu como o sol"</em> e Suas vestes se tornaram <em>"brancas como a luz"</em>. Dois homens aparecem: <strong>Moisés</strong> (representando a Lei) e <strong>Elias</strong> (os Profetas), falando sobre Seu "êxodo" (morte em Jerusalém).</p>

    <p>Pedro, aterrorizado, propõe fazer três tendas. Então uma nuvem luminosa os envolve, e a voz do Pai troveja: <em>"Este é meu Filho amado, em quem me comprazo; a Ele ouvi"</em>. Os discípulos caem com o rosto em terra. Jesus os toca e diz: <em>"Erguei-vos e não temais"</em>.</p>

    <p>🔹 <strong>Significado Cósmico:</strong><br>
    - <strong>Cumprimento escatológico</strong>: Moisés (Dt 18:15) e Elias (Ml 4:5) testemunham o Messias<br>
    - <strong>Preparação para a Cruz</strong>: A glória antecipada fortaleceu os discípulos para o Getsêmani<br>
    - <strong>Prova da Encarnação</strong>: O Verbo divino em forma humana (2Pe 1:16-18)</p>

    <p>⛰️ <em>Curiosidade:</em> O Tabor tem 588m de altitude - seu nome significa "umbigo" (centro geográfico de Israel).</p>`
},
"ascensao": {
    titulo: "O Último Sinal: Quando a Terra Perdeu Seu Rei",
    texto: `<p><strong>Atos 1:9-12</strong> e <strong>Lucas 24:50-53</strong> registram o momento culminante: 40 dias após a ressurreição, Jesus leva os discípulos ao Monte das Oliveiras. Ali:</p>
    <ol>
        <li>Abençoa-os erguendo as mãos (gesto sacerdotal)</li>
        <li>É <em>"elevado às alturas"</em> numa nuvem (símbolo da Shekinah)</li>
        <li>Dois anjos aparecem prometendo: <em>"Virá do modo como O vistes subir"</em></li>
    </ol>

    <p>🔹 <strong>Teologia da Ascensão:</strong><br>
    - <strong>Entronização</strong>: Cumpriu Sl 110:1 ("Assenta-Te à Minha direita")<br>
    - <strong>Mediação eterna</strong>: Como Sumo Sacerdote no celestial (Hb 4:14-16)<br>
    - <strong>Missão continuada</strong>: Enviou o Espírito Santo para capacitar a Igreja</p>

    <p>☁️ <em>Dado astronômico:</em> A nuvem não era meteorológica - era a mesma glória que encheu o Tabernáculo (Êx 40:34-35).</p>

    <p>✝️ <strong>Impacto:</strong> A Ascensão não foi uma despedida, mas a inauguração de Seu governo cósmico (Ef 1:20-23).</p>`
}
    };

    // Abre o modal ao clicar em um milagre
    document.querySelectorAll('.milagre').forEach(item => {
        item.addEventListener('click', function() {
            const milagreId = this.getAttribute('data-id');
            const milagre = milagres[milagreId];
            
            document.getElementById('modal-titulo').innerHTML = milagre.titulo;
            document.getElementById('modal-texto').innerHTML = milagre.texto;
            document.getElementById('modal-milagre').style.display = 'block';
        });
    });

    // Fecha o modal
    document.querySelector('.fechar-modal').addEventListener('click', function() {
        document.getElementById('modal-milagre').style.display = 'none';
    });

    // Fecha o modal ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('modal-milagre')) {
            document.getElementById('modal-milagre').style.display = 'none';
        }
    });
});