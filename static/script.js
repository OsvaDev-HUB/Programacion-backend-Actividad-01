const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.classList.toggle('is-open', isOpen);
    });

    navigation.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navigation.classList.remove('is-open');
            menuButton.classList.remove('is-open');
            menuButton.setAttribute('aria-expanded', 'false');
        });
    });
}

if (!reduceMotion) {
    document.documentElement.classList.add('motion-enabled');

    document.querySelectorAll('[data-entrance]').forEach((item) => {
        item.classList.add('entrance-active');
    });

    const revealItems = document.querySelectorAll('[data-reveal]');

    revealItems.forEach((item) => item.classList.add('reveal-pending'));

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                currentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach((item) => observer.observe(item));

    document.querySelectorAll('[data-stagger]').forEach((group) => {
        Array.from(group.children).forEach((item, index) => {
            item.style.setProperty('--stagger-delay', `${index * 45}ms`);
        });
    });
}

const year = document.querySelector('#year');
if (year) {
    year.textContent = new Date().getFullYear();
}
