// Galeria de Imagens dos Projetos
class GaleriaProjetos {
    constructor() {
        this.autoplayAtivo = false;
        this.intervalos = new Map();
        this.tempoTransicao = 4000; // 4 segundos entre transições
        this.init();
    }

    init() {
        this.setupAutoplay();
        this.setupModal();
        this.setupVideos();
        this.setupInteracoes();
    }

    // Configurar autoplay global
    setupAutoplay() {
        const autoplayBtn = document.getElementById('autoplay-toggle');
        if (autoplayBtn) {
            autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
        }
    }

    // Configurar modal de visualização
    setupModal() {
        // Criar modal se não existir
        if (!document.querySelector('.modal-overlay')) {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close" onclick="this.parentElement.parentElement.classList.remove('active')">
                        <i class="fas fa-times"></i>
                    </button>
                    <img class="modal-image" src="" alt="Imagem ampliada">
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal-overlay');
                if (modal) modal.classList.remove('active');
            }
        });

        // Fechar modal clicando fora
        document.addEventListener('click', (e) => {
            const modal = document.querySelector('.modal-overlay');
            if (modal && e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Configurar vídeos
    setupVideos() {
        const videos = document.querySelectorAll('.galeria-video');
        videos.forEach(video => {
            video.addEventListener('play', () => this.pausarAutoplay(video.closest('.trabalho-item')));
            video.addEventListener('pause', () => this.retomarAutoplay(video.closest('.trabalho-item')));
            video.addEventListener('click', () => this.toggleVideo(video));
            
            // Adicionar controles de vídeo
            video.controls = true;
            video.preload = 'metadata';
        });
    }

    // Toggle de vídeo (play/pause)
    toggleVideo(video) {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    // Configurar interações do usuário
    setupInteracoes() {
        const trabalhos = document.querySelectorAll('.trabalho-item');
        trabalhos.forEach(trabalho => {
            // Pausar autoplay quando o usuário interage
            trabalho.addEventListener('mouseenter', () => {
                if (this.autoplayAtivo) {
                    this.pararAutoplay(trabalho);
                }
            });
            
            trabalho.addEventListener('mouseleave', () => {
                if (this.autoplayAtivo) {
                    this.iniciarAutoplay(trabalho);
                }
            });
            
            // Pausar autoplay quando clicar nos controles
            const controles = trabalho.querySelectorAll('.galeria-controls button, .galeria-indicators button');
            controles.forEach(controle => {
                controle.addEventListener('click', () => {
                    if (this.autoplayAtivo) {
                        this.pararAutoplay(trabalho);
                        setTimeout(() => {
                            if (this.autoplayAtivo) {
                                this.iniciarAutoplay(trabalho);
                            }
                        }, 3000); // Retomar após 3 segundos
                    }
                });
            });
        });
    }

    // Iniciar autoplay para um trabalho específico
    iniciarAutoplay(trabalhoItem) {
        if (this.autoplayAtivo && !this.intervalos.has(trabalhoItem)) {
            const intervalo = setInterval(() => {
                this.proximaImagem(trabalhoItem);
            }, this.tempoTransicao);
            
            this.intervalos.set(trabalhoItem, intervalo);
        }
    }

    // Parar autoplay para um trabalho específico
    pararAutoplay(trabalhoItem) {
        const intervalo = this.intervalos.get(trabalhoItem);
        if (intervalo) {
            clearInterval(intervalo);
            this.intervalos.delete(trabalhoItem);
        }
    }

    // Pausar autoplay (quando vídeo está rodando)
    pausarAutoplay(trabalhoItem) {
        this.pararAutoplay(trabalhoItem);
    }

    // Retomar autoplay (quando vídeo para)
    retomarAutoplay(trabalhoItem) {
        if (this.autoplayAtivo) {
            this.iniciarAutoplay(trabalhoItem);
        }
    }

    // Ativar/desativar autoplay global
    toggleAutoplay() {
        this.autoplayAtivo = !this.autoplayAtivo;
        const autoplayBtn = document.getElementById('autoplay-toggle');
        const autoplayIcon = document.getElementById('autoplay-icon');
        const autoplayText = document.getElementById('autoplay-text');

        if (this.autoplayAtivo) {
            autoplayIcon.className = 'fas fa-pause';
            autoplayText.textContent = 'Pausar Autoplay';
            this.iniciarAutoplayEmTodos();
        } else {
            autoplayIcon.className = 'fas fa-play';
            autoplayText.textContent = 'Ativar Autoplay';
            this.pararAutoplayEmTodos();
        }
    }

    // Iniciar autoplay em todos os trabalhos
    iniciarAutoplayEmTodos() {
        const trabalhos = document.querySelectorAll('.trabalho-item');
        trabalhos.forEach(trabalho => this.iniciarAutoplay(trabalho));
    }

    // Parar autoplay em todos os trabalhos
    pararAutoplayEmTodos() {
        const trabalhos = document.querySelectorAll('.trabalho-item');
        trabalhos.forEach(trabalho => this.pararAutoplay(trabalho));
    }

    // Mudar slide (navegação manual)
    mudarSlide(button, direcao) {
        const trabalhoItem = button.closest('.trabalho-item');
        const slides = trabalhoItem.querySelectorAll('.galeria-slide');
        const slideAtivo = trabalhoItem.querySelector('.galeria-slide.active');
        let indiceAtual = Array.from(slides).indexOf(slideAtivo);
        
        // Calcular novo índice
        let novoIndice = indiceAtual + direcao;
        if (novoIndice < 0) novoIndice = slides.length - 1;
        if (novoIndice >= slides.length) novoIndice = 0;

        this.irParaSlideIndice(trabalhoItem, novoIndice);
        
        // Reiniciar autoplay se estiver ativo
        if (this.autoplayAtivo) {
            this.pararAutoplay(trabalhoItem);
            this.iniciarAutoplay(trabalhoItem);
        }
    }

    // Ir para slide específico
    irParaSlide(button, indice) {
        const trabalhoItem = button.closest('.trabalho-item');
        this.irParaSlideIndice(trabalhoItem, indice);
        
        // Reiniciar autoplay se estiver ativo
        if (this.autoplayAtivo) {
            this.pararAutoplay(trabalhoItem);
            this.iniciarAutoplay(trabalhoItem);
        }
    }

    // Ir para slide por índice
    irParaSlideIndice(trabalhoItem, indice) {
        const slides = trabalhoItem.querySelectorAll('.galeria-slide');
        const indicators = trabalhoItem.querySelectorAll('.galeria-indicators button');
        
        // Remover classe active do slide atual
        const slideAtivo = trabalhoItem.querySelector('.galeria-slide.active');
        if (slideAtivo) slideAtivo.classList.remove('active');
        
        // Remover classe active do indicador atual
        const indicadorAtivo = trabalhoItem.querySelector('.galeria-indicators button.active');
        if (indicadorAtivo) indicadorAtivo.classList.remove('active');
        
        // Ativar novo slide
        if (slides[indice]) {
            slides[indice].classList.add('active');
        }
        
        // Ativar novo indicador
        if (indicators[indice]) {
            indicators[indice].classList.add('active');
        }
        
        // Atualizar estado dos botões de navegação
        this.atualizarBotoesNavegacao(trabalhoItem, indice, slides.length);
    }

    // Atualizar estado dos botões de navegação
    atualizarBotoesNavegacao(trabalhoItem, indiceAtual, totalSlides) {
        const btnPrev = trabalhoItem.querySelector('.galeria-prev');
        const btnNext = trabalhoItem.querySelector('.galeria-next');
        
        if (btnPrev) btnPrev.disabled = totalSlides <= 1;
        if (btnNext) btnNext.disabled = totalSlides <= 1;
    }

    // Próxima imagem (para autoplay)
    proximaImagem(trabalhoItem) {
        const slides = trabalhoItem.querySelectorAll('.galeria-slide');
        const slideAtivo = trabalhoItem.querySelector('.galeria-slide.active');
        let indiceAtual = Array.from(slides).indexOf(slideAtivo);
        
        let proximoIndice = (indiceAtual + 1) % slides.length;
        this.irParaSlideIndice(trabalhoItem, proximoIndice);
    }

    // Ampliar imagem
    ampliarImagem(button) {
        const trabalhoItem = button.closest('.trabalho-item');
        const slideAtivo = trabalhoItem.querySelector('.galeria-slide.active');
        const imagem = slideAtivo.querySelector('img, video');
        
        if (imagem) {
            const modal = document.querySelector('.modal-overlay');
            const modalImage = modal.querySelector('.modal-image');
            
            if (imagem.tagName === 'VIDEO') {
                // Para vídeos, mostrar o vídeo em tela cheia
                if (imagem.requestFullscreen) {
                    imagem.requestFullscreen();
                } else if (imagem.webkitRequestFullscreen) {
                    imagem.webkitRequestFullscreen();
                } else if (imagem.msRequestFullscreen) {
                    imagem.msRequestFullscreen();
                }
            } else {
                // Para imagens, mostrar no modal
                modalImage.src = imagem.src;
                modalImage.alt = imagem.alt;
                modal.classList.add('active');
            }
        }
    }
}

// Funções globais para compatibilidade com onclick
function mudarSlide(button, direcao) {
    galeria.mudarSlide(button, direcao);
}

function irParaSlide(button, indice) {
    galeria.irParaSlide(button, indice);
}

function ampliarImagem(button) {
    galeria.ampliarImagem(button);
}

// Inicializar galeria quando o DOM estiver carregado
let galeria;
document.addEventListener('DOMContentLoaded', () => {
    galeria = new GaleriaProjetos();
});
