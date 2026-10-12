/**
 * Zuma: Mobile Game Engine with External Assets & Fallbacks
 * محرك اللعبة مع دعم تحميل وتشغيل الأصول الخارجية (صور، أشكال، سبريت، وأصوات)
 */

// تهيئة نظام الأصوات الاحتياطي (Procedural Synthesizer) في حال عدم توفر ملفات MP3
class FallbackAudioEngine {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  shoot() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.12);
    g.gain.setValueAtTime(0.3, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }
  match(combo = 1) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [330, 392, 493.88, 587.33, 659.25, 783.99];
    const f = freqs[Math.min(combo - 1, freqs.length - 1)];
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, now);
    g.gain.setValueAtTime(0.3, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.31);
  }
  insert() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.setValueAtTime(100, now + 0.04);
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }
  snap() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.14);
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }
  victory() {
    if (!this.ctx) return;
    [400, 500, 600, 800].forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.1;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.25, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.21);
    });
  }
  gameover() {
    if (!this.ctx) return;
    [350, 280, 210, 140].forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.21);
    });
  }
}

// ألوان ونماذج الكرات
const MARBLE_PALETTE = [
  { id: 0, key: 'ruby',     c1: '#ff2a55', c2: '#80001a', hi: '#ff99aa', symbol: '✦' },
  { id: 1, key: 'sapphire', c1: '#00a6ff', c2: '#003366', hi: '#99ddff', symbol: '▲' },
  { id: 2, key: 'emerald',  c1: '#00e676', c2: '#004d26', hi: '#b3ffd9', symbol: '◆' },
  { id: 3, key: 'amber',    c1: '#ffb300', c2: '#804d00', hi: '#ffe699', symbol: '●' },
  { id: 4, key: 'amethyst', c1: '#ba55d3', c2: '#4a0e66', hi: '#f2ccff', symbol: '★' }
];

const MARBLE_RADIUS = 16;
const MARBLE_DIAMETER = MARBLE_RADIUS * 2;

class ZumaMobileGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.assetManager = new AssetManager(GAME_ASSETS_CONFIG);
    this.fallbackAudio = new FallbackAudioEngine();

    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.isPlaying = false;
    this.isPaused = false;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.path = [];
    this.pathLength = 0;
    this.skullPos = { x: 0, y: 0 };
    this.skullAngle = 0;

    this.chain = [];
    this.marblesSpawned = 0;
    this.totalMarbles = 40;
    this.speed = 1.0;

    this.frog = {
      x: this.width / 2,
      y: this.height / 2,
      angle: 0,
      currentMarble: 0,
      nextMarble: 1,
      radius: 42,
      recoil: 0
    };

    this.bullets = [];
    this.particles = [];
    this.floatingTexts = [];

    this.initCanvas();
    this.bindEvents();
    this.preloadAssets();
  }

  initCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.resetTransform();
    this.ctx.scale(this.dpr, this.dpr);

    this.frog.x = this.width / 2;
    this.frog.y = this.height / 2;
  }

  async preloadAssets() {
    const bar = document.getElementById('loader-bar-fill');
    const screen = document.getElementById('asset-loader-screen');
    await this.assetManager.loadAll((percent) => {
      bar.style.width = `${percent}%`;
    });
    setTimeout(() => {
      screen.classList.add('fade-out');
      this.generateLevelPath(this.level);
      this.startLoop();
    }, 400);
  }

  generateLevelPath(lvl) {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const raw = [];
    const minDim = Math.min(this.width, this.height);

    if (lvl === 1) {
      // مسار حلزوني
      const turns = 2.4;
      const steps = 400;
      const maxR = minDim * 0.45;
      const minR = minDim * 0.16;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle = t * turns * Math.PI * 2;
        const r = maxR - t * (maxR - minR);
        raw.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r * 0.88 });
      }
    } else if (lvl === 2) {
      // مسار ثعباني S-Curve
      const steps = 450;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle = t * Math.PI * 3.6;
        const r = (1 - t) * (minDim * 0.44) + minDim * 0.13;
        raw.push({ x: cx + Math.cos(angle) * r + Math.sin(t * 8) * 25, y: cy + Math.sin(angle) * r * 0.9 });
      }
    } else {
      // مسار عين الإعصار
      const steps = 500;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle = t * Math.PI * 4.3;
        const r = (1 - Math.pow(t, 0.95)) * (minDim * 0.46) + minDim * 0.12;
        raw.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r * 0.82 });
      }
    }

    // تقسيم المسار إلى نقاط ذات أبعاد متساوية (Equidistant sampling)
    this.path = [];
    let accDist = 0;
    const segs = [];
    for (let i = 0; i < raw.length - 1; i++) {
      const p1 = raw[i];
      const p2 = raw[i + 1];
      const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      segs.push({ p1, p2, dist: d, startD: accDist });
      accDist += d;
    }
    this.pathLength = accDist;

    for (let d = 0; d <= this.pathLength; d += 2.0) {
      const seg = segs.find(s => d >= s.startD && d <= s.startD + s.dist) || segs[segs.length - 1];
      const t = (d - seg.startD) / (seg.dist || 1);
      const x = seg.p1.x + (seg.p2.x - seg.p1.x) * t;
      const y = seg.p1.y + (seg.p2.y - seg.p1.y) * t;
      const angle = Math.atan2(seg.p2.y - seg.p1.y, seg.p2.x - seg.p1.x);
      this.path.push({ x, y, angle, dist: d });
    }

    const endPoint = this.path[this.path.length - 1];
    this.skullPos = { x: endPoint.x, y: endPoint.y };
    this.skullAngle = endPoint.angle;
  }

  getPoint(d) {
    if (this.path.length === 0) return { x: 0, y: 0, angle: 0 };
    const clamped = Math.max(0, Math.min(d, this.pathLength));
    const idx = Math.min(Math.floor(clamped / 2.0), this.path.length - 1);
    return this.path[idx];
  }

  startLevel(lvl = 1) {
    this.level = lvl;
    this.generateLevelPath(this.level);
    this.chain = [];
    this.bullets = [];
    this.particles = [];
    this.floatingTexts = [];
    this.marblesSpawned = 0;
    this.totalMarbles = 35 + lvl * 10;
    this.speed = 0.9 + lvl * 0.2;
    this.isPlaying = true;
    this.isPaused = false;

    const maxColors = Math.min(2 + lvl, MARBLE_PALETTE.length);
    this.frog.currentMarble = Math.floor(Math.random() * maxColors);
    this.frog.nextMarble = Math.floor(Math.random() * maxColors);

    this.assetManager.playBGM();
    this.updateHUD();
    this.hideModals();
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvas();
      this.generateLevelPath(this.level);
    });

    const triggerAim = (cx, cy, shoot = false) => {
      if (!this.isPlaying || this.isPaused) return;
      this.frog.angle = Math.atan2(cy - this.frog.y, cx - this.frog.x);
      if (shoot) this.shoot();
    };

    // دعم أحداث اللمس والماوس
    this.canvas.addEventListener('mousemove', (e) => triggerAim(e.clientX, e.clientY, false));
    this.canvas.addEventListener('click', (e) => {
      this.fallbackAudio.init();
      triggerAim(e.clientX, e.clientY, true);
    });

    this.canvas.addEventListener('touchstart', (e) => {
      this.fallbackAudio.init();
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const distToCenter = Math.hypot(t.clientX - this.frog.x, t.clientY - this.frog.y);
        if (distToCenter < this.frog.radius * 1.2) {
          this.swapMarbles();
        } else {
          triggerAim(t.clientX, t.clientY, true);
        }
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        triggerAim(e.touches[0].clientX, e.touches[0].clientY, false);
      }
    }, { passive: true });

    // أزرار التحكم
    document.getElementById('btn-swap-marble').addEventListener('click', (e) => {
      e.stopPropagation();
      this.swapMarbles();
    });
    document.getElementById('btn-start-game').addEventListener('click', () => {
      this.fallbackAudio.init();
      this.startLevel(1);
    });
    document.getElementById('btn-next-stage').addEventListener('click', () => {
      this.fallbackAudio.init();
      this.startLevel(this.level + 1);
    });
    document.getElementById('btn-restart-game').addEventListener('click', () => {
      this.fallbackAudio.init();
      this.lives = 3;
      this.score = 0;
      this.startLevel(1);
    });
    document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
    document.getElementById('btn-resume-game').addEventListener('click', () => this.togglePause());
    document.getElementById('btn-replay-level').addEventListener('click', () => this.startLevel(this.level));
  }

  swapMarbles() {
    const temp = this.frog.currentMarble;
    this.frog.currentMarble = this.frog.nextMarble;
    this.frog.nextMarble = temp;
    this.assetManager.playSound('insert', () => this.fallbackAudio.insert());
    this.frog.recoil = 6;
  }

  shoot() {
    if (this.bullets.length >= 2) return;
    const spd = 20;
    const r = this.frog.radius + 6;
    this.bullets.push({
      x: this.frog.x + Math.cos(this.frog.angle) * r,
      y: this.frog.y + Math.sin(this.frog.angle) * r,
      vx: Math.cos(this.frog.angle) * spd,
      vy: Math.sin(this.frog.angle) * spd,
      color: this.frog.currentMarble,
      radius: MARBLE_RADIUS
    });

    this.assetManager.playSound('shoot', () => this.fallbackAudio.shoot());
    this.frog.recoil = 8;

    this.frog.currentMarble = this.frog.nextMarble;
    this.frog.nextMarble = this.getNextMarbleColor();
  }

  getNextMarbleColor() {
    if (this.chain.length > 0 && Math.random() < 0.75) {
      return this.chain[Math.floor(Math.random() * this.chain.length)].color;
    }
    const maxColors = Math.min(2 + this.level, MARBLE_PALETTE.length);
    return Math.floor(Math.random() * maxColors);
  }

  togglePause() {
    if (!this.isPlaying) return;
    this.isPaused = !this.isPaused;
    const modal = document.getElementById('pause-modal');
    if (this.isPaused) {
      modal.classList.remove('hidden');
      modal.classList.add('show');
    } else {
      modal.classList.add('hidden');
      modal.classList.remove('show');
    }
  }

  hideModals() {
    document.querySelectorAll('.modal').forEach(m => {
      m.classList.add('hidden');
      m.classList.remove('show');
    });
  }

  updateHUD() {
    document.getElementById('score-display').textContent = this.score;
    document.getElementById('level-display').textContent = this.level;

    const livesBox = document.getElementById('lives-container');
    livesBox.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('span');
      s.textContent = '🐸';
      s.style.opacity = i < this.lives ? '1' : '0.2';
      livesBox.appendChild(s);
    }

    const total = this.totalMarbles;
    const remaining = total - this.marblesSpawned + this.chain.length;
    const pct = Math.max(0, Math.min(100, Math.floor(((total - remaining) / total) * 100)));
    document.getElementById('progress-fill').style.width = `${pct}%`;
  }

  update() {
    if (!this.isPlaying || this.isPaused) return;

    if (this.frog.recoil > 0) this.frog.recoil -= 0.8;

    // إنتاج الكرات على المسار
    if (this.marblesSpawned < this.totalMarbles) {
      if (this.chain.length === 0 || this.chain[0].dist >= MARBLE_DIAMETER) {
        const maxColors = Math.min(2 + this.level, MARBLE_PALETTE.length);
        this.chain.unshift({
          dist: 0,
          color: Math.floor(Math.random() * maxColors)
        });
        this.marblesSpawned++;
      }
    }

    // حركة السلسلة
    if (this.chain.length > 0) {
      this.chain[this.chain.length - 1].dist += this.speed;

      for (let i = this.chain.length - 2; i >= 0; i--) {
        const lead = this.chain[i + 1];
        const cur = this.chain[i];
        const target = lead.dist - MARBLE_DIAMETER;
        if (cur.dist > target) {
          cur.dist = target;
        } else if (cur.dist < target) {
          cur.dist += this.speed;
        }
      }

      // الانجذاب المغناطيسي
      this.resolveMagneticAttraction();

      // التحقق من خسارة المحاولة
      if (this.chain[this.chain.length - 1].dist >= this.pathLength - 20) {
        this.onLifeLost();
        return;
      }
    } else if (this.marblesSpawned >= this.totalMarbles) {
      this.onLevelWin();
      return;
    }

    // تحديث المقذوفات
    this.updateBullets();

    // تحديث الجسيمات
    this.updateParticles();

    this.updateHUD();
  }

  resolveMagneticAttraction() {
    for (let i = 0; i < this.chain.length - 1; i++) {
      const cur = this.chain[i];
      const next = this.chain[i + 1];
      const gap = next.dist - cur.dist - MARBLE_DIAMETER;

      if (gap > 2 && cur.color === next.color) {
        const pull = Math.min(8.0, gap * 0.4 + 2);
        for (let k = 0; k <= i; k++) {
          this.chain[k].dist += pull;
        }
        if (next.dist - cur.dist <= MARBLE_DIAMETER + 1) {
          this.assetManager.playSound('snap', () => this.fallbackAudio.snap());
          this.checkMatchAt(i, 2);
          break;
        }
      }
    }
  }

  updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;

      if (b.x < -30 || b.x > this.width + 30 || b.y < -30 || b.y > this.height + 30) {
        this.bullets.splice(i, 1);
        continue;
      }

      // التحقق من الاصطدام بالسلسلة
      for (let c = 0; c < this.chain.length; c++) {
        const marble = this.chain[c];
        const pos = this.getPoint(marble.dist);
        if (Math.hypot(b.x - pos.x, b.y - pos.y) <= MARBLE_RADIUS + b.radius) {
          this.insertMarbleToChain(c, b);
          this.bullets.splice(i, 1);
          break;
        }
      }
    }
  }

  insertMarbleToChain(hitIdx, bullet) {
    const hitM = this.chain[hitIdx];
    const hitP = this.getPoint(hitM.dist);
    const dot = (bullet.x - hitP.x) * Math.cos(hitP.angle) + (bullet.y - hitP.y) * Math.sin(hitP.angle);
    
    let insertIdx = dot > 0 ? hitIdx + 1 : hitIdx;
    let dist = dot > 0 ? hitM.dist + MARBLE_DIAMETER : Math.max(0, hitM.dist - MARBLE_DIAMETER);

    this.chain.splice(insertIdx, 0, { dist: dist, color: bullet.color });
    this.assetManager.playSound('insert', () => this.fallbackAudio.insert());

    for (let k = 0; k < insertIdx; k++) {
      this.chain[k].dist = Math.max(0, this.chain[k].dist - MARBLE_DIAMETER);
    }

    this.checkMatchAt(insertIdx, 1);
  }

  checkMatchAt(idx, combo = 1) {
    if (idx < 0 || idx >= this.chain.length) return;
    const color = this.chain[idx].color;
    let start = idx;
    let end = idx;

    while (start > 0 && this.chain[start - 1].color === color) start--;
    while (end < this.chain.length - 1 && this.chain[end + 1].color === color) end++;

    const count = end - start + 1;
    if (count >= 3) {
      const pts = count * 100 * combo;
      this.score += pts;
      const centerPos = this.getPoint(this.chain[Math.floor((start + end) / 2)].dist);
      this.createBurst(centerPos.x, centerPos.y, color, count);
      this.addPopup(centerPos.x, centerPos.y, `+${pts}${combo > 1 ? ' x' + combo : ''}`);
      this.assetManager.playSound('match', () => this.fallbackAudio.match(combo));
      this.chain.splice(start, count);
    }
  }

  createBurst(x, y, colorId, count) {
    const pData = MARBLE_PALETTE[colorId];
    for (let i = 0; i < count * 8; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 2 + Math.random() * 5;
      this.particles.push({
        x: x, y: y,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        color: Math.random() > 0.4 ? pData.c1 : pData.hi,
        radius: 3 + Math.random() * 3,
        alpha: 1,
        decay: 0.03
      });
    }
  }

  addPopup(x, y, txt) {
    this.floatingTexts.push({ x, y, txt, alpha: 1.0 });
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y -= 1.4;
      t.alpha -= 0.02;
      if (t.alpha <= 0) this.floatingTexts.splice(i, 1);
    }
  }

  onLifeLost() {
    this.lives--;
    this.assetManager.playSound('gameover', () => this.fallbackAudio.gameover());
    this.updateHUD();

    if (this.lives <= 0) {
      this.isPlaying = false;
      document.getElementById('gameover-score').textContent = this.score;
      const m = document.getElementById('gameover-modal');
      m.classList.remove('hidden');
      m.classList.add('show');
    } else {
      this.startLevel(this.level);
    }
  }

  onLevelWin() {
    this.isPlaying = false;
    this.assetManager.playSound('victory', () => this.fallbackAudio.victory());
    document.getElementById('victory-score').textContent = this.score;
    const m = document.getElementById('victory-modal');
    m.classList.remove('hidden');
    m.classList.add('show');
  }

  // ==========================================
  // نظام الرسم والعرض (Render Engine)
  // ==========================================
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. رسم الخلفية (صورة خارجية أو رسم إجرائي)
    const bgImg = this.assetManager.images.background;
    if (bgImg) {
      this.ctx.drawImage(bgImg, 0, 0, this.width, this.height);
    } else {
      this.drawProceduralBackground();
    }

    // 2. رسم مسار الحجر المنحوت
    this.drawTrack();

    // 3. رسم الجمجمة (صورة خارجية أو إجرائي)
    this.drawSkull();

    // 4. رسم كرات السلسلة
    for (let i = 0; i < this.chain.length; i++) {
      const m = this.chain[i];
      const pos = this.getPoint(m.dist);
      this.drawMarble(pos.x, pos.y, m.color, MARBLE_RADIUS);
    }

    // 5. رسم المقذوفات
    for (let i = 0; i < this.bullets.length; i++) {
      const b = this.bullets[i];
      this.drawMarble(b.x, b.y, b.color, b.radius);
    }

    // 6. رسم الضفدع الرامي (صورة خارجية أو شكل إجرائي)
    this.drawFrog();

    // 7. رسم الجسيمات والنصوص
    this.drawEffects();
  }

  drawProceduralBackground() {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    for (let x = 0; x < this.width; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawTrack() {
    if (this.path.length < 2) return;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.path[0].x, this.path[0].y);
    for (let i = 1; i < this.path.length; i += 2) {
      this.ctx.lineTo(this.path[i].x, this.path[i].y);
    }
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // حواف الحفرة
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.lineWidth = MARBLE_DIAMETER + 10;
    this.ctx.stroke();

    this.ctx.strokeStyle = '#122a30';
    this.ctx.lineWidth = MARBLE_DIAMETER + 4;
    this.ctx.stroke();

    this.ctx.strokeStyle = '#051114';
    this.ctx.lineWidth = MARBLE_DIAMETER - 4;
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawSkull() {
    const skullImg = this.assetManager.images.skull;
    this.ctx.save();
    this.ctx.translate(this.skullPos.x, this.skullPos.y);
    this.ctx.rotate(this.skullAngle);

    if (skullImg) {
      this.ctx.drawImage(skullImg, -28, -28, 56, 56);
    } else {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 24, 0, Math.PI * 2);
      this.ctx.fillStyle = '#020608';
      this.ctx.fill();
      this.ctx.strokeStyle = '#37474f';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();
      this.ctx.fillStyle = '#b0bec5';
      this.ctx.font = '22px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('💀', 0, 0);
    }
    this.ctx.restore();
  }

  drawMarble(x, y, colorId, radius) {
    const p = MARBLE_PALETTE[colorId];
    const customImg = this.assetManager.images.marbles ? this.assetManager.images.marbles[p.key] : null;

    if (customImg) {
      this.ctx.drawImage(customImg, x - radius, y - radius, radius * 2, radius * 2);
      return;
    }

    // رسم الكرة ثلاثية الأبعاد اللامعة إجرائياً
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);

    const grad = this.ctx.createRadialGradient(
      x - radius * 0.35, y - radius * 0.35, radius * 0.1,
      x, y, radius
    );
    grad.addColorStop(0, p.hi);
    grad.addColorStop(0.3, p.c1);
    grad.addColorStop(1, p.c2);

    this.ctx.fillStyle = grad;
    this.ctx.fill();

    // رمز الكرة الداخلي
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    this.ctx.font = `bold ${radius * 0.85}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(p.symbol, x, y);

    this.ctx.restore();
  }

  drawFrog() {
    this.ctx.save();
    this.ctx.translate(this.frog.x, this.frog.y);
    this.ctx.rotate(this.frog.angle);

    const frogImg = this.assetManager.images.frog;
    if (frogImg) {
      const s = this.frog.radius * 2.2 - this.frog.recoil;
      this.ctx.drawImage(frogImg, -s / 2, -s / 2, s, s);
    } else {
      // قاعدة تمثال الضفدع الحجرية
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.frog.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#1c362d';
      this.ctx.fill();
      this.ctx.strokeStyle = '#00e676';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      // عيون الضفدع
      this.ctx.fillStyle = '#00e676';
      this.ctx.beginPath();
      this.ctx.arc(18, -20, 10, 0, Math.PI * 2);
      this.ctx.arc(18, 20, 10, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#000';
      this.ctx.beginPath();
      this.ctx.arc(20, -20, 5, 0, Math.PI * 2);
      this.ctx.arc(20, 20, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // رسم الكرة المحمولة في الفم والكرة الاحتياطية على الظهر
    this.drawMarble(this.frog.radius - 8, 0, this.frog.currentMarble, MARBLE_RADIUS - 2);
    this.drawMarble(-14, 0, this.frog.nextMarble, MARBLE_RADIUS - 5);

    this.ctx.restore();
  }

  drawEffects() {
    // رسم الجسيمات المتناثرة
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // رسم النصوص العائمة للنقاط
    for (let i = 0; i < this.floatingTexts.length; i++) {
      const t = this.floatingTexts[i];
      this.ctx.save();
      this.ctx.globalAlpha = t.alpha;
      this.ctx.fillStyle = '#ffeb3b';
      this.ctx.font = 'bold 16px Tajawal';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(t.txt, t.x, t.y);
      this.ctx.restore();
    }
  }

  startLoop() {
    const loop = () => {
      this.update();
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// تشغيل اللعبة فور جاهزية المستند
window.addEventListener('DOMContentLoaded', () => {
  new ZumaMobileGame();
});
