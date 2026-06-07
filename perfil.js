/* ════════════════════════════════
   ROTA ALTERNATIVA — PERFIL
   perfil.js
════════════════════════════════ */

// ── Cursor ──
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
(function loop(){ rx+=(mx-rx)*.15; ry+=(my-ry)*.15; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(loop); })();
document.querySelectorAll('a,button,input,select,textarea,label').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ cursor.style.width='16px'; cursor.style.height='16px'; ring.style.width='52px'; ring.style.height='52px'; });
  el.addEventListener('mouseleave',()=>{ cursor.style.width='10px'; cursor.style.height='10px'; ring.style.width='36px'; ring.style.height='36px'; });
});

// ── Toast ──
const toastEl = document.getElementById('toast');
let toastTimer;
function toast(msg, type='', ms=3200){
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.className   = `toast ${type}`;
  toastEl.style.animation = 'slideInR .3s ease forwards';
  toastTimer = setTimeout(()=>{
    toastEl.style.animation='slideOutR .3s ease forwards';
    setTimeout(()=>toastEl.classList.add('hidden'),300);
  }, ms);
}

// ════════════════════════════════
// ESTADO DO PERFIL
// ════════════════════════════════
const DEFAULT_PROFILE = {
  nome: '', email: '', location: '', instagram: '',
  bio: '', phone: '', status: 'online',
  photo: '', schedule: { dias: [], periodos: [] },
  routes: []
};

// Carrega do localStorage (dados do cadastro + edições anteriores)
function loadProfile(){
  // Dados do cadastro (salvos pelo auth.js)
  let auth = {};
  try { auth = JSON.parse(localStorage.getItem('rota_user') || '{}'); } catch(e){}

  // Dados do perfil já editados antes
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('rota_perfil') || '{}'); } catch(e){}

  // Mescla: cadastro + edições (edições têm prioridade, mas nome/email do auth preenchem se vazio)
  const p = { ...DEFAULT_PROFILE, ...saved };
  if (!p.nome     && auth.nome)       p.nome     = auth.nome;
  if (!p.email    && auth.email)      p.email    = auth.email;
  if (!p.phone    && auth.telefone)   p.phone    = auth.telefone;
  if (!p.location && auth.localizacao) p.location = auth.localizacao;
  return p;
}

function saveProfile(p){
  localStorage.setItem('rota_perfil', JSON.stringify(p));
}

let profile = loadProfile();

// ════════════════════════════════
// RENDER — preenche a página com os dados do perfil
// ════════════════════════════════
function renderAll(){
  // Nome
  const nameEl = document.getElementById('profileName');
  nameEl.textContent = profile.nome || '';

  // Email (só leitura, vem do cadastro)
  document.getElementById('contactEmail').textContent = profile.email || '—';
  document.getElementById('emailTag').textContent = profile.email ? '✓ verificado' : '';

  // Campos editáveis simples
  setField('profileLocation', profile.location);
  setField('profileInstagram', profile.instagram ? '@'+profile.instagram.replace(/^@/,'') : '');
  setField('bioText', profile.bio);
  setField('contactPhone', profile.phone);

  // Foto
  if(profile.photo){
    document.getElementById('avatarImg').src = profile.photo;
    document.getElementById('avatarImg').classList.remove('hidden');
    document.getElementById('avatarPlaceholder').classList.add('hidden');
  }

  // Status
  renderStatus();

  // Selos de verificação no nome
  renderBadges();

  // Horários
  renderScheduleView();

  // Trajetos
  renderRoutes();

  // Selos/conquistas
  renderAchievements();

  // Botão salvar no header (aparece se há dados)
  const hasData = profile.nome || profile.location || profile.bio || profile.routes.length;
  document.getElementById('btnSaveHeader').classList.toggle('hidden', !hasData);
}

function setField(id, val){
  const el = document.getElementById(id);
  if(!el) return;
  el.textContent = val || '';
}

