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
    nome: 'HIPOCLORITO DE SÓDIO 25L (Líquida)',
    preco: '75 000,00 Kz',
    precoTonelada: '3 500 000,00 Kz',
    descricao: 'Desinfetante líquido para tratamento de água. ',
    categoria: 'quimicos',
    imagem: 'fitro.png'
  },
  {
    id: 2,
    nome: 'HIPOCLORITO DE SÓDIO 190L (Líquida)',
    preco: '190 000,00 Kz',
    descricao: 'Desinfetante líquido para grandes volumes de água.',
    categoria: 'quimicos',
    imagem: 'fitro.png'
  },
  {
    id: 3,
    nome: 'ANTI SCALANT RO 391-AF 25L (Líquida)',
    preco: '52 000,00 Kz',
    descricao: 'Produto para prevenir incrustações em sistemas de osmose reversa.',
    categoria: 'quimicos',
    imagem: 'fitro.png'
  },
  {
    id: 4,
    nome: 'HIDRÓXIDO DE SÓDIO 25Kg (Saco)',
    preco: '118 000,00 Kz',
    precoTonelada: '2 150 000,00 Kz',
    descricao: 'Base forte para ajuste de pH.',
    categoria: 'quimicos',
    imagem: 'fitro.png'
  },
  {
    id: 5,
    nome: 'HIDRÓXIDO DE SÓDIO 25L (Líquida)',
    preco: '35 000,00 Kz',
    descricao: 'Base forte líquida para ajuste de pH.',
    categoria: 'quimicos',
    imagem: 'fitro.png'
  },
  {
    id: 6,
    nome: 'HIDRÓXIDO DE CÁLCIO 25Kg (Saco)',
    preco: '35 000,00 Kz',
    precoTonelada: '1 350 000,00 Kz',
    descricao: 'Agente alcalinizante para tratamento de água.',
    categoria: 'quimicos',
    imagem: 'fitro.png'
  },
  {
    id: 7,
    nome: 'ALGICIDA 5L (Bidon)',
    preco: '---',
    descricao: 'Produto para controle de algas em sistemas de água.',
    categoria: 'quimicos',
    imagem: 'fitro.png'
  },
  {
    id: 8,
    nome: 'FLOCULANTE C577',
    preco: '4 360 000,00 Kz',
    precoTonelada: '3 200 000,00 Kz',
    descricao: 'Auxilia na remoção de partículas em suspensão.',
    categoria: 'quimicos',
    imagem: 'fitro.png'
  },
  {
    id: 9,
    nome: 'PEROXIDO DE HIDROGÊNIO 1,2T (Balde)',
    preco: '50 000,00 Kz',
    descricao: 'Agente oxidante para desinfecção de água.',
    categoria: 'quimicos',
    imagem: 'fitro.png'
  },
  {
    id: 10,
    nome: 'SULFATO DE ALUMÍNIO 50Kg (Saco)',
    preco: '170 000,00 Kz',
    precoTonelada: '1 750 000,00 Kz',
    descricao: 'Coagulante para clarificação de água.',
    categoria: 'quimicos',
    imagem: 'fitro.png'
  },
  {
    id: 11,
    nome: 'CARVÃO ATIVADO 25Kg (Saco)',
    preco: '380 000,00 Kz',
    descricao: 'Material filtrante para remoção de impurezas e odores.',
    categoria: 'consumiveis',
    imagem: 'fitro.png'
  },
  {
    id: 12,
    nome: 'RESINA CATEÓNICA 25Kg (Saco)',
    preco: '25 000,00 Kz',
    precoTonelada: '6 600 000,00 Kz',
    descricao: 'Utilizada em sistemas de abrandamento e desmineralização.',
    categoria: 'consumiveis',
    imagem: 'fitro.png'
  },
  {
    id: 13,
    nome: 'FILTRO DE SEDIMENTO PP 2,5X40 (Unidade)',
    preco: '700 000,00 Kz',
    descricao: 'Filtro para remoção de partículas sólidas.',
    categoria: 'consumiveis',
    imagem: 'fitro.png'
  },
  {
    id: 14,
    nome: 'SISTEMA DE PURIFICAÇÃO DE ÁGUA',
    preco: '---',
    descricao: 'Sistema completo para purificação de água.',
    categoria: 'equipamentos',
    imagem: 'fitro.png'
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

// --- Carrinho ---
let carrinho = [];

// Carregar carrinho do localStorage ao iniciar
if (localStorage.getItem('carrinho')) {
  try {
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  } catch (e) { carrinho = []; }
}

function salvarCarrinho() {
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
      <span class="carrinho-titulo">Carrinho</span>
      <button class="carrinho-fechar">&times;</button>
    </div>
    <div class="carrinho-itens">
      ${carrinho.length === 0 ? '<p class="carrinho-vazio">Seu carrinho está vazio.</p>' : carrinho.map(item => `
        <div class="carrinho-item">
          <img src="${item.imagem}" alt="${item.nome}" class="carrinho-item-img-grande">
          <div class="carrinho-item-info">
            <div class="carrinho-item-nome">${item.nome}</div>
            <div class="carrinho-item-preco">${item.precoSelecionado || item.preco}</div>
            <div class="carrinho-item-qtd">
              <input type="number" min="1" value="${item.quantidade}" data-id="${item.id}" data-preco="${item.precoSelecionado || item.preco}" class="carrinho-qtd-input">
              <span>unid.</span>
            </div>
          </div>
          <button class="carrinho-remover" data-id="${item.id}" data-preco="${item.precoSelecionado || item.preco}">&times;</button>
        </div>
      `).join('')}
    </div>
    <div class="carrinho-footer">
      <div class="carrinho-total">Total: <span id="carrinho-total"></span></div>
      <form id="carrinho-form">
        <input type="text" id="carrinho-nome" placeholder="Seu nome" required style="margin-bottom:0.5rem;width:100%;padding:0.5rem;">
        <input type="text" id="carrinho-endereco" placeholder="Endereço de entrega" required style="margin-bottom:0.5rem;width:100%;padding:0.5rem;">
        <input type="tel" id="carrinho-telefone" placeholder="Telefone" required style="margin-bottom:0.5rem;width:100%;padding:0.5rem;">
        <button type="submit" class="carrinho-finalizar">Finalizar compra</button>
      </form>
    </div>
  `;
  painel.classList.add('aberto','animar-carrinho');
  atualizarTotalCarrinho();

  // Fechar painel
  painel.querySelector('.carrinho-fechar').onclick = () => painel.classList.remove('aberto');
  // Remover item
  painel.querySelectorAll('.carrinho-remover').forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const preco = btn.getAttribute('data-preco');
      carrinho = carrinho.filter(item => !(item.id === id && (item.precoSelecionado || item.preco) === preco));
      salvarCarrinho();
      renderizarCarrinhoIcone();
      renderizarPainelCarrinho();
    };
  });
  // Alterar quantidade
  painel.querySelectorAll('.carrinho-qtd-input').forEach(input => {
    input.onchange = () => {
      const id = parseInt(input.getAttribute('data-id'));
      const preco = input.getAttribute('data-preco');
      const idx = carrinho.findIndex(item => item.id === id && (item.precoSelecionado || item.preco) === preco);
      let novaQtd = parseInt(input.value) || 1;
      if (novaQtd < 1) novaQtd = 1;
      carrinho[idx].quantidade = novaQtd;
      salvarCarrinho();
      renderizarCarrinhoIcone();
      renderizarPainelCarrinho();
    };
  });
  // Finalizar compra
  painel.querySelector('#carrinho-form').onsubmit = (e) => {
    e.preventDefault();
    alert('Compra finalizada! (simulação)');
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinhoIcone();
    renderizarPainelCarrinho();
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

function mostrarFeedbackCarrinho(nomeProduto) {
  let feedback = document.getElementById('carrinho-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.id = 'carrinho-feedback';
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
  feedback.textContent = `Adicionado ao carrinho: ${nomeProduto}`;
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

    // Lógica para radio buttons de preço
    let precoHtml = '';
    if (produto.precoTonelada) {
      precoHtml = `
        <div class="produto-preco-opcoes">
          <label><input type="radio" name="preco-${produto.id}" value="unidade" checked> Unidade</label>
          <label><input type="radio" name="preco-${produto.id}" value="tonelada"> Tonelada</label>
        </div>
        <div class="produto-preco-valor" id="preco-valor-${produto.id}"><strong>${produto.preco}</strong></div>
      `;
    } else {
      precoHtml = `<div class="produto-preco-valor"><strong>${produto.preco}</strong></div>`;
    }

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      ${precoHtml}
      ${produto.descricao ? `<div class='produto-descricao'>${produto.descricao}</div>` : ''}
      <div class="produto-quantidade">Qt. <input type="number" min="1" value="1"></div>
      <div class="produto-botoes">
        <button class="btn-carrinho">Adicionar ao carrinho</button>
        <button class="btn-comprar">Comprar agora</button>
      </div>
    `;
    grid.appendChild(card);

    // Adicionar evento para radio buttons de preço
    if (produto.precoTonelada) {
      const radios = card.querySelectorAll(`input[name="preco-${produto.id}"]`);
      const precoValorDiv = card.querySelector(`#preco-valor-${produto.id}`);
      radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          if (e.target.value === 'unidade') {
            precoValorDiv.innerHTML = `<strong>${produto.preco}</strong>`;
          } else {
            precoValorDiv.innerHTML = `<strong>${produto.precoTonelada}</strong>`;
          }
        });
      });
    }

    // Evento para botão adicionar ao carrinho
    const btnCarrinho = card.querySelector('.btn-carrinho');
    const inputQtd = card.querySelector('.produto-quantidade input');
    btnCarrinho.addEventListener('click', () => {
      const qtd = parseInt(inputQtd.value) || 1;
      adicionarAoCarrinho(produto, qtd);
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

// Atualizar lógica de adicionar ao carrinho para salvar preço selecionado e atualizar painel se aberto
function adicionarAoCarrinho(produto, quantidade) {
  let precoSelecionado = produto.preco;
  if (produto.precoTonelada) {
    const radio = document.querySelector(`input[name=\"preco-${produto.id}\"]:checked`);
    if (radio && radio.value === 'tonelada') precoSelecionado = produto.precoTonelada;
  }
  const idx = carrinho.findIndex(item => item.id === produto.id && item.precoSelecionado === precoSelecionado);
  if (idx > -1) {
    carrinho[idx].quantidade += quantidade;
  } else {
    carrinho.push({ ...produto, quantidade, precoSelecionado });
  }
  salvarCarrinho();
  renderizarCarrinhoIcone();
  mostrarFeedbackCarrinho(produto.nome);
  // Se painel estiver aberto, atualizar
  const painel = document.getElementById('painel-carrinho');
  if (painel && painel.classList.contains('aberto')) {
    renderizarPainelCarrinho();
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
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  iconeContainer.innerHTML = `
    <div id="carrinho-icone" style="position:fixed;bottom:32px;right:32px;z-index:1000;cursor:pointer;background:#fff;border-radius:50%;box-shadow:0 2px 8px rgba(12,118,214,0.10);width:52px;height:52px;display:flex;align-items:center;justify-content:center;">
      <span style="font-size:2rem;">🛒</span>
      <span id="carrinho-contador" style="position:absolute;top:10px;right:10px;background:#0C76D6;color:#fff;font-size:0.95rem;font-weight:bold;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;">${totalItens}</span>
    </div>
  `;
  ativarPainelCarrinho();
}

// Inicialização
renderizarProdutos();
renderizarPaginacao();
renderizarCarrinhoIcone(); 