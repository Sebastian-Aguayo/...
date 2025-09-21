// Utilidades de URL
function getParams(){
  const p = new URLSearchParams(location.search);
  return {
    para: p.get('para') || 'Para ti, con cariño',
    mensaje: p.get('mensaje') || 'Nunca habias visto unas flores asi eh? 💛',
  };
}

// Dedicatoria dinámica
const ded = document.getElementById('dedicatoria');
const { para, mensaje } = getParams();
ded.textContent = `${para} — ${mensaje}`;

// Botón de música: reproduce el <audio> oculto con fade-in tras el gesto
const audio = document.getElementById('musica');
document.getElementById('btnAudio').addEventListener('click', async ()=>{
  try{
    // Preparar fade-in suave
    audio.volume = 0;
    await audio.play(); // permitido por política al ser gesto del usuario
    let v = 0;
    const id = setInterval(()=>{
      v = Math.min(1, v + 0.05);
      audio.volume = v;
      if(v >= 1) clearInterval(id);
    }, 100);
  }catch(e){
    console.warn('No se pudo reproducir:', e);
    // Tip: algunos navegadores requieren otra interacción si falló la primera
  }
});

// Guardar como imagen
document.getElementById('btnGuardar').addEventListener('click', async ()=>{
  const node = document.querySelector('.card');
  const canvas = await html2canvas(node, {backgroundColor: null, scale:2});
  const a = document.createElement('a');
  a.download = 'flores-amarillas.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
});

// Flor amarilla SVG
function crearFlorSVG(x, y, scale=1){
  const svgNS = 'http://www.w3.org/2000/svg';
  const wrap = document.createElement('div');
  wrap.className = 'flor';
  wrap.style.left = (x-48)+'px';
  wrap.style.top = (y-48)+'px';
  wrap.style.transform = `scale(${scale})`;

  const svg = document.createElementNS(svgNS,'svg');
  svg.setAttribute('viewBox','0 0 100 100');
  svg.setAttribute('width','100');
  svg.setAttribute('height','100');

  for(let i=0;i<12;i++){
    const petalo = document.createElementNS(svgNS,'ellipse');
    petalo.setAttribute('cx','50');
    petalo.setAttribute('cy','35');
    petalo.setAttribute('rx','12');
    petalo.setAttribute('ry','28');
    petalo.setAttribute('fill','url(#gradPetalo)');
    petalo.setAttribute('transform',`rotate(${i*30} 50 50) translate(0,6)`);
    svg.appendChild(petalo);
  }

  const centro = document.createElementNS(svgNS,'circle');
  centro.setAttribute('cx','50');
  centro.setAttribute('cy','50');
  centro.setAttribute('r','16');
  centro.setAttribute('fill','url(#gradCentro)');
  svg.appendChild(centro);

  const brillo = document.createElementNS(svgNS,'circle');
  brillo.setAttribute('cx','44');
  brillo.setAttribute('cy','44');
  brillo.setAttribute('r','5');
  brillo.setAttribute('fill','rgba(255,255,255,.55)');
  svg.appendChild(brillo);

  const defs = document.createElementNS(svgNS,'defs');
  const gp = document.createElementNS(svgNS,'radialGradient');
  gp.setAttribute('id','gradPetalo');
  gp.innerHTML = `
    <stop offset="0%" stop-color="#FFF59D"/>
    <stop offset="55%" stop-color="#FFD54F"/>
    <stop offset="100%" stop-color="#FFC107"/>
  `;
  const gc = document.createElementNS(svgNS,'radialGradient');
  gc.setAttribute('id','gradCentro');
  gc.innerHTML = `
    <stop offset="0%" stop-color="#FFE082"/>
    <stop offset="70%" stop-color="#FFB300"/>
    <stop offset="100%" stop-color="#F57F17"/>
  `;
  defs.appendChild(gp); defs.appendChild(gc);
  svg.appendChild(defs);
  wrap.appendChild(svg);

  wrap.style.animationDelay = (Math.random()*2)+'s';
  return wrap;
}