// ── Status ──
function renderStatus(){
  const dot   = document.getElementById('statusDot');
  const label = document.getElementById('statusLabel');
  const on    = profile.status !== 'offline';
  dot.className   = 'status-dot ' + (on ? 'online' : 'offline');
  label.textContent = on ? 'Online' : 'Offline';
}

// ── Badges de verificação ──
function renderBadges(){
  const row = document.getElementById('badgesRow');
  row.innerHTML = '';
  if(profile.email){
    row.innerHTML += `<span class="badge-v"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>E-mail</span>`;
  }
  if(profile.phone){
    row.innerHTML += `<span class="badge-v"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>Telefone</span>`;
  }
}

// ── Horários ──
function renderScheduleView(){
  const view = document.getElementById('scheduleView');
  const s = profile.schedule;
  if(!s.dias.length && !s.periodos.length){
    view.innerHTML = '<p class="empty-hint">Clique no lápis para adicionar seus horários disponíveis.</p>';
    return;
  }
  let html = '<div class="schedule-days-display">';
  s.dias.forEach(d => html += `<span class="day-chip">${d}</span>`);
  html += '</div><div class="schedule-days-display">';
  s.periodos.forEach(p => {
    const map = {manha:'Manhã (6–12h)', tarde:'Tarde (12–18h)', noite:'Noite (18–23h)'};
    html += `<span class="period-chip">${map[p]||p}</span>`;
  });
  html += '</div>';
  view.innerHTML = html;
}

// ── Trajetos ──
function renderRoutes(){
  const list = document.getElementById('routesList');
  if(!profile.routes.length){
    list.innerHTML = '<li class="empty-hint">Clique no + para adicionar seus trajetos.</li>';
    return;
  }
  list.innerHTML = profile.routes.map((r,i) => `
    <li class="route-item">
      <div class="route-dots">
        <span class="dot-o"></span>
        <span class="dot-line"></span>
        <span class="dot-d"></span>
      </div>
      <div class="route-texts">
        <span class="route-from">${r.from}</span>
        <span class="route-to">${r.to}</span>
      </div>
      <span class="route-freq">${r.freq}</span>
      <button class="route-del" data-index="${i}" title="Remover">×</button>
    </li>
  `).join('');

  list.querySelectorAll('.route-del').forEach(btn => {
    btn.addEventListener('click', ()=>{
      profile.routes.splice(+btn.dataset.index, 1);
      saveProfile(profile);
      renderRoutes();
      toast('Trajeto removido.','');
    });
  });
}

// ── Conquistas ──
function renderAchievements(){
  const achVerified = document.getElementById('achVerified');
  // Conquista "Verificado" = tem e-mail cadastrado
  if(profile.email){
    achVerified.classList.remove('locked');
  } else {
    achVerified.classList.add('locked');
  }
  // Conta conquistas desbloqueadas
  const total = document.querySelectorAll('.achievement:not(.locked)').length;
  document.getElementById('badgeCounter').textContent = total + ' conquistado' + (total!==1?'s':'');
}

// ════════════════════════════════
// FOTO DE PERFIL
// ════════════════════════════════
document.getElementById('avatarEditBtn').addEventListener('click', ()=> document.getElementById('avatarInput').click());
document.getElementById('avatarInput').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  if(!file.type.startsWith('image/'))    { toast('Selecione uma imagem válida.','error'); return; }
  if(file.size > 5*1024*1024)            { toast('A imagem deve ter menos de 5MB.','error'); return; }
  const reader = new FileReader();
  reader.onload = ev=>{
    profile.photo = ev.target.result;
    saveProfile(profile);
    document.getElementById('avatarImg').src = ev.target.result;
    document.getElementById('avatarImg').classList.remove('hidden');
    document.getElementById('avatarPlaceholder').classList.add('hidden');
    showSaveBtn();
    toast('Foto atualizada! ✓','success');
  };
  reader.readAsDataURL(file);
});

// ════════════════════════════════
// STATUS ONLINE / OFFLINE
// ════════════════════════════════
document.getElementById('statusBtn').addEventListener('click', ()=>{
  profile.status = profile.status === 'online' ? 'offline' : 'online';
  saveProfile(profile);
  renderStatus();
  toast(profile.status === 'online' ? 'Você está online.' : 'Você está offline.', profile.status==='online'?'success':'');
});

