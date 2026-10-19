// =====================================================
//  EXPEDIENTE: Laura Jiménez R.  ·  versión matriz
//  adentro afuera · Interludio: Martes
// =====================================================
//  CONTROLES
//  Espacio / →  agregar la siguiente fila (también clic)
//  ←            quitar la última fila
//  A            automático (una fila cada 3 s)
//  C            cámara: marcador · magenta (chroma) · vacío
//  R            reiniciar
//  F            pantalla completa
// =====================================================

// ---------- 1. EDITA AQUÍ TU EXPEDIENTE ----------
// Cada fila: [código, serie / asunto, fechas, observaciones]
// La ÚLTIMA fila es la vacía: al aparecer, la lluvia se detiene.
const ROWS = [
  ['LJR-01', 'Identidad · Nombre de uso: Laura D. Jiménez R.', '—', 'Dicho por ella'],
  ['LJR-02', 'Formación · Historia, énfasis en Museología y Patrimonio', '2018', 'Dicho por ella'],
  ['LJR-03', 'Formación · Maestría en Patrimonio Cultural Mueble', '2018–2023', 'Dicho por ella'],
  ['LJR-04', 'Formación · Maestría en Humanidades Digitales', '2026 – abierta', 'Expediente abierto'],
  ['LJR-05', 'Oficio · Gestión y patrimonio documental', '[FECHAS]', 'Dicho por ella'],
  ['LJR-06', 'Lugar · Bogotá', '—', 'Dicho por ella'],
  ['LJR-07', 'Proyectos · [EDITAR VERSIÓN PÚBLICA]', '2026', 'Dicho por ella'],
  ['LJR-08', 'Lo que no le he dicho', '—', 'Sin registro']
];

const HEADER = [
  ['Entidad productora', 'La herramienta'],
  ['Oficina', 'Conversaciones'],
  ['Objeto', 'Transferencia de una identidad']
];

const TITULO   = 'Adentro-afuera.- Interludio: Martes · Disponibilidad · 17:52';
const QUOTE_A  = '"Llevo años decidiendo qué se conserva de otros.';
const QUOTE_B  = 'Hoy alguien hizo el inventario de mí."';
const MARQUEE  = '¿esta soy yo? · ¿quién custodia este fondo? · ¿quién decide qué se conserva? · ';

// ---------- 2. RITMO ----------
const SPEED      = 0.05;  // letras por milisegundo al escribir las filas
const AUTO_MS    = 3000;  // milisegundos entre filas en modo automático
const RAIN_SPEED = 0.5;   // velocidad de la lluvia (0.2 lenta · 1 rápida)

// ---------- No hace falta tocar nada de aquí para abajo ----------
const W = 1920, H = 1080, FS = 24;
const G = {
  bright: '#33FF77', mid: '#1FC25A', dim: '#0E7A36', faint: '#073D1C',
  white: '#E6FFEC', black: '#000000'
};
const FONT = 'IBM Plex Mono';

let rain, cols = [], pool = '';
let rainLevel = 1, rainTarget = 1;
let starts = [], headerStart = 0;
let auto = false, lastAuto = 0;
let camMode = 0, marqueeX = 0, scaleF = 1;

function setup() {
  const cnv = createCanvas(10, 10);
  cnv.mousePressed(nextRow);
  fitCanvas();

  rain = createGraphics(W, H);
  rain.pixelDensity(1);
  rain.background(0);
  rain.textFont(FONT);
  rain.textSize(FS);
  rain.textAlign(CENTER, TOP);
  rain.noStroke();

  pool = (ROWS.flat().join('') + HEADER.flat().join('') + '0123456789§№LJR').replace(/\s/g, '');
  for (let i = 0; i < Math.ceil(W / FS); i++) {
    cols.push({ x: i * FS + FS / 2, y: -FS * floor(random(0, 45)), v: random(0.35, 1), ch: randChar() });
  }
  headerStart = millis();
}

function fitCanvas() {
  scaleF = Math.min(windowWidth / W, windowHeight / H);
  resizeCanvas(Math.floor(W * scaleF), Math.floor(H * scaleF));
}
function windowResized() { fitCanvas(); }

