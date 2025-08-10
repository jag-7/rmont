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

    // Verificar se há dados de backup para restaurar
    this.verificarBackup(form);
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
    
    // Salvar dados no localStorage para backup
    this.salvarDadosBackup(dados);
    
    // Mostrar loading
    const botaoSubmit = form.querySelector('button[type="submit"]');
    const textoOriginal = botaoSubmit.innerHTML;
    botaoSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    botaoSubmit.disabled = true;

    try {
      // Simular envio (em produção, aqui seria uma API real)
      await this.simularEnvio(dados);
      
      // Sucesso
      this.mostrarNotificacao('Solicitação enviada com sucesso! Verifique seu email para confirmação.', 'sucesso');
      
      // Salvar histórico de envios
      this.salvarHistoricoEnvio(dados);
      
      // Resetar formulário
      form.reset();
      
      // Enviar via email
      this.enviarEmail(dados);
      
    } catch (erro) {
      this.mostrarNotificacao('Erro ao enviar. Tente novamente ou entre em contato diretamente.', 'erro');
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

  simularEnvio(dados) {
    return new Promise((resolve) => {
      // Simular delay de rede
      setTimeout(() => {
        console.log('Dados do formulário:', dados);
        resolve();
      }, 1500);
    });
  }

  salvarDadosBackup(dados) {
    try {
      localStorage.setItem('rmont_formulario_backup', JSON.stringify({
        ...dados,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.log('Erro ao salvar backup:', e);
    }
  }

  salvarHistoricoEnvio(dados) {
    try {
      const historico = JSON.parse(localStorage.getItem('rmont_historico_envios') || '[]');
      historico.unshift({
        ...dados,
        timestamp: new Date().toISOString(),
        status: 'enviado'
      });
      
      // Manter apenas os últimos 10 envios
      if (historico.length > 10) {
        historico.splice(10);
      }
      
      localStorage.setItem('rmont_historico_envios', JSON.stringify(historico));
    } catch (e) {
      console.log('Erro ao salvar histórico:', e);
    }
  }

  carregarDadosBackup() {
    try {
      const backup = localStorage.getItem('rmont_formulario_backup');
      if (backup) {
        const dados = JSON.parse(backup);
        // Verificar se o backup é recente (últimas 24h)
        const backupTime = new Date(dados.timestamp);
        const agora = new Date();
        const diffHoras = (agora - backupTime) / (1000 * 60 * 60);
        
        if (diffHoras < 24) {
          return dados;
        }
      }
    } catch (e) {
      console.log('Erro ao carregar backup:', e);
    }
    return null;
  }

  verificarBackup(form) {
    const backup = this.carregarDadosBackup();
    if (backup) {
      // Aguardar um pouco para o formulário estar completamente carregado
      setTimeout(() => {
        this.mostrarOpcaoBackup(form, backup);
      }, 1000);
    }
  }

  mostrarOpcaoBackup(form, backup) {
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao notificacao-info';
    notificacao.innerHTML = `
      <div class="notificacao-conteudo">
        <i class="fas fa-info-circle"></i>
        <span>Detectamos dados não enviados. Deseja restaurá-los?</span>
        <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
          <button class="btn-restaurar" style="background: #27ae60; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">Restaurar</button>
          <button class="btn-ignorar" style="background: #95a5a6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">Ignorar</button>
        </div>
      </div>
    `;

    // Estilos da notificação
    notificacao.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      background: #3498db;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    document.body.appendChild(notificacao);

    // Animar entrada
    setTimeout(() => {
      notificacao.style.transform = 'translateX(0)';
    }, 100);

    // Botões de ação
    notificacao.querySelector('.btn-restaurar').onclick = () => {
      this.restaurarDados(form, backup);
      notificacao.remove();
    };

    notificacao.querySelector('.btn-ignorar').onclick = () => {
      notificacao.remove();
      // Limpar backup se não quiser restaurar
      localStorage.removeItem('rmont_formulario_backup');
    };

    // Auto-remover após 10 segundos
    setTimeout(() => {
      if (notificacao.parentNode) {
        notificacao.remove();
      }
    }, 10000);
  }

  restaurarDados(form, backup) {
    Object.keys(backup).forEach(key => {
      if (key !== 'timestamp') {
        const campo = form.querySelector(`[name="${key}"]`);
        if (campo) {
          if (campo.type === 'checkbox') {
            campo.checked = backup[key] === 'sim';
          } else {
            campo.value = backup[key];
          }
        }
      }
    });
    
    this.mostrarNotificacao('Dados restaurados com sucesso!', 'sucesso');
    
    // Limpar backup após restaurar
    localStorage.removeItem('rmont_formulario_backup');
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

    const url = `mailto:comercial@rmont-business.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    
    // Perguntar se quer abrir o cliente de email
    if (confirm('Solicitação enviada! Deseja abrir seu cliente de email para enviar a solicitação diretamente?')) {
      window.open(url, '_blank');
    }
  }

  mostrarNotificacao(mensagem, tipo) {
    // Remover notificações anteriores
    const notificacoesExistentes = document.querySelectorAll('.notificacao');
    notificacoesExistentes.forEach(n => n.remove());

    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.innerHTML = `
      <div class="notificacao-conteudo">
        <i class="fas fa-${tipo === 'sucesso' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${mensagem}</span>
        <button class="notificacao-fechar">&times;</button>
      </div>
    `;

    // Estilos da notificação
    notificacao.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      background: ${tipo === 'sucesso' ? '#27ae60' : '#e74c3c'};
      color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
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
    `;

    document.body.appendChild(notificacao);

    // Animar entrada
    setTimeout(() => {
      notificacao.style.transform = 'translateX(0)';
    }, 100);

    // Botão fechar
    botaoFechar.addEventListener('click', () => {
      notificacao.style.transform = 'translateX(100%)';
      setTimeout(() => notificacao.remove(), 300);
    });

    // Auto-remover após 5 segundos
    setTimeout(() => {
      if (notificacao.parentNode) {
        notificacao.style.transform = 'translateX(100%)';
        setTimeout(() => notificacao.remove(), 300);
      }
    }, 5000);
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
