// =====================================================
//  EXPEDIENTE: LALA  ·  adentro afuera · Interludio: Martes
// =====================================================
//  CONTROLES
//  Espacio / →  agregar la siguiente fila (también clic)
//  ←            quitar la última fila
//  A            automático (una fila cada 3 s)
//  C            cámara: marcador · verde (chroma) · vacío
//  R            reiniciar
//  F            pantalla completa
// =====================================================

// ---------- 1. EDITA AQUÍ TU EXPEDIENTE ----------
// Cada fila: [código, serie / asunto, fechas, observaciones]
// La ÚLTIMA fila siempre se dibuja oscura (la fila vacía).
const ROWS = [
  ['LJR-01', 'Identidad · Nombre de uso: Lala', '—', 'Dicho por ella'],
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

const TITULO   = 'Adentro-afuera.- Interludio: Martes · Disponibilidad';
const HORA     = '17:52';
const QUOTE_A  = '"Llevo años decidiendo qué se conserva de otros.';
const QUOTE_B  = 'Hoy alguien hizo el inventario de mí."';
const MARQUEE  = '[…] ¿esta soy yo? · ¿quién custodia este fondo? · ¿quién decide qué se conserva? ';

// ---------- 2. RITMO ----------
const SPEED   = 0.05;   // caracteres por milisegundo (más alto = escribe más rápido)
const AUTO_MS = 3000;   // milisegundos entre filas en modo automático

// ---------- No hace falta tocar nada de aquí para abajo ----------
const W = 1920, H = 1080;
const COL = {
  teal: '#035B66', tealDk: '#02414A', yellow: '#F2C230', paper: '#F4F1EA',
  ink: '#1A1A1A', rule: '#CFC8B8', panel: '#1C1C1C', cam: '#E9D98A', camInk: '#6B5A12',
  black: '#000000', white: '#FFFFFF', label: '#6A6A6A'
};

let starts = [];
let headerStart = 0;
let auto = false, lastAuto = 0;
let camMode = 0;
let marqueeX = 0;
let scaleF = 1;

function setup() {
  const cnv = createCanvas(10, 10);
  cnv.mousePressed(nextRow);
  fitCanvas();
  headerStart = millis();
}

function fitCanvas() {
  scaleF = Math.min(windowWidth / W, windowHeight / H);
  resizeCanvas(Math.floor(W * scaleF), Math.floor(H * scaleF));
}
function windowResized() { fitCanvas(); }

function nextRow() {
  if (starts.length < ROWS.length) { starts.push(millis()); lastAuto = millis(); }
}
function prevRow() { starts.pop(); }
function resetAll() { starts = []; headerStart = millis(); auto = false; marqueeX = 0; }

function typed(str, chars) { return str.slice(0, Math.max(0, Math.min(str.length, chars))); }

function draw() {
  if (auto && millis() - lastAuto > AUTO_MS) nextRow();
  if (auto && starts.length >= ROWS.length) auto = false;

  scale(scaleF);
  background(COL.black);
  noStroke();

  // Barra de título
  fill(COL.teal); rect(0, 0, W, 72, 18, 18, 0, 0);
  [['#E0453A', 44], ['#F2C230', 78], ['#2FA866', 112]].forEach(([c, x]) => { fill(c); circle(x, 36, 22); });
  fill(COL.white); textFont('Barlow Condensed'); textStyle(NORMAL); textSize(36); textAlign(LEFT, CENTER);
  text(TITULO, 164, 34);
  textFont('IBM Plex Mono'); textSize(20); fill('#BFE3E8'); textAlign(RIGHT, CENTER);
  text(HORA, W - 32, 36);

  // Hoja del inventario
  fill(COL.paper); rect(0, 72, 1460, 880);
  textAlign(LEFT, BASELINE);
  fill(COL.teal); textFont('IBM Plex Mono'); textSize(18);
  text('FORMATO ÚNICO DE INVENTARIO DOCUMENTAL', 48, 124);
  fill(COL.tealDk); textFont('Barlow Condensed'); textStyle(BOLD); textSize(72);
  text('Expediente: Lala', 44, 204);
  textStyle(NORMAL);

  // Encabezado que se escribe solo
  let budget = (millis() - headerStart) * SPEED;
  textFont('IBM Plex Mono'); textSize(18);
  HEADER.forEach(([k, v], i) => {
    const y = 132 + i * 30;
    fill(COL.label); text(typed(k, budget), 940, y); budget -= k.length;
    fill('#333333'); text(typed(v, budget), 1150, y); budget -= v.length;
  });
  stroke(COL.teal); strokeWeight(3); line(48, 236, 1412, 236); noStroke();

  // Encabezado de la tabla
  const X = [48, 128, 278, 902, 1112], WD = [80, 150, 624, 210, 300];
  fill(COL.teal); rect(48, 260, 1364, 44);
  fill(COL.white); textFont('IBM Plex Mono'); textSize(16); textAlign(LEFT, CENTER);
  ['Nº', 'Código', 'Serie / asunto', 'Fechas extremas', 'Observaciones'].forEach((h, i) => text(h, X[i] + 14, 282));

  // Filas
  const y0 = 304, RH = 72;
  let cursorPos = null;
  for (let i = 0; i < starts.length; i++) {
    const r = ROWS[i];
    const last = i === ROWS.length - 1;
    const age = millis() - starts[i];
    const base = color(last ? COL.black : COL.paper);
    const k = constrain(age / 700, 0, 1);
    fill(last ? base : lerpColor(color(COL.yellow), base, k));
    rect(48, y0 + i * RH, 1364, RH);
    stroke(COL.rule); strokeWeight(1); line(48, y0 + (i + 1) * RH, 1412, y0 + (i + 1) * RH); noStroke();

    const cells = [String(i + 1).padStart(2, '0'), r[0] || '', r[1] || '', r[2] || '', r[3] || ''];
    let chars = age * SPEED;
    cells.forEach((c, ci) => {
      const mono = ci !== 2 && ci !== 4;
      textFont(mono ? 'IBM Plex Mono' : 'Barlow');
      textSize(mono ? 20 : 23);
      textAlign(LEFT, TOP); textLeading(27);
      fill(last ? COL.yellow : COL.ink);
      const shown = typed(c, chars);
      text(shown, X[ci] + 14, y0 + i * RH + 12, WD[ci] - 24, RH - 14);
      if (chars > 0 && chars < c.length) {
        cursorPos = { x: X[ci] + 14 + Math.min(textWidth(shown), WD[ci] - 26), y: y0 + i * RH + 12, last };
      }
      chars -= c.length;
    });
  }
  if (cursorPos && frameCount % 40 < 24) {
    fill(cursorPos.last ? COL.yellow : COL.teal); rect(cursorPos.x + 2, cursorPos.y + 2, 11, 24);
  }
  // Cursor que espera en la fila vacía
  const complete = starts.length === ROWS.length;
  if (complete) {
    const i = ROWS.length - 1;
    const done = (millis() - starts[i]) * SPEED > ROWS[i].join('').length + 2;
    if (done && frameCount % 60 < 30) { fill(COL.yellow); rect(1382, y0 + i * RH + 24, 11, 24); }
  }

  // Folios
  fill(COL.label); textFont('IBM Plex Mono'); textSize(16); textAlign(RIGHT, BASELINE);
  text('Folios: ' + starts.length + ' / ' + ROWS.length, 1412, 936);

  // Columna derecha: cámara + cita
  fill(COL.panel); rect(1460, 72, 460, 1008);
  if (camMode === 0) {
    fill(COL.cam); rect(1484, 96, 412, 300, 16);
    fill(COL.camInk); textFont('IBM Plex Mono'); textSize(18); textAlign(CENTER, CENTER);
    text('[CÁMARA EN VIVO]', 1690, 236);
  } else if (camMode === 1) {
    fill('#00FF00'); rect(1484, 96, 412, 300, 16);
  }

  fill(COL.yellow); rect(1484, 420, 412, 636, 28);
  fill(COL.tealDk); textFont('IBM Plex Mono'); textSize(18); textAlign(LEFT, TOP);
  text('LO QUE DIGO', 1516, 452);
  textFont('Barlow'); textSize(34); textLeading(42);
  text(QUOTE_A + (complete ? '\n\n' + QUOTE_B : ''), 1516, 500, 348, 520);

  // Marquesina
  fill(COL.black); rect(0, 952, 1460, 128);
  textFont('Barlow'); textSize(46); textAlign(LEFT, CENTER); fill(COL.white);
  const mw = textWidth(MARQUEE);
  marqueeX -= 2.2;
  if (marqueeX <= -mw) marqueeX += mw;
  drawingContext.save();
  drawingContext.beginPath(); drawingContext.rect(0, 952, 1460, 128); drawingContext.clip();
  for (let x = marqueeX; x < 1460; x += mw) text(MARQUEE, x + 36, 1014);
  drawingContext.restore();

  if (auto) { fill(COL.yellow); textFont('IBM Plex Mono'); textSize(14); textAlign(RIGHT, CENTER); text('AUTO', 1890, 64); }
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