const florero = document.getElementById('florero');
function crearFlorAleatoria(){
  const rect = florero.getBoundingClientRect();
  const x = Math.random() * (rect.width - 96) + 48;
  const y = Math.random() * (rect.height - 96) + 48;
  const s = 0.8 + Math.random()*0.6;
  const flor = crearFlorSVG(x, y, s);
  florero.appendChild(flor);
}
document.getElementById('crearFlor').addEventListener('click', crearFlorAleatoria);
florero.addEventListener('click', (e)=>{
  const r = florero.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const s = 0.7 + Math.random()*0.9;
  const flor = crearFlorSVG(x, y, s);
  florero.appendChild(flor);
});

// Pétalos en canvas
const canvas = document.getElementById('petalos');
const ctx = canvas.getContext('2d');
let W, H, petalos = [];

function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
addEventListener('resize', resize); resize();

function crearPetalo(){
  return {
    x: Math.random()*W, y: -20,
    r: 8 + Math.random()*10,
    vy: 0.6 + Math.random()*1.2,
    vx: -0.4 + Math.random()*0.8,
    rot: Math.random()*Math.PI*2,
    vr: -0.01 + Math.random()*0.02,
    color: ['#FFF59D','#FFE082','#FFD54F','#FFC107'][Math.floor(Math.random()*4)]
  };
}
for(let i=0;i<60;i++) petalos.push(crearPetalo());

function loop(){
  ctx.clearRect(0,0,W,H);
  for(const p of petalos){
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    if(p.y > H + 30){ p.x = Math.random()*W; p.y = -20; }
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    const g = ctx.createLinearGradient(0, -p.r, 0, p.r);
    g.addColorStop(0, '#fffde7'); g.addColorStop(0.6, p.color); g.addColorStop(1, '#fbc02d');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -p.r);
    ctx.quadraticCurveTo(p.r, 0, 0, p.r);
    ctx.quadraticCurveTo(-p.r, 0, 0, -p.r);
    ctx.fill();
    ctx.restore();
  }
  requestAnimationFrame(loop);
}
loop();

// Rutas de postales
const POSTALES = ["Melodi 1.jpg","Melodi 2.jpg"]; // en la misma carpeta

// Modal
const modal = document.getElementById('modalPostales');
const imgEl = document.getElementById('postalImg');
let idx = 0;

function abrirModal(i=0){
  idx = (i+POSTALES.length)%POSTALES.length;
  imgEl.src = POSTALES[idx];
  modal.hidden = false;
}
function cerrarModal(){ modal.hidden = true; }

document.getElementById('btnPostales').addEventListener('click', ()=> abrirModal(idx));
document.getElementById('prevImg').addEventListener('click', ()=> abrirModal(idx-1));
document.getElementById('nextImg').addEventListener('click', ()=> abrirModal(idx+1));
document.getElementById('closeModal').addEventListener('click', cerrarModal);
document.getElementById('xModal').addEventListener('click', cerrarModal);
addEventListener('keydown', (e)=>{ if(!modal.hidden && e.key==='Escape') cerrarModal(); });

// Postal flotante ocasional dentro del florero
function soltarPostalAleatoria(){
  const r = florero.getBoundingClientRect();
  const img = document.createElement('img');
  const pick = Math.floor(Math.random()*POSTALES.length);
  img.src = POSTALES[pick];
  img.className = 'postal';
  img.style.left = Math.random()*(r.width-160) + 'px';
  img.style.top = '-120px';
  img.addEventListener('click', ()=> abrirModal(pick));
  florero.appendChild(img);
  // limpiar tras la animación
  setTimeout(()=> img.remove(), 13000);
}
// lanzar una postal cada ~25–35 s
setInterval(soltarPostalAleatoria, 25000 + Math.random()*10000);