// ════════════════════════════════
// MODAL DE EDIÇÃO GENÉRICO
// ════════════════════════════════
const editModal   = document.getElementById('editModal');
const modalTitle  = document.getElementById('modalTitle');
const modalBody   = document.getElementById('modalBody');
const modalSave   = document.getElementById('modalSave');
const modalCancel = document.getElementById('modalCancel');
const modalClose  = document.getElementById('modalClose');

let currentEditTarget = null;

const FIELDS_CONFIG = {
  profileName: {
    title: 'Editar nome',
    html: (val)=>`<label>Nome completo</label><input type="text" id="me_input" maxlength="60" value="${esc(val)}" placeholder="Seu nome completo">`,
    get: ()=> document.getElementById('me_input').value.trim(),
    key: 'nome'
  },
  profileLocation: {
    title: 'Editar localização',
    html: (val)=>`<label>Bairro, Cidade – UF</label><input type="text" id="me_input" maxlength="80" value="${esc(val)}" placeholder="Ex: Pajuçara, Maceió – AL">`,
    get: ()=> document.getElementById('me_input').value.trim(),
    key: 'location'
  },
  profileInstagram: {
    title: 'Editar Instagram',
    html: (val)=>`<label>Instagram (sem o @)</label><input type="text" id="me_input" maxlength="40" value="${esc(val.replace(/^@/,''))}" placeholder="seu_usuario">`,
    get: ()=> document.getElementById('me_input').value.trim().replace(/^@/,''),
    key: 'instagram',
    format: v => v ? '@'+v : ''
  },
  bioText: {
    title: 'Editar bio',
    html: (val)=>`<label>Bio curta</label><textarea id="me_input" maxlength="200" placeholder="Fale um pouco sobre você...">${esc(val)}</textarea><div class="char-info"><span id="ccount">${val.length}</span>/200</div>`,
    get: ()=> document.getElementById('me_input').value.trim(),
    key: 'bio',
    onInput: ()=>{
      const el=document.getElementById('me_input');
      const cc=document.getElementById('ccount');
      if(el&&cc){ el.addEventListener('input',()=>{ cc.textContent=el.value.length; cc.style.color=el.value.length>180?'var(--wine)':'var(--text-light)'; }); }
    }
  },
  contactPhone: {
    title: 'Editar telefone',
    html: (val)=>`<label>Telefone</label><input type="tel" id="me_input" maxlength="16" value="${esc(val)}" placeholder="(00) 00000-0000">`,
    get: ()=> document.getElementById('me_input').value.trim(),
    key: 'phone'
  }
};

