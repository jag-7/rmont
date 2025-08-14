// Menu responsivo
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Fechar menu ao clicar em um link (mobile)
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// --- PRODUTOS: DADOS E FUNÇÕES ---
const produtos = [
  {
    id: 1,
    nome: 'Sistema de Purificação de Água',
    descricao: 'Sistema completo para purificação de água.',
    categoria: 'equipamentos',
    imagem: 'imagens/produtos/Sistema de purificação de água.jpg'
  },
  {
    id: 2,
    nome: 'Sistema de Osmose Reversa Industrial',
    descricao: 'Sistema de osmose reversa para uso industrial e comercial.',
    categoria: 'equipamentos',
    imagem: 'imagens/produtos/Sistema de Osmose Reversa Industrial ou Comercial.jpg'
  },
  {
    id: 3,
    nome: 'Sistema de Osmose Reversa Residencial',
    descricao: 'Sistema de osmose reversa para uso residencial.',
    categoria: 'equipamentos',
    imagem: 'imagens/produtos/Sistema de Osmose Reversa Residencial.jpg'
  },
  {
    id: 4,
    nome: 'Sistema de Filtração Industrial',
    descricao: 'Sistema de filtração para uso industrial.',
    categoria: 'equipamentos',
    imagem: 'imagens/produtos/Sistema de Filtração Industrial..jpg'
  },
  {
    id: 5,
    nome: 'Sistema de Filtração de Múltiplos Tanques',
    descricao: 'Sistema de filtração com múltiplos tanques.',
    categoria: 'equipamentos',
    imagem: 'imagens/produtos/Sistema de Filtração de Múltiplos Tanques.jpg'
  },
  {
    id: 6,
    nome: 'Filtro de Água Big Blue 20',
    descricao: 'Filtro de água de alta capacidade.',
    categoria: 'equipamentos',
    imagem: 'imagens/produtos/Filtro de Água Big Blue 20.jpg'
  },
  {
    id: 7,
    nome: 'Filtro de Sedimento',
    descricao: 'Filtro para remoção de partículas sólidas.',
    categoria: 'consumiveis',
    imagem: 'imagens/produtos/FILTRO DE SEDIMENTO.jpg'
  },
  {
    id: 8,
    nome: 'Hipoclorito de Sódio',
    descricao: 'Desinfetante para tratamento de água.',
    categoria: 'quimicos',
    imagem: 'imagens/produtos/HIPOCLORITO DE SÓDIO.jpg'
  },
  {
    id: 9,
    nome: 'Carvão Ativado',
    descricao: 'Material filtrante para remoção de impurezas e odores.',
    categoria: 'quimicos',
    imagem: 'imagens/produtos/CARVÃO ATIVADO.jpg'
  },
  {
    id: 10,
    nome: 'Floculante',
    descricao: 'Auxilia na remoção de partículas em suspensão.',
    categoria: 'quimicos',
    imagem: 'imagens/produtos/FLOCULANTE.jpg'
  },
  {
    id: 11,
    nome: 'Resina Catiônica',
    descricao: 'Utilizada em sistemas de abrandamento e desmineralização.',
    categoria: 'quimicos',
    imagem: 'imagens/produtos/RESINA CATEÓNICA.jpg'
  }
];

const PRODUTOS_POR_PAGINA = 6;
let categoriaAtual = 'todos';
let termoBusca = '';
let paginaAtual = 1;

const grid = document.getElementById('produtos-grid');
const paginacao = document.getElementById('produtos-paginacao');
const buscaInput = document.getElementById('busca-produto');
const filtroBtns = document.querySelectorAll('.filtro-btn');

// --- Lista de Solicitações ---
let carrinho = [];

// Carregar lista do localStorage ao iniciar
if (localStorage.getItem('carrinho')) {
  try {
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  } catch (e) { carrinho = []; }
}

