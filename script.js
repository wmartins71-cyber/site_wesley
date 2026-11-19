const introRain = document.querySelector('.intro-rain');
const copyrightYear = document.querySelector('#copyright-year');

if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const compactViewport = window.matchMedia('(max-width: 520px)').matches;
const introRevealDelay = compactViewport ? 2000 : 3600;
const introCompleteDelay = compactViewport ? 2750 : 4350;

if (!introRain || reducedMotion) {
  document.body.classList.remove('intro-pending');
  document.body.classList.add('intro-complete');
} else {
  window.requestAnimationFrame(() => document.body.classList.add('intro-running'));
  window.setTimeout(() => document.body.classList.add('intro-reveal'), introRevealDelay);
  window.setTimeout(() => {
    document.body.classList.remove('intro-pending', 'intro-running', 'intro-reveal');
    document.body.classList.add('intro-complete');
  }, introCompleteDelay);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { event.preventDefault(); target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
  });
});

const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');

copyButton?.addEventListener('click', async () => {
  const email = copyButton.dataset.email;
  if (!email) return;
  try {
    await navigator.clipboard.writeText(email);
    copyButton.textContent = 'Copiado';
    copyStatus.textContent = 'E-mail copiado para a área de transferência.';
  } catch {
    copyStatus.textContent = `Copie o e-mail: ${email}`;
  }
  window.setTimeout(() => { copyButton.textContent = 'Copiar'; }, 2200);
});

// Mantém as duas últimas palavras unidas para evitar uma única palavra na linha final.
document.querySelectorAll('h1, h2, h3, p, li, small, .lead, .hero-intro, .workflow span').forEach((element) => {
  const textNodes = [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
  const lastNode = textNodes.at(-1);
  if (!lastNode) return;
  lastNode.nodeValue = lastNode.nodeValue.replace(/(\S+)\s+(\S+)(\s*)$/, '$1\u00A0$2$3');
});

const sectionLabels = [
  '01 / como eu trabalho',
  '02 / experiência',
  '03 / formação',
  '04 / na prática',
];
document.querySelectorAll('.section-index').forEach((label, index) => {
  if (sectionLabels[index]) label.textContent = sectionLabels[index];
});

const navLinks = [...document.querySelectorAll('.header nav a')];
const trackedSections = navLinks
  .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter((item) => item.section);

const setActiveNav = (activeLink) => {
  navLinks.forEach((link) => link.classList.toggle('is-active', link === activeLink));
};

const navObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
  if (!visible[0]) return;
  const item = trackedSections.find(({ section }) => section === visible[0].target);
  if (item) setActiveNav(item.link);
}, { rootMargin: '-28% 0px -58% 0px', threshold: [0.05, 0.2, 0.45] });

trackedSections.forEach(({ section }) => navObserver.observe(section));

const backToTop = document.querySelector('.back-to-top');
const toggleBackToTop = () => backToTop?.classList.toggle('is-visible', window.scrollY > 500);
window.addEventListener('scroll', toggleBackToTop, { passive: true });
toggleBackToTop();
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));