function esc(str){ return (str||'').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function openEditModal(targetId){
  const cfg = FIELDS_CONFIG[targetId];
  if(!cfg) return;
  currentEditTarget = targetId;
  const currentVal = profile[cfg.key] || '';
  modalTitle.textContent = cfg.title;
  modalBody.innerHTML    = cfg.html(currentVal);
  editModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if(cfg.onInput) cfg.onInput();
  const inp = document.getElementById('me_input');
  if(inp){ setTimeout(()=>{ inp.focus(); inp.selectionStart=inp.selectionEnd=inp.value.length; }, 80); }
}

function closeEditModal(){
  editModal.classList.add('hidden');
  document.body.style.overflow = '';
  currentEditTarget = null;
}

modalClose.addEventListener('click',  closeEditModal);
modalCancel.addEventListener('click', closeEditModal);
editModal.addEventListener('click', e=>{ if(e.target===editModal) closeEditModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeEditModal(); });

modalSave.addEventListener('click', ()=>{
  if(!currentEditTarget) return;
  const cfg = FIELDS_CONFIG[currentEditTarget];
  const val = cfg.get();
  profile[cfg.key] = val;
  saveProfile(profile);
  renderAll();
  showSaveBtn();
  closeEditModal();
  toast('Salvo com sucesso! ✓','success');
});

// Delegação: botões inline-edit abrem o modal
document.querySelectorAll('.inline-edit-btn[data-target]').forEach(btn=>{
  btn.addEventListener('click', ()=> openEditModal(btn.dataset.target));
});

// ════════════════════════════════
// HORÁRIOS
// ════════════════════════════════
const editScheduleBtn  = document.getElementById('editScheduleBtn');
const scheduleView     = document.getElementById('scheduleView');
const scheduleEdit     = document.getElementById('scheduleEdit');
const saveScheduleBtn  = document.getElementById('saveScheduleBtn');
const cancelScheduleBtn= document.getElementById('cancelScheduleBtn');

editScheduleBtn.addEventListener('click',()=>{
  scheduleEdit.classList.toggle('hidden');
  // Preenche checkboxes com dados salvos
  scheduleEdit.querySelectorAll('.sched-days input').forEach(cb=>{
    cb.checked = profile.schedule.dias.includes(cb.value);
  });
  scheduleEdit.querySelectorAll('.sched-period input').forEach(cb=>{
    cb.checked = profile.schedule.periodos.includes(cb.value);
  });
});

saveScheduleBtn.addEventListener('click',()=>{
  profile.schedule.dias     = [...scheduleEdit.querySelectorAll('.sched-days input:checked')].map(cb=>cb.value);
  profile.schedule.periodos = [...scheduleEdit.querySelectorAll('.sched-period input:checked')].map(cb=>cb.value);
  saveProfile(profile);
  renderScheduleView();
  scheduleEdit.classList.add('hidden');
  showSaveBtn();
  toast('Horários salvos! ✓','success');
});

cancelScheduleBtn.addEventListener('click',()=> scheduleEdit.classList.add('hidden'));

// ════════════════════════════════
// TRAJETOS
// ════════════════════════════════
const addRouteBtn    = document.getElementById('addRouteBtn');
const routeForm      = document.getElementById('routeForm');
const saveRouteBtn   = document.getElementById('saveRouteBtn');
const cancelRouteBtn = document.getElementById('cancelRouteBtn');

addRouteBtn.addEventListener('click', ()=>{
  routeForm.classList.toggle('hidden');
  if(!routeForm.classList.contains('hidden')) document.getElementById('routeFrom').focus();
});

saveRouteBtn.addEventListener('click',()=>{
  const from = document.getElementById('routeFrom').value.trim();
  const to   = document.getElementById('routeTo').value.trim();
  const freq = document.getElementById('routeFreq').value;
  if(!from || !to){ toast('Preencha origem e destino.','error'); return; }
  profile.routes.push({ from, to, freq: freq||'—' });
  saveProfile(profile);
  renderRoutes();
  document.getElementById('routeFrom').value = '';
  document.getElementById('routeTo').value   = '';
  document.getElementById('routeFreq').value = '';
  routeForm.classList.add('hidden');
  showSaveBtn();
  toast('Trajeto adicionado! ✓','success');
});

cancelRouteBtn.addEventListener('click',()=>{
  routeForm.classList.add('hidden');
  document.getElementById('routeFrom').value=''; document.getElementById('routeTo').value=''; document.getElementById('routeFreq').value='';
});

// ════════════════════════════════
// BOTÃO SALVAR NO HEADER
// ════════════════════════════════
function showSaveBtn(){
  document.getElementById('btnSaveHeader').classList.remove('hidden');
}

document.getElementById('btnSaveHeader').addEventListener('click',()=>{
  saveProfile(profile);
  toast('Perfil salvo! 🎉','success');
  // Aqui você pode chamar o backend:
  // fetch('http://localhost:3000/perfil', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(profile) });
});

// ════════════════════════════════
// INICIALIZAÇÃO
// ════════════════════════════════
renderAll();

console.log('%cRota Alternativa — Perfil','font-size:16px;font-weight:bold;color:#7a1c1c;');
console.log('Perfil carregado para:', profile.nome || '(novo usuário)');