function salvarLista() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// --- Painel lateral do carrinho ---
function renderizarPainelCarrinho() {
  let painel = document.getElementById('painel-carrinho');
  if (!painel) {
    painel = document.createElement('div');
    painel.id = 'painel-carrinho';
    document.body.appendChild(painel);
  }
  painel.innerHTML = `
    <div class="carrinho-header">
      <span class="carrinho-titulo">Lista de Solicitações</span>
      <button class="carrinho-fechar">&times;</button>
    </div>
    <div class="carrinho-itens">
      ${carrinho.length === 0 ? '<p class="carrinho-vazio">Sua lista de solicitações está vazia.</p>' : carrinho.map(item => `
        <div class="carrinho-item">
          <img src="${item.imagem}" alt="${item.nome}" class="carrinho-item-img-grande">
          <div class="carrinho-item-info">
            <div class="carrinho-item-nome">${item.nome}</div>
          </div>
          <button class="carrinho-remover" data-id="${item.id}">&times;</button>
        </div>
      `).join('')}
    </div>
    <div class="carrinho-footer">
      <form id="carrinho-form">
        <input type="text" id="carrinho-nome" placeholder="Seu nome" required style="margin-bottom:0.5rem;width:100%;padding:0.5rem;">
        <input type="email" id="carrinho-email" placeholder="Seu e-mail" required style="margin-bottom:0.5rem;width:100%;padding:0.5rem;">
        <input type="tel" id="carrinho-telefone" placeholder="Telefone" style="margin-bottom:0.5rem;width:100%;padding:0.5rem;">
        <button type="submit" class="carrinho-finalizar">Enviar solicitações</button>
      </form>
      <div style="margin-top:1rem;display:flex;gap:0.5rem;">
        <button id="enviar-whatsapp" class="btn-lista" style="background:#25D366;">WhatsApp</button>
        <button id="enviar-email" class="btn-lista" style="background:#EA4335;">Gmail/E-mail</button>
      </div>
    </div>
  `;
  painel.classList.add('aberto','animar-carrinho');

  // Fechar painel
  painel.querySelector('.carrinho-fechar').onclick = () => painel.classList.remove('aberto');
  // Remover item
  painel.querySelectorAll('.carrinho-remover').forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.getAttribute('data-id'));
      carrinho = carrinho.filter(item => item.id !== id);
      salvarLista();
      renderizarCarrinhoIcone();
      renderizarPainelCarrinho();
    };
  });
  // Finalizar compra
  painel.querySelector('#carrinho-form').onsubmit = (e) => {
    e.preventDefault();
    const nome = painel.querySelector('#carrinho-nome').value;
    const email = painel.querySelector('#carrinho-email').value;
    if (!email) {
      alert('Por favor, informe seu e-mail.');
      return;
    }
    let mensagem = `Olá! Gostaria de solicitar orçamento para:\n`;
    carrinho.forEach(item => {
      mensagem += `- ${item.nome}\n`;
    });
    mensagem += `\nNome: ${nome}\nE-mail: ${email}`;
    const url = `https://wa.me/244944385452?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    carrinho = [];
    salvarLista();
    renderizarCarrinhoIcone();
    renderizarPainelCarrinho();
  };

  // Envio WhatsApp
  painel.querySelector('#enviar-whatsapp').onclick = () => {
    const nome = painel.querySelector('#carrinho-nome').value;
    const email = painel.querySelector('#carrinho-email').value;
    if (!email) {
      alert('Por favor, informe seu e-mail.');
      return;
    }
    let mensagem = `Olá! Gostaria de solicitar orçamento para:\n`;
    carrinho.forEach(item => {
      mensagem += `- ${item.nome}\n`;
    });
    mensagem += `\nNome: ${nome}\nE-mail: ${email}`;
    const url = `https://wa.me/244944385452?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  // Envio E-mail
  painel.querySelector('#enviar-email').onclick = () => {
    const nome = painel.querySelector('#carrinho-nome').value;
    const email = painel.querySelector('#carrinho-email').value;
    if (!email) {
      alert('Por favor, informe seu e-mail.');
      return;
    }
    let assunto = 'Solicitação de Orçamento';
    let corpo = `Olá! Gostaria de solicitar orçamento para:\n`;
    carrinho.forEach(item => {
      corpo += `- ${item.nome}\n`;
    });
    corpo += `\nNome: ${nome}\nE-mail: ${email}`;
    const mailto = `mailto:comercial@rmont-business.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.open(mailto, '_blank');
  };
}

function atualizarTotalCarrinho() {
  let total = 0;
  carrinho.forEach(item => {
    let preco = item.precoSelecionado || item.preco;
    preco = parseFloat(preco.replace(/[^\d,]/g, '').replace(',', '.'));
    total += preco * item.quantidade;
  });
  document.getElementById('carrinho-total').textContent = total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });
}

// Abrir painel ao clicar no ícone
function ativarPainelCarrinho() {
  const icone = document.getElementById('carrinho-icone');
  if (icone) {
    icone.onclick = () => {
      renderizarPainelCarrinho();
      document.getElementById('painel-carrinho').classList.add('aberto','animar-carrinho');
    };
  }
}

function mostrarFeedbackLista(nomeProduto) {
  let feedback = document.getElementById('lista-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.id = 'lista-feedback';
    feedback.style.position = 'fixed';
    feedback.style.top = '80px';
    feedback.style.right = '40px';
    feedback.style.background = '#0C76D6';
    feedback.style.color = '#fff';
    feedback.style.padding = '12px 24px';
    feedback.style.borderRadius = '8px';
    feedback.style.fontWeight = 'bold';
    feedback.style.zIndex = '2000';
    document.body.appendChild(feedback);
  }
  feedback.textContent = `Adicionado à lista: ${nomeProduto}`;
  feedback.style.display = 'block';
  setTimeout(() => { feedback.style.display = 'none'; }, 1500);
}

function filtrarProdutos() {
  let filtrados = produtos;
  if (categoriaAtual !== 'todos') {
    filtrados = filtrados.filter(p => p.categoria === categoriaAtual);
  }
  if (termoBusca.trim() !== '') {
    filtrados = filtrados.filter(p => p.nome.toLowerCase().includes(termoBusca.toLowerCase()));
  }
  return filtrados;
}

function renderizarProdutos() {
  const produtosFiltrados = filtrarProdutos();
  const inicio = (paginaAtual - 1) * PRODUTOS_POR_PAGINA;
  const fim = inicio + PRODUTOS_POR_PAGINA;
  const produtosPagina = produtosFiltrados.slice(inicio, fim);

  grid.innerHTML = '';
  if (produtosPagina.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">Nenhum produto encontrado.</p>';
    return;
  }
  produtosPagina.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.setAttribute('data-categoria', produto.categoria);

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <div class="produto-preco">Preço sobre consulta</div>
      ${produto.descricao ? `<div class='produto-descricao'>${produto.descricao}</div>` : ''}
      <div class="produto-botoes">
        <button class="btn-orcamento" data-id="${produto.id}">Solicitar orçamento</button>
        <button class="btn-lista" data-id="${produto.id}">Adicionar à lista</button>
      </div>
    `;
    grid.appendChild(card);

    // Evento para botão de orçamento individual
    const btnOrcamento = card.querySelector('.btn-orcamento');
    btnOrcamento.addEventListener('click', () => {
      solicitarOrcamento(produto);
    });

    // Evento para botão de adicionar à lista
    const btnLista = card.querySelector('.btn-lista');
    btnLista.addEventListener('click', () => {
      adicionarALista(produto);
    });
  });
}

