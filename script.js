
// ── Custom Cursor ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor(){
  rx += (mx - rx) * .15; ry += (my - ry) * .15;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width='16px'; cursor.style.height='16px'; ring.style.width='56px'; ring.style.height='56px'; });
  el.addEventListener('mouseleave', () => { cursor.style.width='10px'; cursor.style.height='10px'; ring.style.width='36px'; ring.style.height='36px'; });
});

// ── Scroll Progress ──
const progressBar = document.getElementById('progress');
window.addEventListener('scroll', () => {
  progressBar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
});

// ── Hero Compass: reacts to mouse movement ──
const heroCompass = document.getElementById('heroCompass');
let currentMouseAngle = 0;
document.addEventListener('mousemove', e => {
  const rect = heroCompass.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
  currentMouseAngle = angle * 0.12;
  heroCompass.style.transform = `rotate(${currentMouseAngle}deg)`;
});

// ── Scroll Story (Apple-style) ──
const scrollStory = document.getElementById('scrollStory');
const panels = [document.getElementById('panel0'), document.getElementById('panel1'), document.getElementById('panel2')];
const dots = document.querySelectorAll('.story-dot');
const bgText = document.getElementById('scrollBgText');
let currentPanel = 0;

function showPanel(idx) {
  panels.forEach((p, i) => p.classList.toggle('active', i === idx));
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  currentPanel = idx;
}
showPanel(0);

window.addEventListener('scroll', () => {
  const rect = scrollStory.getBoundingClientRect();
  const prog = Math.max(0, Math.min(1, -rect.top / (scrollStory.offsetHeight - window.innerHeight)));
  const panelIdx = Math.min(panels.length - 1, Math.floor(prog * panels.length));
  if (panelIdx !== currentPanel) showPanel(panelIdx);
  if (bgText) {
    bgText.style.transform = `translate(calc(-50% + ${prog * 80 - 40}px), -50%)`;
  }
});

// ── Intersection observer for feature cards ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.2 });
document.querySelectorAll('.feature-card').forEach(c => obs.observe(c));

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});
const formContato = document.getElementById("formContato");

if (formContato) {
  formContato.addEventListener("submit", async function (e) {
    e.preventDefault();

    const dados = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("telefone").value,
      destino: document.getElementById("destino").value,
      mensagem: document.getElementById("mensagem").value
    };

    const resposta = await fetch("http://localhost:3000/contato", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      alert(resultado.mensagem);
      formContato.reset();
    } else {
      alert(resultado.erro);
    }
  });
}