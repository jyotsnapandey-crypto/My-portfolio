/* =====================================================
   Jyotsna Pandey — Portfolio Scripts
   ===================================================== */

/* ── Custom Cursor ── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
  ring.style.left   = e.clientX + 'px'; ring.style.top   = e.clientY + 'px';
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width='18px'; cursor.style.height='18px';
    ring.style.width='46px';  ring.style.height='46px'; ring.style.opacity='0.7';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width='9px'; cursor.style.height='9px';
    ring.style.width='34px'; ring.style.height='34px'; ring.style.opacity='0.4';
  });
});

/* ══════════════════════════════════════════
   ELEGANT BACKGROUND CANVAS
   Soft orbs · Subtle particles · Thin lines
   ══════════════════════════════════════════ */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;
const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
resize(); window.addEventListener('resize', resize);

/* Muted, professional colour palette */
const PALETTE = [
  'rgba(157,92,122,',    // mauve
  'rgba(122,111,160,',   // slate violet
  'rgba(200,170,185,',   // dusty rose
  'rgba(180,165,200,',   // soft lavender
];

/* Soft background orbs — very subtle */
const orbs = Array.from({ length: 5 }, (_, i) => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: 160 + Math.random() * 220,
  dx: (Math.random() - 0.5) * 0.18,
  dy: (Math.random() - 0.5) * 0.18,
  col: PALETTE[i % PALETTE.length],
  a: 0.035 + Math.random() * 0.04,
}));

/* Small floating dots */
const dots = Array.from({ length: 45 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: 0.8 + Math.random() * 1.8,
  dx: (Math.random() - 0.5) * 0.28,
  dy: -0.12 - Math.random() * 0.28,
  col: PALETTE[Math.floor(Math.random() * PALETTE.length)],
  a: 0.15 + Math.random() * 0.45,
  aDir: Math.random() > 0.5 ? 1 : -1,
  aSpeed: 0.003 + Math.random() * 0.007,
}));

/* Small diamond / rhombus accents */
const diamonds = Array.from({ length: 10 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  size: 3 + Math.random() * 5,
  rot: Math.random() * Math.PI,
  rotSpeed: (Math.random() - 0.5) * 0.008,
  dx: (Math.random() - 0.5) * 0.2,
  dy: -0.1 - Math.random() * 0.2,
  col: PALETTE[Math.floor(Math.random() * PALETTE.length)],
  a: 0.12 + Math.random() * 0.2,
}));

function drawDiamond(x, y, size, rot, col, a) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, -size); ctx.lineTo(size * 0.6, 0);
  ctx.lineTo(0, size);  ctx.lineTo(-size * 0.6, 0);
  ctx.closePath();
  ctx.fillStyle = col + a + ')';
  ctx.fill();
  ctx.restore();
}

/* Thin connecting lines between nearby dots */
function drawConnections() {
  ctx.lineWidth = 0.5;
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const d = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
      if (d < 110) {
        ctx.globalAlpha = (1 - d / 110) * 0.06;
        ctx.strokeStyle = 'rgba(157,92,122,1)';
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
}

function animate() {
  ctx.clearRect(0, 0, W, H);

  /* 1 — orbs */
  orbs.forEach(o => {
    o.x += o.dx; o.y += o.dy;
    if (o.x < -o.r || o.x > W + o.r) o.dx *= -1;
    if (o.y < -o.r || o.y > H + o.r) o.dy *= -1;
    const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    g.addColorStop(0, o.col + o.a + ')');
    g.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
  });

  /* 2 — connections */
  drawConnections();

  /* 3 — dots */
  dots.forEach(d => {
    d.a += d.aDir * d.aSpeed;
    if (d.a > 0.65 || d.a < 0.08) d.aDir *= -1;
    d.x += d.dx; d.y += d.dy;
    if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; }
    if (d.x < 0 || d.x > W) d.dx *= -1;
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = d.col + d.a + ')'; ctx.fill();
  });

  /* 4 — diamonds */
  diamonds.forEach(d => {
    d.x += d.dx; d.y += d.dy; d.rot += d.rotSpeed;
    if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
    if (d.x < 0 || d.x > W) d.dx *= -1;
    drawDiamond(d.x, d.y, d.size, d.rot, d.col, d.a);
  });

  requestAnimationFrame(animate);
}
animate();

