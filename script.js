const normalizeText = () => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (node.parentElement?.closest('script, style')) return;
    node.nodeValue = node.nodeValue.replace(/\s—\s/g, ': ').replace(/(\S+)\s+(\S+)(\s*)$/, '$1\u00a0$2$3');
  });
};
normalizeText();

const metricLabel = document.querySelector('.case-metric > span');
if (metricLabel) metricLabel.innerHTML = 'REDUÇÃO ESTIMADA NO CICLO DE IMPLEMENTAÇÃO&nbsp;FRONT‑END';

const year = document.querySelector('#copyright-year');
if (year) year.textContent = new Date().getFullYear();
document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => { const target = document.querySelector(link.getAttribute('href')); if (!target) return; event.preventDefault(); target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }));

const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!motionReduced && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.section, footer').forEach((element) => { element.classList.add('reveal'); observer.observe(element); });
  document.querySelectorAll('.hero .reveal').forEach((element) => requestAnimationFrame(() => element.classList.add('is-visible')));
} else document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));

if (!motionReduced && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      element.style.setProperty('--spot-x', `${x}px`);
      element.style.setProperty('--spot-y', `${y}px`);
      element.style.transform = `translate(${(x / bounds.width - .5) * 5}px, ${(y / bounds.height - .5) * 4}px)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });

  document.querySelectorAll('.tilt-card').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const box = element.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      element.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${y * -4}deg) translateY(-4px)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });
}
