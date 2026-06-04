// ═══ CUSTOM CURSOR ═══
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
});

(function animCursor() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();

// Aumentar cursor ao passar por elementos interativos
document.querySelectorAll('a, button, input').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '16px';
    cursor.style.height = '16px';
    ring.style.width = '56px';
    ring.style.height = '56px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    ring.style.width = '36px';
    ring.style.height = '36px';
  });
});

// ═══ ABAS ─ TAB SWITCHING ═══
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');

    // Remove active de todos os botões e formulários
    tabBtns.forEach((b) => b.classList.remove('active'));
    authForms.forEach((f) => f.classList.remove('active'));

    // Adiciona active ao botão clicado e seu formulário
    btn.classList.add('active');
    document.querySelector(`.auth-form[data-tab="${tabName}"]`).classList.add('active');

    // Foca no primeiro input do formulário ativo
    const firstInput = document.querySelector(`.auth-form[data-tab="${tabName}"] input`);
    if (firstInput) firstInput.focus();
  });
});

// ═══ FORMULÁRIO DE LOGIN ═══
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const remember = document.getElementById('remember').checked;

    // Validação básica
    if (!email || !password) {
      showMessage('Por favor, preencha todos os campos', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showMessage('Email inválido', 'error');
      return;
    }

    // Enviar para backend
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          lembrarMe: remember,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Login realizado com sucesso!', 'success');
        // Redirecionar após 1.5s
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        showMessage(data.erro || 'Erro ao fazer login', 'error');
      }
    } catch (error) {
      console.error('Erro:', error);
      showMessage('Erro de conexão. Tente novamente mais tarde.', 'error');
    }
  });
}

// ═══ FORMULÁRIO DE CADASTRO ═══
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('emailCadastro').value.trim();
    const senha = document.getElementById('senhaCadastro').value;
    const confirmaSenha = document.getElementById('confirmaSenha').value;
    const terms = document.getElementById('terms').checked;

    // Validações
    if (!nome || !email || !senha || !confirmaSenha) {
      showMessage('Por favor, preencha todos os campos', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showMessage('Email inválido', 'error');
      return;
    }

    if (senha.length < 8) {
      showMessage('A senha deve ter no mínimo 8 caracteres', 'error');
      return;
    }

    if (senha !== confirmaSenha) {
      showMessage('As senhas não coincidem', 'error');
      return;
    }

    if (!terms) {
      showMessage('Você deve aceitar os termos de uso', 'error');
      return;
    }

    // Enviar para backend
    try {
      const response = await fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Cadastro realizado com sucesso! Redirecionando...', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        showMessage(data.erro || 'Erro ao criar conta', 'error');
      }
    } catch (error) {
      console.error('Erro:', error);
      showMessage('Erro de conexão. Tente novamente mais tarde.', 'error');
    }
  });
}

// ═══ BOTÕES SOCIAIS ═══
document.querySelectorAll('.btn-social').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const provider = btn.getAttribute('title').toLowerCase();
    // Aqui você implementaria OAuth com Google, GitHub, Apple
    console.log(`Login com ${provider}`);
    showMessage(`Funcionalidade de ${provider} em breve!`, 'info');
  });
});

// ═══ LINK "ESQUECEU SENHA" ═══
const forgotLink = document.querySelector('.forgot-link');
if (forgotLink) {
  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    showMessage('Verifique seu email para redefinir a senha', 'info');
    // Implementar modal ou página de recuperação
  });
}

// ═══ FUNÇÕES AUXILIARES ═══

/**
 * Valida formato de email
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Mostra mensagem temporária ao usuário
 */
function showMessage(message, type = 'info') {
  // Remove notificação anterior se existir
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Estilos inline para a notificação (fallback)
  notification.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    padding: 14px 20px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 500;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  `;

  // Cores baseadas no tipo
  if (type === 'error') {
    notification.style.background = '#fee';
    notification.style.color = '#8b2e2e';
    notification.style.borderLeft = '4px solid #7a1c1c';
  } else if (type === 'success') {
    notification.style.background = '#efe';
    notification.style.color = '#2e8b5e';
    notification.style.borderLeft = '4px solid #4caf50';
  } else {
    notification.style.background = '#eef';
    notification.style.color = '#2e5e8b';
    notification.style.borderLeft = '4px solid #2196f3';
  }

  document.body.appendChild(notification);

  // Remover após 4 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

/**
 * Adicionar animações de notificação ao CSS dinamicamente
 */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);

// ═══ ENTER PARA SUBMIT ═══
// Permitir envio do formulário pressionando Enter
document.querySelectorAll('.auth-form input').forEach((input) => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const form = input.closest('.auth-form');
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    }
  });
});

// ═══ MENSAGEM DE BEM-VINDO ═══
console.log('%cRota Alternativa', 'font-size: 24px; font-weight: bold; color: #7a1c1c;');
console.log('Bem-vindo! Faça seu login ou cadastro para continuar.');