/* ── Scroll Reveal ── */
const reveals  = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

/* ── Toast ── */
function showToast(msg, duration = 2800) {
  const t = document.getElementById('dl-toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* ── Resume Download ── */
function downloadResume() {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>Jyotsna Pandey — Resume</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'DM Sans',sans-serif;font-weight:300;color:#2a1f28;background:#fff;padding:3rem 4rem;max-width:800px;margin:0 auto;font-size:0.92rem;line-height:1.65;}
  header{border-bottom:2px solid #9d5c7a;padding-bottom:1.4rem;margin-bottom:1.8rem;}
  h1{font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:600;line-height:1;}
  h1 em{font-style:italic;color:#9d5c7a;}
  .tagline{color:#7a6272;margin-top:0.4rem;font-size:0.88rem;}
  .contact-bar{display:flex;gap:1.8rem;margin-top:0.9rem;font-size:0.78rem;color:#7a6272;flex-wrap:wrap;}
  h2{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600;color:#9d5c7a;margin:1.6rem 0 0.7rem;border-left:2px solid #9d5c7a;padding-left:0.7rem;}
  .job{margin-bottom:1.1rem;}
  .job-header{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:0.5rem;}
  .job-title{font-weight:700;color:#2a1f28;}
  .job-co{color:#9d5c7a;font-size:0.84rem;}
  .job-date{font-size:0.78rem;color:#7a6272;}
  ul{padding-left:1.1rem;margin-top:0.35rem;}
  li{margin-bottom:0.28rem;color:#4a3540;}
  .sg{display:grid;grid-template-columns:repeat(3,1fr);gap:0.7rem 2rem;margin-top:0.4rem;}
  .sg-label{font-weight:700;font-size:0.76rem;color:#2a1f28;text-transform:uppercase;margin-bottom:0.25rem;}
  .sg-val{font-size:0.8rem;color:#7a6272;}
  .edu{display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;}
  .edu-t{font-weight:700;color:#2a1f28;} .edu-s{color:#7a6272;font-size:0.84rem;}
  footer{margin-top:2.5rem;padding-top:0.9rem;border-top:1px solid #e8dce4;text-align:center;font-size:0.72rem;color:#a08898;}
</style></head><body>
<header>
  <h1>Jyotsna <em>Pandey</em></h1>
  <p class="tagline">Full Stack Developer &amp; UI/UX Designer</p>
  <div class="contact-bar">
    <span>✉ jyotsna@email.com</span>
    <span>💼 linkedin.com/in/jyotsnapandey</span>
    <span>⌥ github.com/jyotsnapandey</span>
    <span>📍 India</span>
  </div>
</header>
<h2>Profile</h2>
<p>Passionate full-stack developer and designer with 2+ years of experience building elegant, performant digital products. Strong focus on clean code, thoughtful UI/UX, and delivering measurable results.</p>
<h2>Experience</h2>
<div class="job">
  <div class="job-header">
    <span class="job-title">Frontend Developer <span class="job-co">— TechCorp Solutions</span></span>
    <span class="job-date">2023 – Present</span>
  </div>
  <ul><li>Built and maintained React applications serving 50,000+ monthly users</li><li>Improved load performance by 40% through code-splitting and optimization</li></ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-title">UI/UX Developer <span class="job-co">— Freelance</span></span>
    <span class="job-date">2022 – 2023</span>
  </div>
  <ul><li>Designed and developed 10+ client websites with high satisfaction rates</li><li>Created wireframes, prototypes, and design systems in Figma</li></ul>
</div>
<h2>Skills</h2>
<div class="sg">
  <div><div class="sg-label">Frontend</div><div class="sg-val">React, Next.js, Vue.js, HTML5, CSS3, JS</div></div>
  <div><div class="sg-label">Backend</div><div class="sg-val">Node.js, Python, REST APIs, GraphQL</div></div>
  <div><div class="sg-label">Design</div><div class="sg-val">Figma, Adobe XD, Prototyping</div></div>
  <div><div class="sg-label">Database</div><div class="sg-val">MongoDB, PostgreSQL, Firebase</div></div>
  <div><div class="sg-label">Cloud</div><div class="sg-val">AWS, Docker, Git, CI/CD</div></div>
  <div><div class="sg-label">Mobile</div><div class="sg-val">React Native, Flutter</div></div>
</div>
<h2>Education</h2>
<div class="edu">
  <div><div class="edu-t">B.Tech — Computer Science</div><div class="edu-s">University Name, India</div></div>
  <div style="text-align:right"><div class="edu-s">2019 – 2023</div><div style="color:#9d5c7a;font-size:0.8rem">CGPA: 8.5 / 10</div></div>
</div>
<footer>Jyotsna Pandey · Full Stack Developer &amp; UI/UX Designer · jyotsna@email.com</footer>
</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'Jyotsna_Pandey_Resume.html'; a.click();
  URL.revokeObjectURL(url);
  showToast('✦ Resume downloaded!');
}

/* ══════════════════════
   PROJECT EDITOR
   ══════════════════════ */
let projectData = [
  { title:'E-Commerce Platform',  desc:'A full-stack e-commerce solution with real-time inventory, secure payments, and an elegant shopping experience.', tags:['React','Node.js','MongoDB'],    live:'', github:'' },
  { title:'AI Task Manager',      desc:'A smart productivity application that uses AI to prioritize tasks, predict deadlines, and provide intelligent suggestions.', tags:['Next.js','Python','OpenAI'],    live:'', github:'' },
  { title:'Healthcare Dashboard', desc:'An interactive analytics dashboard for healthcare providers featuring real-time patient data visualization.', tags:['Vue.js','D3.js','PostgreSQL'],  live:'', github:'' },
  { title:'Social Learning App',  desc:'A collaborative learning platform connecting students and mentors, featuring live sessions and gamified progress tracking.', tags:['React Native','Firebase','WebRTC'], live:'', github:'' },
];
let editingIndex = -1, editTags = [];

const ICON_EDIT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const ICON_DEL  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
const ICON_LIVE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const ICON_GH   = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.4.6.1.82-.26.82-.57v-2c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.06 1.82 2.78 1.3 3.46.99.1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.68.83.57C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/></svg>`;

function renderProjects() {
  const list = document.getElementById('projects-list');
  list.innerHTML = '';
  projectData.forEach((p, i) => {
    const num    = String(i + 1).padStart(2, '0');
    const badges = p.tags.map(t => `<span class="tech-badge">${t}</span>`).join('');
    const liveBtn = p.live   ? `<a href="${p.live}"   target="_blank" class="proj-link-btn live">${ICON_LIVE} Live Demo</a>`  : '';
    const ghBtn   = p.github ? `<a href="${p.github}" target="_blank" class="proj-link-btn github">${ICON_GH} GitHub</a>` : '';
    const addBtn  = `<button class="proj-link-btn edit-btn" onclick="openModal(${i})">${ICON_EDIT} ${(p.live||p.github)?'Edit Links':'Add Links'}</button>`;
    list.insertAdjacentHTML('beforeend', `
      <div class="project-card reveal visible" data-id="${i}">
        <div class="card-actions">
          <button class="card-action-btn" onclick="openEditModal(${i})">${ICON_EDIT}</button>
          <button class="card-action-btn del" onclick="deleteProject(${i})">${ICON_DEL}</button>
        </div>
        <div class="project-num">${num}</div>
        <div class="project-info">
          <div class="project-title">${p.title}</div>
          <div class="project-desc">${p.desc}</div>
          <div class="project-links">${liveBtn}${ghBtn}${addBtn}</div>
        </div>
        <div class="project-tech">${badges}</div>
      </div>`);
  });
}

function toggleEditMode() {
  const btn = document.getElementById('edit-mode-toggle');
  const add = document.getElementById('add-proj-btn');
  const on  = document.body.classList.toggle('editing');
  btn.classList.toggle('active', on);
  btn.innerHTML = on ? `${ICON_EDIT} Done Editing` : `${ICON_EDIT} Edit Projects`;
  add.classList.toggle('visible', on);
}

function deleteProject(idx) {
  if (!confirm(`Delete "${projectData[idx].title}"?`)) return;
  projectData.splice(idx, 1); renderProjects(); showToast('✦ Project deleted');
}

function openEditModal(idx) {
  editingIndex = idx;
  const isNew = idx === -1;
  const p = isNew ? { title:'', desc:'', tags:[], live:'', github:'' } : projectData[idx];
  editTags = [...(p.tags||[])];
  document.getElementById('edit-modal-title').textContent = isNew ? 'New Project' : 'Edit Project';
  document.getElementById('edit-proj-title').value = p.title;
  document.getElementById('edit-proj-desc').value  = p.desc;
  document.getElementById('edit-proj-live').value  = p.live   || '';
  document.getElementById('edit-proj-gh').value    = p.github || '';
  renderTagChips();
  document.getElementById('edit-modal').classList.add('open');
}
function closeEditModal() { document.getElementById('edit-modal').classList.remove('open'); }
function renderTagChips() {
  document.getElementById('edit-tags-row').innerHTML = editTags.map((t,i) =>
    `<span class="modal-tag-chip">${t}<button onclick="removeTag(${i})">✕</button></span>`).join('');
}
function removeTag(i) { editTags.splice(i,1); renderTagChips(); }
function addTag() {
  const inp = document.getElementById('new-tag-input');
  if (!inp.value.trim()) return;
  editTags.push(inp.value.trim()); inp.value=''; renderTagChips();
}
function saveEditModal() {
  const title = document.getElementById('edit-proj-title').value.trim();
  if (!title) { alert('Project title is required.'); return; }
  const updated = {
    title, desc: document.getElementById('edit-proj-desc').value.trim(),
    tags: [...editTags],
    live:   document.getElementById('edit-proj-live').value.trim(),
    github: document.getElementById('edit-proj-gh').value.trim(),
  };
  if (editingIndex === -1) projectData.push(updated); else projectData[editingIndex] = updated;
  renderProjects(); closeEditModal();
  showToast(editingIndex === -1 ? '✦ Project added!' : '✦ Project updated!');
}

let _modalIdx = 0;
function openModal(idx) {
  _modalIdx = idx;
  const p = projectData[idx];
  document.getElementById('modal-project-name').textContent = p.title;
  document.getElementById('modal-live-input').value = p.live   || '';
  document.getElementById('modal-gh-input').value   = p.github || '';
  document.getElementById('link-modal').classList.add('open');
}
function closeModal() { document.getElementById('link-modal').classList.remove('open'); }
function saveLinks() {
  projectData[_modalIdx].live   = document.getElementById('modal-live-input').value.trim();
  projectData[_modalIdx].github = document.getElementById('modal-gh-input').value.trim();
  renderProjects(); closeModal(); showToast('✦ Links saved!');
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  document.getElementById('new-tag-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(); }
  });
  document.getElementById('edit-modal').addEventListener('click', function(e) { if (e.target===this) closeEditModal(); });
  document.getElementById('link-modal').addEventListener('click', function(e) { if (e.target===this) closeModal(); });
});