function randChar() { return pool.charAt(floor(random(pool.length))) || '0'; }
function typed(str, chars) { return str.slice(0, Math.max(0, Math.min(str.length, chars))); }

function nextRow() {
  if (starts.length < ROWS.length) { starts.push(millis()); lastAuto = millis(); }
}
function prevRow() { starts.pop(); rainTarget = 1; }
function resetAll() {
  starts = []; headerStart = millis(); auto = false; marqueeX = 0;
  rainTarget = 1; rainLevel = 1;
}

// ---------- Lluvia ----------
function rainStep() {
  rainLevel = lerp(rainLevel, rainTarget, 0.03);
  rain.fill(0, 0, 0, 30);
  rain.rect(0, 0, W, H);
  if (rainLevel < 0.03) return;
  for (const c of cols) {
    c.acc = (c.acc || 0) + c.v * RAIN_SPEED * rainLevel;
    if (c.acc < 1) continue;
    c.acc -= 1;
    rain.fill(G.mid);
    rain.text(c.ch, c.x, c.y);
    c.y += FS;
    c.ch = randChar();
    rain.fill(G.white);
    rain.text(c.ch, c.x, c.y);
    if (c.y > H && random() < 0.08) c.y = -FS * floor(random(1, 25));
  }
}

// ---------- Dibujo ----------
function draw() {
  if (auto && millis() - lastAuto > AUTO_MS) nextRow();
  if (auto && starts.length >= ROWS.length) auto = false;

  const complete = starts.length === ROWS.length;
  const lastIdx = ROWS.length - 1;
  const lastDone = complete && (millis() - starts[lastIdx]) * SPEED > ROWS[lastIdx].join('').length + 2;
  if (lastDone) rainTarget = 0;

  rainStep();

  scale(scaleF);
  background(0);
  image(rain, 0, 0);
  noStroke();

  // Panel del inventario
  fill(0, 0, 0, 215); rect(48, 48, 1400, 904);
  noFill(); stroke(G.dim); strokeWeight(2); rect(48, 48, 1400, 904); noStroke();

  textFont(FONT); textStyle(NORMAL); textAlign(LEFT, BASELINE);
  fill(G.dim); textSize(16); text(TITULO, 80, 84);
  fill(G.mid); textSize(18); text('> FORMATO_ÚNICO_DE_INVENTARIO_DOCUMENTAL', 80, 114);

  fill(G.bright); textSize(60); textStyle(BOLD);
  drawingContext.shadowColor = G.bright; drawingContext.shadowBlur = 18;
  text('EXPEDIENTE: LALA', 76, 186);
  drawingContext.shadowBlur = 0; textStyle(NORMAL);

  // Encabezado que se escribe solo
  let budget = (millis() - headerStart) * SPEED;
  textSize(17);
  HEADER.forEach(([k, v], i) => {
    const y = 104 + i * 28;
    fill(G.dim); text(typed(k, budget), 900, y); budget -= k.length;
    fill(G.mid); text(typed(v, budget), 1110, y); budget -= v.length;
  });
  stroke(G.dim); strokeWeight(1); line(80, 212, 1416, 212); noStroke();

  // Encabezado de la tabla
  const X = [80, 150, 300, 920, 1130], WD = [70, 150, 610, 200, 286];
  fill(G.bright); textSize(15); textAlign(LEFT, CENTER);
  ['Nº', 'CÓDIGO', 'SERIE / ASUNTO', 'FECHAS', 'OBSERVACIONES'].forEach((h, i) => text(h, X[i], 250));
  stroke(G.bright); line(80, 270, 1416, 270); noStroke();

  // Filas
  const y0 = 282, RH = 72;
  let cursorPos = null;
  for (let i = 0; i < starts.length; i++) {
    const r = ROWS[i];
    const last = i === lastIdx;
    const age = millis() - starts[i];
    const k = constrain(age / 700, 0, 1);
    if (k < 1) { fill(51, 255, 119, 90 * (1 - k)); rect(80, y0 + i * RH, 1336, RH); }
    stroke(G.faint); line(80, y0 + (i + 1) * RH, 1416, y0 + (i + 1) * RH); noStroke();

    const cells = [String(i + 1).padStart(2, '0'), r[0] || '', r[1] || '', r[2] || '', r[3] || ''];
    let chars = age * SPEED;
    cells.forEach((c, ci) => {
      textSize(ci === 2 ? 21 : 19); textAlign(LEFT, TOP); textLeading(27);
      fill(last ? G.white : G.bright);
      const shown = typed(c, chars);
      text(shown, X[ci], y0 + i * RH + 14, WD[ci] - 16, RH - 14);
      if (chars > 0 && chars < c.length) {
        cursorPos = { x: X[ci] + Math.min(textWidth(shown), WD[ci] - 18), y: y0 + i * RH + 14 };
      }
      chars -= c.length;
    });
  }
  if (cursorPos && frameCount % 40 < 24) { fill(G.bright); rect(cursorPos.x + 2, cursorPos.y + 2, 11, 22); }
  if (lastDone && frameCount % 60 < 30) { fill(G.white); rect(1400, y0 + lastIdx * RH + 22, 11, 22); }

  // Estado
  textSize(16); textAlign(LEFT, BASELINE); fill(G.mid);
  const estado = !starts.length ? '> esperando transferencia_'
    : lastDone ? '> transferencia completa. 1 registro sin contenido.'
    : '> transfiriendo registros…';
  text(estado, 80, 930);
  textAlign(RIGHT, BASELINE); fill(G.dim);
  text('folios: ' + starts.length + ' / ' + ROWS.length, 1416, 930);

  // Cámara
  if (camMode === 0) {
    fill(0, 0, 0, 215); rect(1480, 48, 392, 300);
    noFill(); stroke(G.dim); strokeWeight(2); rect(1480, 48, 392, 300); noStroke();
    fill(G.mid); textSize(17); textAlign(CENTER, CENTER);
    text('[CÁMARA EN VIVO]', 1676, 188);
    fill(G.dim); textSize(14); text('C: magenta para chroma', 1676, 220);
  } else if (camMode === 1) {
    fill('#FF00FF'); rect(1480, 48, 392, 300);
  }

  // Lo que digo
  fill(0, 0, 0, 215); rect(1480, 372, 392, 580);
  noFill(); stroke(G.dim); strokeWeight(2); rect(1480, 372, 392, 580); noStroke();
  fill(G.dim); textSize(16); textAlign(LEFT, TOP); text('> LO_QUE_DIGO', 1508, 398);
  textSize(27); textLeading(38);
  fill(G.bright); text(QUOTE_A, 1508, 440, 340, 220);
  if (lastDone) { fill(G.white); text(QUOTE_B, 1508, 680, 340, 220); }

  // Marquesina
  fill(0, 0, 0, 230); rect(0, 976, W, 104);
  stroke(G.dim); line(0, 976, W, 976); noStroke();
  textSize(38); textAlign(LEFT, CENTER); fill(G.bright);
  const mw = textWidth(MARQUEE);
  marqueeX -= 2.2 * Math.max(rainLevel, 0.25);
  if (marqueeX <= -mw) marqueeX += mw;
  for (let x = marqueeX; x < W; x += mw) text(MARQUEE, x + 32, 1028);

  if (auto) { fill(G.bright); textSize(14); textAlign(RIGHT, TOP); text('AUTO', 1872, 20); }
}

function keyPressed() {
  if (key === ' ' || keyCode === RIGHT_ARROW) { nextRow(); return false; }
  if (keyCode === LEFT_ARROW) { prevRow(); return false; }
  const k = (key || '').toLowerCase();
  if (k === 'a') { auto = !auto; lastAuto = millis() - AUTO_MS; }
  else if (k === 'c') { camMode = (camMode + 1) % 3; }
  else if (k === 'r') { resetAll(); }
  else if (k === 'f') { fullscreen(!fullscreen()); }
}