function renderizarPaginacao() {
  const produtosFiltrados = filtrarProdutos();
  const totalPaginas = Math.ceil(produtosFiltrados.length / PRODUTOS_POR_PAGINA);
  paginacao.innerHTML = '';
  if (totalPaginas <= 1) return;
  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.className = 'paginacao-btn' + (i === paginaAtual ? ' active' : '');
    btn.textContent = i;
    btn.addEventListener('click', () => {
      paginaAtual = i;
      renderizarProdutos();
      renderizarPaginacao();
      window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' });
    });
    paginacao.appendChild(btn);
  }
}

filtroBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filtroBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    categoriaAtual = btn.getAttribute('data-categoria');
    paginaAtual = 1;
    renderizarProdutos();
    renderizarPaginacao();
  });
});

if (buscaInput) {
  buscaInput.addEventListener('input', (e) => {
    termoBusca = e.target.value;
    paginaAtual = 1;
    renderizarProdutos();
    renderizarPaginacao();
  });
}

// Função para solicitar orçamento individual
function solicitarOrcamento(produto) {
  // Solicita nome e e-mail do usuário
  const nome = prompt("Informe seu nome para o orçamento:");
  if (!nome) return;
  const email = prompt("Informe seu e-mail para contato:");
  if (!email) return;

  // Monta a mensagem
  let mensagem = `Olá! Gostaria de solicitar orçamento para:\n- ${produto.nome}\n\nNome: ${nome}\nE-mail: ${email}`;
  // Abre o WhatsApp
  const url = `https://wa.me/244944385452?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

// Função para adicionar à lista de solicitações
function adicionarALista(produto) {
  const idx = carrinho.findIndex(item => item.id === produto.id);
  if (idx === -1) {
    carrinho.push({ ...produto });
    salvarLista();
    renderizarCarrinhoIcone();
    mostrarFeedbackLista(produto.nome);
    // Se painel estiver aberto, atualizar
    const painel = document.getElementById('painel-carrinho');
    if (painel && painel.classList.contains('aberto')) {
      renderizarPainelCarrinho();
    }
  }
}

// Chamar ativarPainelCarrinho após renderizarCarrinhoIcone
function renderizarCarrinhoIcone() {
  let iconeContainer = document.getElementById('carrinho-icone-container');
  if (!iconeContainer) {
    iconeContainer = document.createElement('div');
    iconeContainer.id = 'carrinho-icone-container';
    document.body.prepend(iconeContainer);
  }
  const totalItens = carrinho.length;
  iconeContainer.innerHTML = `
    <div id="carrinho-icone" style="position:fixed;bottom:32px;right:32px;z-index:1000;cursor:pointer;background:#fff;border-radius:50%;box-shadow:0 2px 8px rgba(12,118,214,0.10);width:52px;height:52px;display:flex;align-items:center;justify-content:center;">
      <span style="font-size:2rem;">📋</span>
      <span id="carrinho-contador" style="position:absolute;top:10px;right:10px;background:#0C76D6;color:#fff;font-size:0.95rem;font-weight:bold;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;">${totalItens}</span>
    </div>
  `;
  ativarPainelCarrinho();
}

// Inicialização
renderizarProdutos();
renderizarPaginacao();
renderizarCarrinhoIcone();