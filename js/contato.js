// Sistema de Formulários de Contato - R-Mont
class FormularioContato {
  constructor() {
    this.formularios = document.querySelectorAll('.formulario-contato');
    this.inicializar();
  }

  inicializar() {
    this.formularios.forEach(form => {
      this.configurarFormulario(form);
    });
  }

  configurarFormulario(form) {
    // Adicionar validação em tempo real
    this.adicionarValidacaoTempoReal(form);
    
    // Configurar envio do formulário
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.processarEnvio(form);
    });

    // Configurar máscara de telefone
    const telefoneInput = form.querySelector('input[name="telefone"]');
    if (telefoneInput) {
      this.aplicarMascaraTelefone(telefoneInput);
    }
  }

  aplicarMascaraTelefone(input) {
    input.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, '');
      if (valor.length <= 9) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
      } else if (valor.length <= 12) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
      }
      e.target.value = valor;
    });
  }

  adicionarValidacaoTempoReal(form) {
    const campos = form.querySelectorAll('input, select, textarea');
    
    campos.forEach(campo => {
      campo.addEventListener('blur', () => {
        this.validarCampo(campo);
      });
      
      campo.addEventListener('input', () => {
        this.removerErro(campo);
      });
    });
  }

  validarCampo(campo) {
    const valor = campo.value.trim();
    const nome = campo.name;
    
    // Remover erros anteriores
    this.removerErro(campo);
    
    // Validações específicas
    let erro = '';
    
    if (campo.hasAttribute('required') && !valor) {
      erro = 'Este campo é obrigatório';
    } else if (nome === 'email' && valor && !this.validarEmail(valor)) {
      erro = 'E-mail inválido';
    } else if (nome === 'telefone' && valor && !this.validarTelefone(valor)) {
      erro = 'Telefone inválido';
    } else if (nome === 'mensagem' && valor && valor.length < 10) {
      erro = 'A mensagem deve ter pelo menos 10 caracteres';
    }
    
    if (erro) {
      this.mostrarErro(campo, erro);
      return false;
    }
    
    return true;
  }

  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  validarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length >= 9;
  }

  mostrarErro(campo, mensagem) {
    const erroDiv = document.createElement('div');
    erroDiv.className = 'erro-campo';
    erroDiv.textContent = mensagem;
    erroDiv.style.cssText = `
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    `;
    
    campo.parentNode.appendChild(erroDiv);
    campo.classList.add('erro');
  }

  removerErro(campo) {
    const erro = campo.parentNode.querySelector('.erro-campo');
    if (erro) {
      erro.remove();
    }
    campo.classList.remove('erro');
  }

  validarFormulario(form) {
    const campos = form.querySelectorAll('input, select, textarea');
    let valido = true;
    
    campos.forEach(campo => {
      if (!this.validarCampo(campo)) {
        valido = false;
      }
    });
    
    return valido;
  }

  async processarEnvio(form) {
    if (!this.validarFormulario(form)) {
      this.mostrarNotificacao('Por favor, corrija os erros no formulário.', 'erro');
      return;
    }

    const dados = this.coletarDados(form);
    
    // Mostrar loading
    const botaoSubmit = form.querySelector('button[type="submit"]');
    const textoOriginal = botaoSubmit.innerHTML;
    botaoSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    botaoSubmit.disabled = true;

    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Resetar formulário
      form.reset();
      
      // Enviar email diretamente
      this.enviarEmail(dados);
      
    } catch (erro) {
      this.mostrarNotificacao('Erro ao processar. Tente novamente.', 'erro');
    } finally {
      // Restaurar botão
      botaoSubmit.innerHTML = textoOriginal;
      botaoSubmit.disabled = false;
    }
  }

  coletarDados(form) {
    const dados = {};
    const campos = form.querySelectorAll('input, select, textarea');
    
    campos.forEach(campo => {
      if (campo.name) {
        dados[campo.name] = campo.value.trim();
      }
    });
    
    return dados;
  }



  enviarEmail(dados) {
    let assunto = `Nova Solicitação de Orçamento - ${dados.nome}`;
    
    let corpo = `Nova Solicitação de Orçamento - R-Mont\n\n`;
    corpo += `Nome: ${dados.nome}\n`;
    if (dados.empresa) corpo += `Empresa: ${dados.empresa}\n`;
    corpo += `Telefone: ${dados.telefone}\n`;
    corpo += `E-mail: ${dados.email}\n`;
    corpo += `Tipo de Serviço: ${dados['tipo-servico']}\n`;
    if (dados.urgencia) corpo += `Urgência: ${dados.urgencia}\n`;
    corpo += `\nMensagem:\n${dados.mensagem}\n\n`;
    if (dados.newsletter === 'sim') corpo += `Newsletter: Sim\n`;
    corpo += `\nEnviado via formulário do site da R-Mont`;

    // Envio direto via mailto sem popup
    const mailtoUrl = `mailto:comercial@rmont-business.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    
    // Criar link e clicar diretamente
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Clique direto sem window.open
    link.click();
    document.body.removeChild(link);
    
    // Mostrar confirmação simples
    this.mostrarNotificacao('Solicitação enviada! Verifique seu cliente de email.', 'sucesso');
  }



  mostrarNotificacao(mensagem, tipo) {
    // Remover notificações anteriores do mesmo tipo
    const notificacoesExistentes = document.querySelectorAll(`.notificacao-${tipo}`);
    notificacoesExistentes.forEach(n => n.remove());

    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.innerHTML = `
      <div class="notificacao-conteudo">
        <i class="fas fa-${tipo === 'sucesso' ? 'check-circle' : tipo === 'info' ? 'info-circle' : 'exclamation-circle'}"></i>
        <span>${mensagem}</span>
        <button class="notificacao-fechar">&times;</button>
      </div>
    `;

    // Estilos da notificação
    const cores = {
      'sucesso': '#27ae60',
      'erro': '#e74c3c',
      'info': '#3498db'
    };

    notificacao.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      background: ${cores[tipo] || '#3498db'};
      color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-family: 'Montserrat', sans-serif;
      font-weight: 500;
    `;

    // Estilos do conteúdo
    const conteudo = notificacao.querySelector('.notificacao-conteudo');
    conteudo.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.75rem;
    `;

    // Estilos do botão fechar
    const botaoFechar = notificacao.querySelector('.notificacao-fechar');
    botaoFechar.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      margin-left: auto;
      padding: 0;
      line-height: 1;
      transition: opacity 0.2s ease;
    `;

    botaoFechar.addEventListener('mouseenter', () => {
      botaoFechar.style.opacity = '0.8';
    });

    botaoFechar.addEventListener('mouseleave', () => {
      botaoFechar.style.opacity = '1';
    });

    document.body.appendChild(notificacao);

    // Animar entrada
    setTimeout(() => {
      notificacao.style.transform = 'translateX(0)';
    }, 100);

    // Botão fechar
    botaoFechar.addEventListener('click', () => {
      notificacao.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notificacao.parentNode) {
          notificacao.remove();
        }
      }, 300);
    });

    // Auto-remover após 5 segundos (exceto para info que pode ter botões)
    if (tipo !== 'info') {
      setTimeout(() => {
        if (notificacao.parentNode) {
          notificacao.style.transform = 'translateX(100%)';
          setTimeout(() => {
            if (notificacao.parentNode) {
              notificacao.remove();
            }
          }, 300);
        }
      }, 5000);
    }
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new FormularioContato();
});

// Adicionar estilos CSS para campos com erro
const estilos = document.createElement('style');
estilos.textContent = `
  .formulario-contato input.erro,
  .formulario-contato select.erro,
  .formulario-contato textarea.erro {
    border-color: #e74c3c !important;
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
  }

  .formulario-contato .erro-campo {
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  }

  .notificacao {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
  }

  .notificacao i {
    font-size: 1.25rem;
  }

  .notificacao-fechar:hover {
    opacity: 0.8;
  }
`;
document.head.appendChild(estilos);
