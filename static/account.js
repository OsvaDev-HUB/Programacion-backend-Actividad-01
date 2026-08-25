const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
    document.documentElement.classList.add('motion-enabled');

    document.querySelectorAll('[data-entrance]').forEach((item) => {
        item.classList.add('entrance-active');
    });

    document.querySelectorAll('[data-stagger]').forEach((group) => {
        Array.from(group.children).forEach((item, index) => {
            item.style.setProperty('--stagger-delay', `${index * 45}ms`);
        });
    });

    const animatedItems = document.querySelectorAll('[data-reveal], [data-progress-bar]');
    animatedItems.forEach((item) => item.classList.add('reveal-pending'));

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                currentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    animatedItems.forEach((item) => observer.observe(item));
}

const passwordInput = document.querySelector('#password');
const passwordToggle = document.querySelector('.password-toggle');

if (passwordInput && passwordToggle) {
    passwordToggle.addEventListener('click', () => {
        const shouldShow = passwordInput.type === 'password';
        passwordInput.type = shouldShow ? 'text' : 'password';
        passwordToggle.textContent = shouldShow ? 'Ocultar' : 'Mostrar';
        passwordToggle.setAttribute('aria-label', shouldShow ? 'Ocultar contraseña' : 'Mostrar contraseña');
        passwordToggle.setAttribute('aria-pressed', String(shouldShow));
        passwordInput.focus();
    });
}

const loginForm = document.querySelector('.login-form');
const loginButton = document.querySelector('.login-button');

if (loginForm && loginButton) {
    loginForm.addEventListener('submit', () => {
        if (loginForm.checkValidity()) {
            loginButton.disabled = true;
            loginButton.classList.add('is-loading');
            loginButton.innerHTML = 'Ingresando <span aria-hidden="true">···</span>';
        }
    });
}
