(() => {
  'use strict';

  // ---------- Setup ----------
  const canvas = document.getElementById('game');
  let ctx = canvas.getContext('2d');
  const muteBtn = document.getElementById('mute');

  const W = 400;           // logical width; height adapts to the screen
  let H = 700;
  let scale = 1;
  let groundY = H - 90;

  function resize() {
    const sw = window.innerWidth;
    const sh = window.innerHeight;
    scale = sw / W;
    H = sh / scale;
    if (H < 560) { H = 560; scale = sh / H; }
    if (H > 900) { H = 900; scale = Math.min(sw / W, sh / H); }
    groundY = H - 90;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.style.width = W * scale + 'px';
    canvas.style.height = H * scale + 'px';
    canvas.width = Math.round(W * scale * dpr);
    canvas.height = Math.round(H * scale * dpr);
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  // ---------- Storage (best score) ----------
  function loadBest() {
    try { return parseInt(localStorage.getItem('flappydox-best') || '0', 10) || 0; } catch (e) { return 0; }
  }
  function saveBest(v) {
    try { localStorage.setItem('flappydox-best', String(v)); } catch (e) { /* ignore */ }
  }
  function loadMuted() {
    try { return localStorage.getItem('flappydox-muted') === '1'; } catch (e) { return false; }
  }
  function saveMuted(v) {
    try { localStorage.setItem('flappydox-muted', v ? '1' : '0'); } catch (e) { /* ignore */ }
  }

  // ---------- Sound ----------
  let audio = null;
  let muted = loadMuted();
  muteBtn.textContent = muted ? '🔇' : '🔊';

  function ensureAudio() {
    if (audio) { if (audio.state === 'suspended') audio.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audio = new AC();
  }

  function tone(freqStart, freqEnd, dur, type, vol, delay = 0) {
    if (!audio || muted) return;
    const t = audio.currentTime + delay;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  function whoosh() {
    if (!audio || muted) return;
    const dur = 0.12;
    const buf = audio.createBuffer(1, Math.floor(audio.sampleRate * dur), audio.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = audio.createBufferSource();
    src.buffer = buf;
    const filter = audio.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 900;
    const gain = audio.createGain();
    gain.gain.value = 0.25;
    src.connect(filter).connect(gain).connect(audio.destination);
    src.start();
  }

  function woof() {
    if (!audio || muted) return;
    const t = audio.currentTime;
    const osc = audio.createOscillator();
    const filter = audio.createBiquadFilter();
    const gain = audio.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(190, t + 0.16);
    filter.type = 'lowpass';
    filter.frequency.value = 1400;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(filter).connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  const sfx = {
    flap: () => whoosh(),
    point: () => { tone(880, 880, 0.08, 'square', 0.08); tone(1320, 1320, 0.12, 'square', 0.08, 0.08); },
    hit: () => { tone(160, 60, 0.25, 'triangle', 0.4); woof(); },
  };

  muteBtn.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    muted = !muted;
    saveMuted(muted);
    muteBtn.textContent = muted ? '🔇' : '🔊';
  });

  // ---------- Game constants ----------
  const GRAVITY = 1450;
  const FLAP_VY = -440;
  const MAX_FALL = 720;
  const OBST_W = 60;
  const SPACING = 235;
  const BASE_SPEED = 155;
  const DOG_X = 120;

  // ---------- State ----------
  let state = 'ready';      // ready | play | dying | over
  let dog, obstacles, score, best = loadBest(), speed, worldX, overTimer, flash, newBest;
  const clouds = Array.from({ length: 6 }, (_, i) => ({
    x: i * 140 + Math.random() * 60,
    y: 40 + Math.random() * 180,
    s: 0.7 + Math.random() * 0.6,
  }));

  function reset() {
    dog = { y: H * 0.42, vy: 0, rot: 0, earT: 1, earAngle: 0.3, legT: 0, bob: 0 };
    obstacles = [];
    score = 0;
    speed = BASE_SPEED;
    overTimer = 0;
    flash = 0;
    newBest = false;
  }
  reset();
  worldX = 0;

  function gapSize() {
    return Math.max(140, 172 - score * 1.2);
  }

  function spawnObstacle(x) {
    const gap = gapSize();
    const minTop = 70;
    const maxTop = groundY - gap - 70;
    const top = minTop + Math.random() * (maxTop - minTop);
    obstacles.push({ x, top, bottom: top + gap, scored: false });
  }

  // ---------- Input ----------
  function flap() {
    ensureAudio();
    if (state === 'ready') {
      state = 'play';
      spawnObstacle(W + 60);
    }
    if (state === 'play') {
      dog.vy = FLAP_VY;
      dog.earT = 0;
      sfx.flap();
    } else if (state === 'over' && overTimer > 0.6) {
      reset();
      state = 'ready';
    }
  }

  canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); flap(); });
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'Enter') { e.preventDefault(); flap(); }
  });
  document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gesturestart', (e) => e.preventDefault());

  // ---------- Collision ----------
  function dogCircles() {
    const c = Math.cos(dog.rot), s = Math.sin(dog.rot);
    const pts = [[-24, 0, 11], [4, 0, 13], [40, -13, 12]];
    return pts.map(([px, py, r]) => ({ x: DOG_X + px * c - py * s, y: dog.y + px * s + py * c, r }));
  }

  function circleRect(cx, cy, r, rx, ry, rw, rh) {
    const nx = Math.max(rx, Math.min(cx, rx + rw));
    const ny = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - nx, dy = cy - ny;
    return dx * dx + dy * dy < r * r;
  }

  function obstacleRects(o) {
    const cx = o.x + OBST_W / 2;
    return [
      // hanging pole + lamp
      [cx - 12, -100, 24, o.top - 26 + 100],
      [cx - 30, o.top - 28, 60, 28],
      // hydrant
      [cx - 27, o.bottom, 54, 28],
      [cx - 22, o.bottom + 28, 44, groundY - o.bottom],
    ];
  }

  function hits() {
    const circles = dogCircles();
    for (const c of circles) {
      if (c.y + c.r > groundY) return true;
      for (const o of obstacles) {
        if (o.x > DOG_X + 80 || o.x + OBST_W < DOG_X - 60) continue;
        for (const r of obstacleRects(o)) {
          if (circleRect(c.x, c.y, c.r, r[0], r[1], r[2], r[3])) return true;
        }
      }
    }
    return false;
  }

  // ---------- Update ----------
  function update(dt) {
    dog.earT = Math.min(1, dog.earT + dt / 0.3);

    if (state === 'ready') {
      dog.bob += dt;
      dog.y = H * 0.42 + Math.sin(dog.bob * 3) * 10;
      dog.rot = 0;
      if (dog.earT >= 1 && Math.sin(dog.bob * 3) > 0.95) dog.earT = 0;
    }

    if (state === 'play' || state === 'dying') {
      dog.vy = Math.min(MAX_FALL, dog.vy + GRAVITY * dt);
      dog.y += dog.vy * dt;
      const target = Math.max(-0.45, Math.min(1.25, dog.vy / 650));
      dog.rot += (target - dog.rot) * Math.min(1, dt * 10);
      if (dog.y < -40) { dog.y = -40; dog.vy = 0; }
    }

    if (state === 'play') {
      speed = BASE_SPEED + Math.min(60, score * 2);
      worldX += speed * dt;
      for (const o of obstacles) {
        o.x -= speed * dt;
        if (!o.scored && o.x + OBST_W < DOG_X - 30) {
          o.scored = true;
          score++;
          sfx.point();
        }
      }
      if (obstacles.length && obstacles[0].x < -OBST_W - 40) obstacles.shift();
      const last = obstacles[obstacles.length - 1];
      if (last && last.x < W + 60 - SPACING) spawnObstacle(last.x + SPACING);

      if (hits()) {
        state = 'dying';
        flash = 1;
        sfx.hit();
        if (dog.vy < 0) dog.vy = 0;
      }
    } else if (state === 'ready') {
      worldX += BASE_SPEED * dt;
    }

    if (state === 'dying') {
      const bottom = groundY - 30;
      if (dog.y >= bottom) {
        dog.y = bottom;
        dog.vy = 0;
        state = 'over';
        overTimer = 0;
        if (score > best) { best = score; newBest = true; saveBest(best); }
      }
    }

    if (state === 'over') overTimer += dt;
    flash = Math.max(0, flash - dt * 3);

    // ears: a quick flap after each tap, otherwise they trail in the wind
    const wind = state === 'ready' ? 0.25 : Math.max(-0.2, Math.min(0.9, dog.vy / 700));
    const rest = 0.35 + wind * 0.8;
    const flapAmt = dog.earT < 1 ? Math.sin(Math.PI * dog.earT) * 2.1 : 0;
    dog.earAngle = rest + flapAmt;
    if (state === 'play' || state === 'ready') dog.legT += dt * 14;

    for (const c of clouds) {
      if (state !== 'over' && state !== 'dying') c.x -= dt * 12 * c.s;
      if (c.x < -120) { c.x = W + 80; c.y = 40 + Math.random() * 180; }
    }
  }

  // ---------- Drawing: background ----------
  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, groundY);
    g.addColorStop(0, '#6fc3f2');
    g.addColorStop(1, '#d4f1ff');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, groundY);

    // sun
    ctx.fillStyle = 'rgba(255, 240, 150, 0.35)';
    ctx.beginPath(); ctx.arc(320, 90, 52, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffe36b';
    ctx.beginPath(); ctx.arc(320, 90, 36, 0, Math.PI * 2); ctx.fill();

    for (const c of clouds) drawCloud(c.x, c.y, c.s);
  }

  function drawCloud(x, y, s) {
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.arc(x, y, 20 * s, 0, Math.PI * 2);
    ctx.arc(x + 22 * s, y - 10 * s, 24 * s, 0, Math.PI * 2);
    ctx.arc(x + 48 * s, y, 20 * s, 0, Math.PI * 2);
    ctx.arc(x + 24 * s, y + 6 * s, 20 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawHills() {
    const off = (worldX * 0.2) % 400;
    ctx.fillStyle = '#a6dc84';
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    for (let x = -off - 400; x <= W + 400; x += 400) {
      ctx.quadraticCurveTo(x + 100, groundY - 170, x + 200, groundY - 60);
      ctx.quadraticCurveTo(x + 300, groundY - 130, x + 400, groundY - 50);
    }
    ctx.lineTo(W, groundY);
    ctx.closePath();
    ctx.fill();
  }

  function drawTrees() {
    const spacing = 110;
    const off = (worldX * 0.45) % spacing;
    for (let i = -1; i < W / spacing + 2; i++) {
      const x = i * spacing - off;
      const seed = Math.floor((worldX * 0.45) / spacing) + i;
      const h = 60 + ((seed * 37) % 5) * 9;
      ctx.fillStyle = '#7a5232';
      ctx.fillRect(x - 5, groundY - h * 0.55, 10, h * 0.55);
      ctx.fillStyle = seed % 2 ? '#4fa64a' : '#5cb553';
      ctx.beginPath();
      ctx.arc(x, groundY - h * 0.7, 26, 0, Math.PI * 2);
      ctx.arc(x - 18, groundY - h * 0.55, 20, 0, Math.PI * 2);
      ctx.arc(x + 18, groundY - h * 0.55, 20, 0, Math.PI * 2);
      ctx.fill();
    }
    // bushes
    const bs = 70;
    const boff = (worldX * 0.7) % bs;
    ctx.fillStyle = '#3f9443';
    for (let i = -1; i < W / bs + 2; i++) {
      const x = i * bs - boff;
      ctx.beginPath();
      ctx.arc(x, groundY, 18, Math.PI, 0);
      ctx.arc(x + 22, groundY, 14, Math.PI, 0);
      ctx.fill();
    }
  }

  function drawGround() {
    ctx.fillStyle = '#d7b377';
    ctx.fillRect(0, groundY, W, H - groundY);
    // path stripes
    ctx.fillStyle = '#c9a265';
    const so = worldX % 40;
    for (let x = -so - 40; x < W + 40; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 22);
      ctx.lineTo(x + 20, groundY + 22);
      ctx.lineTo(x + 10, H);
      ctx.lineTo(x - 10, H);
      ctx.closePath();
      ctx.fill();
    }
    // grass strip
    ctx.fillStyle = '#6cc24a';
    ctx.fillRect(0, groundY, W, 20);
    ctx.fillStyle = '#4fa63a';
    ctx.fillRect(0, groundY + 16, W, 5);
    const go = worldX % 12;
    ctx.fillStyle = '#82d65c';
    for (let x = -go; x < W + 12; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 2);
      ctx.lineTo(x + 4, groundY - 6);
      ctx.lineTo(x + 8, groundY + 2);
      ctx.fill();
    }
  }

  // ---------- Drawing: obstacles ----------
  function drawPole(cx, bottomY) {
    // post
    const pg = ctx.createLinearGradient(cx - 12, 0, cx + 12, 0);
    pg.addColorStop(0, '#2e4d3a');
    pg.addColorStop(0.4, '#4f7f62');
    pg.addColorStop(1, '#253f30');
    ctx.fillStyle = pg;
    ctx.fillRect(cx - 12, -10, 24, bottomY - 26 + 10);
    // bands
    ctx.fillStyle = '#203629';
    for (let y = bottomY - 70; y > 0; y -= 90) ctx.fillRect(cx - 14, y, 28, 8);
    // lamp housing (hangs at the bottom end)
    ctx.fillStyle = '#203629';
    ctx.beginPath();
    ctx.moveTo(cx - 16, bottomY - 30);
    ctx.lineTo(cx + 16, bottomY - 30);
    ctx.lineTo(cx + 30, bottomY - 10);
    ctx.lineTo(cx - 30, bottomY - 10);
    ctx.closePath();
    ctx.fill();
    // glowing glass
    ctx.fillStyle = '#fff1a8';
    ctx.beginPath();
    ctx.moveTo(cx - 26, bottomY - 10);
    ctx.lineTo(cx + 26, bottomY - 10);
    ctx.lineTo(cx + 18, bottomY);
    ctx.lineTo(cx - 18, bottomY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#203629';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawHydrant(cx, topY) {
    const red = '#d93a31', dark = '#a8231d', light = '#f0695f';
    // body
    const bg = ctx.createLinearGradient(cx - 22, 0, cx + 22, 0);
    bg.addColorStop(0, dark);
    bg.addColorStop(0.35, light);
    bg.addColorStop(0.6, red);
    bg.addColorStop(1, dark);
    ctx.fillStyle = bg;
    ctx.fillRect(cx - 22, topY + 26, 44, groundY - topY - 26);
    // base flange
    ctx.fillStyle = dark;
    ctx.fillRect(cx - 28, groundY - 12, 56, 12);
    // bolts bands
    ctx.fillStyle = dark;
    for (let y = topY + 90; y < groundY - 30; y += 110) ctx.fillRect(cx - 24, y, 48, 7);
    // dome cap
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.arc(cx, topY + 22, 24, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.arc(cx - 7, topY + 15, 7, 0, Math.PI * 2);
    ctx.fill();
    // top nut
    ctx.fillStyle = dark;
    ctx.fillRect(cx - 6, topY - 4, 12, 8);
    // collar
    ctx.fillStyle = dark;
    ctx.fillRect(cx - 27, topY + 20, 54, 9);
    // side nozzles
    ctx.fillStyle = red;
    ctx.fillRect(cx - 32, topY + 44, 12, 16);
    ctx.fillRect(cx + 20, topY + 44, 12, 16);
    ctx.fillStyle = dark;
    ctx.fillRect(cx - 34, topY + 47, 4, 10);
    ctx.fillRect(cx + 30, topY + 47, 4, 10);
    // front cap
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.arc(cx, topY + 66, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawObstacles() {
    for (const o of obstacles) {
      const cx = o.x + OBST_W / 2;
      drawPole(cx, o.top);
      drawHydrant(cx, o.bottom);
    }
  }

  // ---------- Drawing: the dachshund ----------
  const C = {
    choc: '#6e3d25',
    chocDark: '#4f2a19',
    tan: '#d6a271',
    cream: '#ecc9a0',
    dapple: '#b9a294',
    dappleDark: '#8f7a6d',
    ear: '#7b4429',
    earLight: '#9a5c38',
    nose: '#3a2219',
  };

  function drawEar(px, py, angle, far) {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle);
    ctx.fillStyle = far ? C.chocDark : C.ear;
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.bezierCurveTo(-13, 8, -12, 22, -8, 30);
    // fringe of long fur along the tip
    ctx.quadraticCurveTo(-5, 36, -2, 31);
    ctx.quadraticCurveTo(1, 37, 4, 31);
    ctx.quadraticCurveTo(8, 36, 9, 28);
    ctx.bezierCurveTo(12, 18, 10, 6, 5, 0);
    ctx.closePath();
    ctx.fill();
    if (!far) {
      ctx.strokeStyle = C.earLight;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-2, 6); ctx.quadraticCurveTo(-5, 18, -3, 28);
      ctx.moveTo(3, 6); ctx.quadraticCurveTo(4, 18, 3, 27);
      ctx.stroke();
    }
    ctx.restore();
  }

  function leg(x, y, phase) {
    const swing = Math.sin(phase) * 3;
    ctx.fillStyle = C.chocDark;
    ctx.beginPath();
    ctx.ellipse(x + swing, y + 7, 5, 9, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.tan;
    ctx.beginPath();
    ctx.ellipse(x + swing + 2, y + 15, 5.5, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawDachshund(x, y, rot, earAngle, legT) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    // far ear (behind head), lagging a little
    drawEar(36, -24, earAngle * 0.85 + 0.1, true);

    // far legs
    leg(-22, 4, legT + Math.PI);
    leg(20, 4, legT);

    // feathered tail
    ctx.strokeStyle = C.choc;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-34, -4);
    ctx.quadraticCurveTo(-50, -6, -56, -18 + Math.sin(legT * 0.5) * 3);
    ctx.stroke();
    ctx.strokeStyle = C.earLight;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.quadraticCurveTo(-52, 0, -60, -12 + Math.sin(legT * 0.5) * 3);
    ctx.stroke();

    // body
    ctx.fillStyle = C.choc;
    ctx.beginPath();
    ctx.ellipse(0, 0, 38, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // belly & chest
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 0, 38, 15, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = C.tan;
    ctx.beginPath();
    ctx.ellipse(10, 13, 32, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // dapple patches on her back and hips
    ctx.fillStyle = C.dapple;
    ctx.beginPath();
    ctx.ellipse(-22, -4, 14, 9, -0.3, 0, Math.PI * 2);
    ctx.ellipse(-4, -10, 8, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(14, -9, 6, 3.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.dappleDark;
    ctx.beginPath();
    ctx.ellipse(-26, -6, 5, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(-16, 0, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // near legs
    leg(-26, 6, legT);
    leg(16, 6, legT + Math.PI);

    // neck
    ctx.fillStyle = C.choc;
    ctx.beginPath();
    ctx.ellipse(30, -8, 13, 11, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.tan;
    ctx.beginPath();
    ctx.ellipse(36, -2, 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // head
    ctx.fillStyle = C.tan;
    ctx.beginPath();
    ctx.ellipse(42, -18, 13, 11.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // dappled crown
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(42, -18, 13, 11.5, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = C.dapple;
    ctx.beginPath();
    ctx.ellipse(40, -28, 13, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.dappleDark;
    ctx.beginPath();
    ctx.arc(38, -27, 2.2, 0, Math.PI * 2);
    ctx.arc(45, -25, 1.8, 0, Math.PI * 2);
    ctx.arc(33, -23, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // snout
    ctx.fillStyle = C.cream;
    ctx.beginPath();
    ctx.ellipse(55, -14, 12, 7, 0.08, 0, Math.PI * 2);
    ctx.fill();
    // nose
    ctx.fillStyle = C.nose;
    ctx.beginPath();
    ctx.ellipse(66, -15, 4.2, 3.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(65, -16.5, 1.2, 0, Math.PI * 2);
    ctx.fill();
    // mouth
    ctx.strokeStyle = C.nose;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(64, -11);
    ctx.quadraticCurveTo(60, -7, 55, -9);
    ctx.stroke();

    // big sweet eye
    ctx.fillStyle = '#1d120c';
    ctx.beginPath();
    ctx.ellipse(48, -20, 3.8, 4.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(49.2, -21.6, 1.4, 0, Math.PI * 2);
    ctx.fill();
    // tan brow dot
    ctx.fillStyle = C.chocDark;
    ctx.beginPath();
    ctx.ellipse(46, -27, 3, 1.4, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // near ear on top — this is the one that flaps!
    drawEar(36, -24, earAngle, false);

    ctx.restore();
  }

  // ---------- Drawing: UI ----------
  function outlinedText(text, x, y, size, fill = '#fff') {
    ctx.font = `900 ${size}px "Arial Rounded MT Bold", "Trebuchet MS", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size / 5;
    ctx.strokeStyle = '#3a2219';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawUI() {
    const top = 70;
    if (state === 'ready') {
      outlinedText('Flappy Dox', W / 2, top + 40, 52, '#ffd36b');
      outlinedText('Tap to flap her ears!', W / 2, H * 0.62, 24);
      if (best > 0) outlinedText(`Best: ${best}`, W / 2, H * 0.62 + 40, 20);
    } else if (state === 'play' || state === 'dying') {
      outlinedText(String(score), W / 2, top + 20, 56);
    } else if (state === 'over') {
      const t = Math.min(1, overTimer / 0.35);
      const py = H * 0.28 + (1 - t) * 40;
      ctx.globalAlpha = t;
      outlinedText('Game Over', W / 2, py, 46, '#ff8a5c');
      ctx.fillStyle = '#fff6e3';
      ctx.strokeStyle = '#3a2219';
      ctx.lineWidth = 4;
      roundRect(W / 2 - 120, py + 40, 240, 130, 18);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#7b4429';
      ctx.font = '800 18px "Trebuchet MS", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCORE', W / 2 - 55, py + 66);
      ctx.fillText('BEST', W / 2 + 55, py + 66);
      outlinedText(String(score), W / 2 - 55, py + 108, 40);
      outlinedText(String(best), W / 2 + 55, py + 108, 40, newBest ? '#ffd36b' : '#fff');
      if (newBest) outlinedText('NEW BEST!', W / 2, py + 152, 18, '#ffd36b');
      if (overTimer > 0.6) outlinedText('Tap to play again', W / 2, py + 210, 24);
      ctx.globalAlpha = 1;
    }
  }

  // ---------- Main loop ----------
  function render() {
    drawSky();
    drawHills();
    drawTrees();
    drawObstacles();
    drawGround();
    drawDachshund(DOG_X, dog.y, dog.rot, dog.earAngle, dog.legT);
    drawUI();
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${flash * 0.7})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    update(dt);
    render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // exposed so tools can render the dog for app icons
  window.FlappyDox = {
    drawDogOn(target, x, y, rot, earAngle) {
      const saved = ctx;
      ctx = target;
      try { drawDachshund(x, y, rot, earAngle, 0); } finally { ctx = saved; }
    },
  };
})();
