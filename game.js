/**
 * Zuma Deluxe Mobile Engine
 * يحتوي على محاكي أصوات وموسيقى مايانية بالكامل (Web Audio API Native Synthesis)
 * ومولد جرافيك ثلاثي الأبعاد إجرائي (3D Rolling Orbs, Animated Frog, Mayan Skull, Coins & Particles)
 */

// ==========================================================
// 1. نظام الصوت والموسيقى القبلية المدمج كلياً (Web Audio Engine)
// ==========================================================
class ZumaTribalAudioSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
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

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // صوت نفث الضفدع للكرة (Pneumatic Spit / Thud)
  playShoot() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    // تذبذب النقر
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.14);
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // صوت الارتطام الخزفي بين الكرات (Marble Clack)
  playClack() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 800 + Math.random() * 200;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // صوت تفجير الكرات المتطابقة والمجموعات المتتالية (Chime Chord)
  playComboChime(combo = 1) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    // سلم ماياني نغمي خماسي
    const scale = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.5];
    const root = scale[Math.min(combo - 1, scale.length - 1)];

    [root, root * 1.5, root * 2].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.03);

      gain.gain.setValueAtTime(0.3 / (idx + 1), now + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.03);
      osc.stop(now + 0.45);
    });
  }

  // صوت السحب والانجذاب المغناطيسي العكسي (Reverse Suction Whoosh)
  playSnapReverse() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.16);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  // صوت صيد العملة الذهبية (Gold Coin Shimmer)
  playCoinPickup() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    [987.77, 1318.51].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.3, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.26);
    });
  }

  // صوت انفجار القنبلة الخارقة (Bomb Explosion)
  playBombBoom() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.42);
  }

  // صوت نبضات الخطر عند اقتراب الكرات من الجمجمة
  playDangerPulse() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  // موسيقى الطبول القبلية في الخلفية (Ambient Tribal Drum Beat)
  startTribalBGM() {
    if (this.bgmTimer) return;
    this.bgmTimer = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      this.bgmStep = (this.bgmStep + 1) % 8;

      // نبضة الطبلة الكبيرة (Low Tribal Tom)
      if (this.bgmStep === 0 || this.bgmStep === 4) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(95, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.19);
      }

      // صوت الخشخيشة المايانية (Shaker/Woodblock)
      if (this.bgmStep % 2 === 1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(this.bgmStep === 3 ? 550 : 380, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    }, 280);
  }

  stopTribalBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // نغمة الفوز الأسطورية (Fanfare)
  playVictory() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [392, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.12);
      gain.gain.setValueAtTime(0.3, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.29);
    });
  }

  // نغمة الخسارة
  playDefeat() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [350, 290, 220, 160];
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + i * 0.16);
      gain.gain.setValueAtTime(0.25, now + i * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.16 + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.16);
      osc.stop(now + i * 0.16 + 0.29);
    });
  }
}

// ==========================================================
// 2. إعدادات كرات زوما وقواها الخارقة (Original Marble Palettes)
// ==========================================================
const ORB_TYPES = [
  { id: 0, name: 'ruby',     cTop: '#ff8a80', cMid: '#d50000', cDark: '#8b0000', glyph: '✹' },
  { id: 1, name: 'amber',    cTop: '#fff59d', cMid: '#ffab00', cDark: '#c67c00', glyph: '★' },
  { id: 2, name: 'emerald',  cTop: '#b9f6ca', cMid: '#00c853', cDark: '#00600f', glyph: '◆' },
  { id: 3, name: 'sapphire', cTop: '#80d8ff', cMid: '#0091ea', cDark: '#01579b', glyph: '▲' },
  { id: 4, name: 'amethyst', cTop: '#ea80fc', cMid: '#aa00ff', cDark: '#4a148c', glyph: '●' }
];

const POWER_TYPES = {
  NORMAL: 0,
  BOMB: 1,      // قنبلة تنفجر في دائرة محيطة
  BACKWARD: 2,  // ترجع السلسلة بأكملها إلى الخلف
  SLOWDOWN: 3   // تبطئ حركة السلسلة لمدة 5 ثوانٍ
};

const ORB_RADIUS = 16;
const ORB_DIAMETER = ORB_RADIUS * 2;

// ==========================================================
// 3. محرك لعبة زوما الرئيسي (Core Engine)
// ==========================================================
class ZumaMasterApp {
  constructor() {
    this.canvas = document.getElementById('zumaCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.audio = new ZumaTribalAudioSystem();

    // حالات اللعبة
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.isPlaying = false;
    this.isPaused = false;
    this.slowdownTimer = 0;
    this.dangerBeepTimer = 0;
    this.screenShake = 0;

    // أبعاد الشاشة المتكيفة
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // المسار والجمجمة
    this.path = [];
    this.pathLength = 0;
    this.skull = { x: 0, y: 0, angle: 0, mouthOpen: 0, isGlowing: false };

    // سلسلة الكرات
    this.chain = [];
    this.marblesSpawned = 0;
    this.totalMarbles = 40;
    this.baseSpeed = 1.0;

    // الضفدع الرامي
    this.frog = {
      x: this.width / 2,
      y: this.height / 2,
      angle: 0,
      currentOrb: 0,
      currentPower: POWER_TYPES.NORMAL,
      nextOrb: 1,
      nextPower: POWER_TYPES.NORMAL,
      radius: 44,
      recoil: 0,
      tongueOut: 0
    };

    // العملة الذهبية المايانية
    this.coin = { x: 0, y: 0, active: false, timer: 0, rot: 0 };

    // المقذوفات والجسيمات ومؤشر التصويب
    this.bullets = [];
    this.particles = [];
    this.popups = [];
    this.isAiming = false;

    this.resizeCanvas();
    this.bindDOMEvents();
    this.buildLevelTrack(this.level);
    this.startAppLoop();
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.resetTransform();
    this.ctx.scale(this.dpr, this.dpr);

    this.frog.x = this.width / 2;
    this.frog.y = this.height / 2;
  }

  // بناء المسارات الحلزونية والمتعرجة الأسطورية
  buildLevelTrack(lvl) {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const raw = [];
    const minDim = Math.min(this.width, this.height);

    if (lvl === 1) {
      // المرحلة الأولى: حلزون المعبد الكلاسيكي
      const steps = 420;
      const turns = 2.4;
      const maxR = minDim * 0.44;
      const minR = minDim * 0.16;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle = t * turns * Math.PI * 2;
        const r = maxR - t * (maxR - minR);
        raw.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r * 0.86 });
      }
    } else if (lvl === 2) {
      // المرحلة الثانية: مسار الأفعى المزدوج المتموج
      const steps = 460;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle = t * Math.PI * 3.6;
        const r = (1 - t) * (minDim * 0.43) + minDim * 0.13;
        const wobble = Math.sin(t * Math.PI * 6) * 35;
        raw.push({ x: cx + Math.cos(angle) * r + wobble, y: cy + Math.sin(angle) * r * 0.9 });
      }
    } else {
      // المرحلة الثالثة وما بعد: دوامة شمس المايا
      const steps = 520;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle = t * Math.PI * 4.4;
        const r = (1 - Math.pow(t, 0.9)) * (minDim * 0.45) + minDim * 0.12;
        raw.push({ x: cx + Math.cos(angle) * r * 1.05, y: cy + Math.sin(angle) * r * 0.82 });
      }
    }

    // إعادة المعايرة بنقاط متساوية بمسافة 2 بكسل لحركة شديدة النعومة (Ultra-smooth 120Hz)
    this.path = [];
    let accumulated = 0;
    const segs = [];
    for (let i = 0; i < raw.length - 1; i++) {
      const p1 = raw[i];
      const p2 = raw[i + 1];
      const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      segs.push({ p1, p2, dist: d, start: accumulated });
      accumulated += d;
    }
    this.pathLength = accumulated;

    for (let d = 0; d <= this.pathLength; d += 2.0) {
      const seg = segs.find(s => d >= s.start && d <= s.start + s.dist) || segs[segs.length - 1];
      const t = (d - seg.start) / (seg.dist || 1);
      const x = seg.p1.x + (seg.p2.x - seg.p1.x) * t;
      const y = seg.p1.y + (seg.p2.y - seg.p1.y) * t;
      const angle = Math.atan2(seg.p2.y - seg.p1.y, seg.p2.x - seg.p1.x);
      this.path.push({ x, y, angle, dist: d });
    }

    const endPoint = this.path[this.path.length - 1];
    this.skull.x = endPoint.x;
    this.skull.y = endPoint.y;
    this.skull.angle = endPoint.angle;
  }

  getPathPoint(d) {
    if (this.path.length === 0) return { x: 0, y: 0, angle: 0 };
    const clamped = Math.max(0, Math.min(d, this.pathLength));
    const idx = Math.min(Math.floor(clamped / 2.0), this.path.length - 1);
    return this.path[idx];
  }

  startLevel(lvl = 1) {
    this.level = lvl;
    this.buildLevelTrack(this.level);
    this.chain = [];
    this.bullets = [];
    this.particles = [];
    this.popups = [];
    this.marblesSpawned = 0;
    this.totalMarbles = 36 + lvl * 12;
    this.baseSpeed = 0.95 + lvl * 0.22;
    this.slowdownTimer = 0;
    this.isPlaying = true;
    this.isPaused = false;

    // تجهيز كرات الضفدع الأولية
    const colors = Math.min(3 + lvl, ORB_TYPES.length);
    this.frog.currentOrb = Math.floor(Math.random() * colors);
    this.frog.currentPower = POWER_TYPES.NORMAL;
    this.frog.nextOrb = Math.floor(Math.random() * colors);
    this.frog.nextPower = this.rollPowerup();

    this.spawnRandomCoin();
    this.audio.startTribalBGM();
    this.updateHUD();
    this.hideAllModals();
  }

  rollPowerup() {
    // احتمالية 15% للحصول على كرة خارقة (قنبلة، إرجاع، إبطاء)
    if (Math.random() < 0.16) {
      const powers = [POWER_TYPES.BOMB, POWER_TYPES.BACKWARD, POWER_TYPES.SLOWDOWN];
      return powers[Math.floor(Math.random() * powers.length)];
    }
    return POWER_TYPES.NORMAL;
  }

  spawnRandomCoin() {
    // وضع العملة في زاوية بعيدة على أطراف المسار
    const offsetAngle = Math.random() * Math.PI * 2;
    const offsetDist = Math.min(this.width, this.height) * 0.38;
    this.coin.x = this.frog.x + Math.cos(offsetAngle) * offsetDist;
    this.coin.y = this.frog.y + Math.sin(offsetAngle) * offsetDist;
    this.coin.active = true;
    this.coin.timer = 500; // مدة بقائها
  }

  bindDOMEvents() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.buildLevelTrack(this.level);
    });

    const triggerAim = (clientX, clientY, shoot = false) => {
      if (!this.isPlaying || this.isPaused) return;
      this.frog.angle = Math.atan2(clientY - this.frog.y, clientX - this.frog.x);
      if (shoot) this.fireOrb();
    };

    // دعم الماوس
    this.canvas.addEventListener('mousemove', (e) => triggerAim(e.clientX, e.clientY, false));
    this.canvas.addEventListener('click', (e) => {
      this.audio.init();
      triggerAim(e.clientX, e.clientY, true);
    });

    // أحداث اللمس الاحترافية لشاشات الهواتف مع دعم التصويب بالليزر
    this.canvas.addEventListener('touchstart', (e) => {
      this.audio.init();
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const distFromFrog = Math.hypot(t.clientX - this.frog.x, t.clientY - this.frog.y);
        // النقر على الضفدع نفسه يبدل الكرات
        if (distFromFrog < this.frog.radius * 1.3) {
          this.swapOrbs();
        } else {
          this.isAiming = true;
          triggerAim(t.clientX, t.clientY, false);
        }
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0 && this.isAiming) {
        triggerAim(e.touches[0].clientX, e.touches[0].clientY, false);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (this.isAiming) {
        this.isAiming = false;
        this.fireOrb();
      }
    });

    // الأزرار
    document.getElementById('btn-swap-ball').addEventListener('click', (e) => {
      e.stopPropagation();
      this.swapOrbs();
    });

    document.getElementById('btn-sound-toggle').addEventListener('click', () => {
      this.audio.init();
      const muted = this.audio.toggleMute();
      document.getElementById('btn-sound-toggle').textContent = muted ? '🔇' : '🔊';
    });

    document.getElementById('btn-pause-game').addEventListener('click', () => this.togglePause());
    document.getElementById('btn-continue-game').addEventListener('click', () => this.togglePause());
    document.getElementById('btn-restart-current').addEventListener('click', () => this.startLevel(this.level));

    document.getElementById('btn-play-now').addEventListener('click', () => {
      this.audio.init();
      this.startLevel(1);
    });
    document.getElementById('btn-next-stage').addEventListener('click', () => {
      this.audio.init();
      this.startLevel(this.level + 1);
    });
    document.getElementById('btn-retry-all').addEventListener('click', () => {
      this.audio.init();
      this.lives = 3;
      this.score = 0;
      this.startLevel(1);
    });
  }

  swapOrbs() {
    const tmpOrb = this.frog.currentOrb;
    const tmpPower = this.frog.currentPower;
    this.frog.currentOrb = this.frog.nextOrb;
    this.frog.currentPower = this.frog.nextPower;
    this.frog.nextOrb = tmpOrb;
    this.frog.nextPower = tmpPower;

    this.audio.playClack();
    this.frog.recoil = 6;
    if (navigator.vibrate) navigator.vibrate(10);
  }

  fireOrb() {
    if (this.bullets.length >= 2) return;
    const speed = 21;
    const spawnDist = this.frog.radius + 6;
    const bx = this.frog.x + Math.cos(this.frog.angle) * spawnDist;
    const by = this.frog.y + Math.sin(this.frog.angle) * spawnDist;

    this.bullets.push({
      x: bx,
      y: by,
      vx: Math.cos(this.frog.angle) * speed,
      vy: Math.sin(this.frog.angle) * speed,
      color: this.frog.currentOrb,
      power: this.frog.currentPower,
      radius: ORB_RADIUS,
      distTraveled: 0
    });

    this.audio.playShoot();
    this.frog.recoil = 10;
    this.frog.tongueOut = 12;
    if (navigator.vibrate) navigator.vibrate(18);

    // تدوير الكرة القادمة
    this.frog.currentOrb = this.frog.nextOrb;
    this.frog.currentPower = this.frog.nextPower;
    this.frog.nextOrb = this.pickWeightedOrbColor();
    this.frog.nextPower = this.rollPowerup();
  }

  pickWeightedOrbColor() {
    if (this.chain.length > 0 && Math.random() < 0.8) {
      return this.chain[Math.floor(Math.random() * this.chain.length)].color;
    }
    const colors = Math.min(3 + this.level, ORB_TYPES.length);
    return Math.floor(Math.random() * colors);
  }

  togglePause() {
    if (!this.isPlaying) return;
    this.isPaused = !this.isPaused;
    const m = document.getElementById('modal-pause');
    if (this.isPaused) {
      m.classList.remove('hidden');
      m.classList.add('show');
    } else {
      m.classList.add('hidden');
      m.classList.remove('show');
    }
  }

  hideAllModals() {
    document.querySelectorAll('.game-modal').forEach(m => {
      m.classList.add('hidden');
      m.classList.remove('show');
    });
  }

  updateHUD() {
    document.getElementById('txt-score').textContent = this.score;
    document.getElementById('txt-level').textContent = this.level;

    const livesBox = document.getElementById('lives-rack');
    livesBox.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const sp = document.createElement('span');
      sp.textContent = '🐸';
      sp.style.opacity = i < this.lives ? '1' : '0.2';
      livesBox.appendChild(sp);
    }

    const total = this.totalMarbles;
    const remaining = total - this.marblesSpawned + this.chain.length;
    const pct = Math.max(0, Math.min(100, Math.floor(((total - remaining) / total) * 100)));
    document.getElementById('zuma-bar-progress').style.width = `${pct}%`;
  }

  // ==========================================================
  // 4. فيزياء اللعبة والمطابقات (Game Physics & Combos)
  // ==========================================================
  update() {
    if (!this.isPlaying || this.isPaused) return;

    if (this.screenShake > 0) this.screenShake *= 0.88;
    if (this.frog.recoil > 0) this.frog.recoil -= 0.8;
    if (this.frog.tongueOut > 0) this.frog.tongueOut -= 1.2;

    // حساب سرعة السلسلة وتأثير الإبطاء
    let currentSpeed = this.baseSpeed;
    if (this.slowdownTimer > 0) {
      this.slowdownTimer--;
      currentSpeed *= 0.3;
    }

    // إنتاج كرات جديدة عند بداية المسار
    if (this.marblesSpawned < this.totalMarbles) {
      if (this.chain.length === 0 || this.chain[0].dist >= ORB_DIAMETER) {
        const colors = Math.min(3 + this.level, ORB_TYPES.length);
        this.chain.unshift({
          dist: 0,
          color: Math.floor(Math.random() * colors),
          power: this.rollPowerup(),
          rollAngle: 0
        });
        this.marblesSpawned++;
      }
    }

    // حركة السلسلة للأمام ودوران الكرات 3D
    if (this.chain.length > 0) {
      this.chain[this.chain.length - 1].dist += currentSpeed;

      for (let i = this.chain.length - 2; i >= 0; i--) {
        const lead = this.chain[i + 1];
        const cur = this.chain[i];
        const target = lead.dist - ORB_DIAMETER;
        if (cur.dist > target) {
          cur.dist = target;
        } else if (cur.dist < target) {
          cur.dist += currentSpeed;
        }
        cur.rollAngle = (cur.dist * 0.08) % (Math.PI * 2);
      }

      // الانجذاب المغناطيسي التلقائي عند إغلاق الثغرات
      this.resolveMagneticSnaps();

      // حالة فم الجمجمة وعيونها المتوهجة
      const head = this.chain[this.chain.length - 1];
      const distRatio = head.dist / this.pathLength;
      this.skull.mouthOpen = Math.max(0, (distRatio - 0.7) * 3.3);
      this.skull.isGlowing = distRatio > 0.75;

      if (this.skull.isGlowing) {
        this.dangerBeepTimer++;
        if (this.dangerBeepTimer % 32 === 0) {
          this.audio.playDangerPulse();
          if (navigator.vibrate) navigator.vibrate(25);
        }
      }

      // الخسارة عند دخول الجمجمة
      if (head.dist >= this.pathLength - 16) {
        this.handleLifeLoss();
        return;
      }
    } else if (this.marblesSpawned >= this.totalMarbles) {
      this.handleStageVictory();
      return;
    }

    // تحديث العملة الذهبية
    if (this.coin.active) {
      this.coin.rot += 0.04;
      this.coin.timer--;
      if (this.coin.timer <= 0) this.coin.active = false;
    }

    // تحديث المقذوفات
    this.updateBullets();

    // تحديث المؤثرات البصرية
    this.updateParticles();

    this.updateHUD();
  }

  resolveMagneticSnaps() {
    for (let i = 0; i < this.chain.length - 1; i++) {
      const cur = this.chain[i];
      const next = this.chain[i + 1];
      const gap = next.dist - cur.dist - ORB_DIAMETER;

      if (gap > 2 && cur.color === next.color) {
        const pull = Math.min(9.0, gap * 0.45 + 2);
        for (let k = 0; k <= i; k++) {
          this.chain[k].dist += pull;
        }

        if (next.dist - cur.dist <= ORB_DIAMETER + 1) {
          this.audio.playSnapReverse();
          this.checkMatchCombos(i, 2);
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
      b.distTraveled += Math.hypot(b.vx, b.vy);

      // صيد العملة الذهبية بالمقذوف
      if (this.coin.active && Math.hypot(b.x - this.coin.x, b.y - this.coin.y) < 26) {
        this.coin.active = false;
        this.score += 500;
        this.audio.playCoinPickup();
        this.createCoinSparks(this.coin.x, this.coin.y);
        this.addPopupText(this.coin.x, this.coin.y, '+500 🪙');
      }

      // الخروج خارج حدود الشاشة
      if (b.x < -30 || b.x > this.width + 30 || b.y < -30 || b.y > this.height + 30) {
        this.bullets.splice(i, 1);
        continue;
      }

      // فحص الاصطدام بالكرات في السلسلة
      for (let c = 0; c < this.chain.length; c++) {
        const marble = this.chain[c];
        const pos = this.getPathPoint(marble.dist);
        if (Math.hypot(b.x - pos.x, b.y - pos.y) <= ORB_RADIUS + b.radius) {
          this.insertBulletIntoChain(c, b);
          this.bullets.splice(i, 1);
          break;
        }
      }
    }
  }

  insertBulletIntoChain(hitIdx, bullet) {
    const hitOrb = this.chain[hitIdx];
    const hitPos = this.getPathPoint(hitOrb.dist);
    const dot = (bullet.x - hitPos.x) * Math.cos(hitPos.angle) + (bullet.y - hitPos.y) * Math.sin(hitPos.angle);

    let insertIdx = dot > 0 ? hitIdx + 1 : hitIdx;
    let dist = dot > 0 ? hitOrb.dist + ORB_DIAMETER : Math.max(0, hitOrb.dist - ORB_DIAMETER);

    this.chain.splice(insertIdx, 0, {
      dist: dist,
      color: bullet.color,
      power: bullet.power,
      rollAngle: 0
    });

    this.audio.playClack();

    // إزاحة الكرات السابقة
    for (let k = 0; k < insertIdx; k++) {
      this.chain[k].dist = Math.max(0, this.chain[k].dist - ORB_DIAMETER);
    }

    // فحص التطابق أو تفعيل القوى
    this.checkMatchCombos(insertIdx, 1);
  }

  checkMatchCombos(idx, comboMultiplier = 1) {
    if (idx < 0 || idx >= this.chain.length) return;
    const targetColor = this.chain[idx].color;
    let start = idx;
    let end = idx;

    while (start > 0 && this.chain[start - 1].color === targetColor) start--;
    while (end < this.chain.length - 1 && this.chain[end + 1].color === targetColor) end++;

    const count = end - start + 1;
    if (count >= 3) {
      // تفجير الكرات المتطابقة
      let hasBomb = false;
      let hasBackward = false;
      let hasSlow = false;

      for (let k = start; k <= end; k++) {
        if (this.chain[k].power === POWER_TYPES.BOMB) hasBomb = true;
        if (this.chain[k].power === POWER_TYPES.BACKWARD) hasBackward = true;
        if (this.chain[k].power === POWER_TYPES.SLOWDOWN) hasSlow = true;
      }

      const points = count * 100 * comboMultiplier;
      this.score += points;

      const centerPos = this.getPathPoint(this.chain[Math.floor((start + end) / 2)].dist);
      this.createGemBurst(centerPos.x, centerPos.y, targetColor, count);
      this.addPopupText(centerPos.x, centerPos.y, `+${points}${comboMultiplier > 1 ? ' COMBO x' + comboMultiplier : ''}`);
      this.audio.playComboChime(comboMultiplier);

      if (navigator.vibrate) navigator.vibrate(comboMultiplier > 1 ? [30, 20, 50] : 30);

      // تفعيل القوى الخارقة إن وجدت
      if (hasBomb) {
        this.triggerBombPower(centerPos.x, centerPos.y, start);
      }
      if (hasBackward) {
        this.triggerBackwardPower();
      }
      if (hasSlow) {
        this.slowdownTimer = 220; // إبطاء لمدة ~5 ثوانٍ
        this.addPopupText(this.frog.x, this.frog.y - 60, '❄️ تباطؤ زمني!');
      }

      this.chain.splice(start, count);
    }
  }

  triggerBombPower(x, y, atIndex) {
    this.audio.playBombBoom();
    this.screenShake = 14;
    this.addPopupText(x, y, '💣 انفجار خارق!');
    // إزالة كرتين قبل وكرتين بعد موقع القنبلة
    const removeStart = Math.max(0, atIndex - 2);
    const removeCount = Math.min(5, this.chain.length - removeStart);
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        color: '#ff9800',
        size: 5 + Math.random() * 4,
        alpha: 1, decay: 0.03
      });
    }
    this.chain.splice(removeStart, removeCount);
  }

  triggerBackwardPower() {
    this.audio.playSnapReverse();
    this.addPopupText(this.frog.x, this.frog.y - 60, '⏪ تراجع السلسلة!');
    for (let i = 0; i < this.chain.length; i++) {
      this.chain[i].dist = Math.max(0, this.chain[i].dist - 140);
    }
  }

  createGemBurst(x, y, colorId, count) {
    const pal = ORB_TYPES[colorId];
    for (let i = 0; i < count * 9; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 2.5 + Math.random() * 6.5;
      this.particles.push({
        x: x, y: y,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        color: Math.random() > 0.4 ? pal.cMid : pal.cTop,
        size: 3 + Math.random() * 3.5,
        alpha: 1, decay: 0.025
      });
    }
  }

  createCoinSparks(x, y) {
    for (let i = 0; i < 20; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 3 + Math.random() * 5;
      this.particles.push({
        x: x, y: y,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        color: '#ffd700',
        size: 3.5,
        alpha: 1, decay: 0.03
      });
    }
  }

  addPopupText(x, y, txt) {
    this.popups.push({ x: x, y: y, txt: txt, alpha: 1.0 });
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.y -= 1.3;
      pop.alpha -= 0.018;
      if (pop.alpha <= 0) this.popups.splice(i, 1);
    }
  }

  handleLifeLoss() {
    this.lives--;
    this.audio.playDefeat();
    this.updateHUD();

    if (this.lives <= 0) {
      this.isPlaying = false;
      this.audio.stopTribalBGM();
      document.getElementById('over-score-txt').textContent = this.score;
      const m = document.getElementById('modal-gameover');
      m.classList.remove('hidden');
      m.classList.add('show');
    } else {
      this.startLevel(this.level);
    }
  }

  handleStageVictory() {
    this.isPlaying = false;
    this.audio.stopTribalBGM();
    this.audio.playVictory();
    document.getElementById('win-score-txt').textContent = this.score;
    const m = document.getElementById('modal-win');
    m.classList.remove('hidden');
    m.classList.add('show');
  }

  // ==========================================================
  // 5. محرك الرسم والتجسيم ثلاثي الأبعاد (High-End Render Engine)
  // ==========================================================
  draw() {
    this.ctx.save();
    // اهتزاز الشاشة السينمائي عند الانفجارات
    if (this.screenShake > 0.5) {
      const sx = (Math.random() - 0.5) * this.screenShake;
      const sy = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(sx, sy);
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. أرضية معبد المايا الأثرية
    this.drawMayanTempleFloor();

    // 2. مجرى الحجر المنحوت الغائر (Stone Track)
    this.drawStoneTrack();

    // 3. العملة الذهبية المايانية
    this.drawMayanGoldCoin();

    // 4. فم الجمجمة الذهبية
    this.drawMayanSkullPit();

    // 5. كرات السلسلة ثلاثية الأبعاد
    for (let i = 0; i < this.chain.length; i++) {
      const m = this.chain[i];
      const pos = this.getPathPoint(m.dist);
      this.draw3DRollingOrb(pos.x, pos.y, m.color, m.power, m.rollAngle, ORB_RADIUS);
    }

    // 6. المقذوفات النارية
    for (let i = 0; i < this.bullets.length; i++) {
      const b = this.bullets[i];
      this.draw3DRollingOrb(b.x, b.y, b.color, b.power, 0, b.radius);
    }

    // 7. شعاع التصويب الذهبي (Laser Aiming Guide)
    if (this.isAiming) {
      this.drawLaserSight();
    }

    // 8. ضفدع زوما الأسطوري
    this.drawAuthenticZumaFrog();

    // 9. الجسيمات والنصوص العائمة
    this.drawVisualFX();

    this.ctx.restore();
  }

  drawMayanTempleFloor() {
    // نقوش أثرية على بلاط المعبد
    this.ctx.save();
    const cx = this.width / 2;
    const cy = this.height / 2;
    
    // الدائرة الشمسية الكبرى في مركز المعبد
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, Math.min(this.width, this.height) * 0.44, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(255, 179, 0, 0.05)';
    this.ctx.lineWidth = 14;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, Math.min(this.width, this.height) * 0.28, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.lineWidth = 4;
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawStoneTrack() {
    if (this.path.length < 2) return;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.path[0].x, this.path[0].y);
    for (let i = 1; i < this.path.length; i += 3) {
      this.ctx.lineTo(this.path[i].x, this.path[i].y);
    }
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // الظل الغائر للحفرة الحجرية
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.lineWidth = ORB_DIAMETER + 10;
    this.ctx.stroke();

    // إطار الحجر الرملي المشطوف
    this.ctx.strokeStyle = '#18333b';
    this.ctx.lineWidth = ORB_DIAMETER + 4;
    this.ctx.stroke();

    // عمق المسار المظلم
    this.ctx.strokeStyle = '#051114';
    this.ctx.lineWidth = ORB_DIAMETER - 2;
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawLaserSight() {
    this.ctx.save();
    const len = 320;
    const ex = this.frog.x + Math.cos(this.frog.angle) * len;
    const ey = this.frog.y + Math.sin(this.frog.angle) * len;

    this.ctx.beginPath();
    this.ctx.moveTo(this.frog.x + Math.cos(this.frog.angle) * this.frog.radius, this.frog.y + Math.sin(this.frog.angle) * this.frog.radius);
    this.ctx.lineTo(ex, ey);
    this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.45)';
    this.ctx.lineWidth = 2.5;
    this.ctx.setLineDash([8, 6]);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawMayanGoldCoin() {
    if (!this.coin.active) return;
    this.ctx.save();
    this.ctx.translate(this.coin.x, this.coin.y);
    this.ctx.rotate(this.coin.rot);

    // توهج العملة الذهبية
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 18, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255, 215, 0, 0.25)';
    this.ctx.fill();

    // قرص الشمس الذهبي
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 14, 0, Math.PI * 2);
    const g = this.ctx.createRadialGradient(-4, -4, 2, 0, 0, 14);
    g.addColorStop(0, '#fff9c4');
    g.addColorStop(0.5, '#ffd700');
    g.addColorStop(1, '#ff8f00');
    this.ctx.fillStyle = g;
    this.ctx.fill();
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    // نقش الشمس
    this.ctx.fillStyle = '#b78103';
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('☼', 0, 0);

    this.ctx.restore();
  }

  drawMayanSkullPit() {
    this.ctx.save();
    this.ctx.translate(this.skull.x, this.skull.y);
    this.ctx.rotate(this.skull.angle);

    // توهج الخطر الأحمر النابض
    if (this.skull.isGlowing) {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 36, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 23, 68, 0.35)';
      this.ctx.fill();
    }

    // فم الحفرة الأسود العميق
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 24, 0, Math.PI * 2);
    this.ctx.fillStyle = '#000';
    this.ctx.fill();

    // هيكل الجمجمة الحجرية
    this.ctx.fillStyle = this.skull.isGlowing ? '#ff5252' : '#78909c';
    this.ctx.strokeStyle = '#263238';
    this.ctx.lineWidth = 2;

    // رأس الجمجمة
    this.ctx.beginPath();
    this.ctx.arc(0, -6, 20, Math.PI, 0, false);
    this.ctx.lineTo(12, 14);
    this.ctx.lineTo(-12, 14);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // فتحات العيون المتوهجة
    this.ctx.fillStyle = this.skull.isGlowing ? '#ffebee' : '#102027';
    this.ctx.beginPath();
    this.ctx.arc(-7, -4, 4.5, 0, Math.PI * 2);
    this.ctx.arc(7, -4, 4.5, 0, Math.PI * 2);
    this.ctx.fill();

    // فك الأسنان الحجرية يفتح ويغلق بحسب اقتراب الكرات
    const jawDrop = this.skull.mouthOpen * 6;
    this.ctx.fillStyle = '#eceff1';
    for (let t = -8; t <= 8; t += 4) {
      this.ctx.fillRect(t - 1, 8 + jawDrop, 2.5, 4);
    }

    this.ctx.restore();
  }

  // رسم الكرات ثلاثية الأبعاد اللامعة مع نقوش الدوران وقوى الباور-آب
  draw3DRollingOrb(x, y, colorId, power, rollAngle, radius) {
    const pal = ORB_TYPES[colorId];
    this.ctx.save();

    // ظل الكرة على أرضية المعبد
    this.ctx.beginPath();
    this.ctx.arc(x + 3, y + 4, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    this.ctx.fill();

    // التدرج الكروي الزجاجي ثلاثي الأبعاد
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    const grad = this.ctx.createRadialGradient(
      x - radius * 0.35, y - radius * 0.35, radius * 0.08,
      x, y, radius
    );
    grad.addColorStop(0, pal.cTop);
    grad.addColorStop(0.35, pal.cMid);
    grad.addColorStop(1, pal.cDark);

    this.ctx.fillStyle = grad;
    this.ctx.fill();

    // رسم تأثير الكرة الخارقة إن وجد
    if (power === POWER_TYPES.BOMB) {
      this.ctx.fillStyle = '#ffea00';
      this.ctx.font = 'bold 13px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('💣', x, y);
    } else if (power === POWER_TYPES.BACKWARD) {
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 12px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('⏪', x, y);
    } else if (power === POWER_TYPES.SLOWDOWN) {
      this.ctx.fillStyle = '#e0f7fa';
      this.ctx.font = 'bold 12px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('❄️', x, y);
    } else {
      // النقش الماياني الداخلي المتدحرج مع فيزياء الـ 3D
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rollAngle);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.font = `bold ${radius * 0.85}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(pal.glyph, 0, 0);
      this.ctx.restore();
    }

    // لمعان زجاجي علوي شديد النقاء (Specular Glint)
    this.ctx.beginPath();
    this.ctx.arc(x - radius * 0.32, y - radius * 0.32, radius * 0.28, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    this.ctx.fill();

    this.ctx.restore();
  }

  // رسم ضفدع زوما الحجري الكلاسيكي بكافة تفاصيل الصورة المرفقة
  drawAuthenticZumaFrog() {
    this.ctx.save();
    this.ctx.translate(this.frog.x, this.frog.y);
    this.ctx.rotate(this.frog.angle);

    const r = this.frog.radius;

    // 1. قاعدة الدرع الحجري البني المنحوت
    this.ctx.beginPath();
    this.ctx.arc(-4 - this.frog.recoil, 0, r, 0, Math.PI * 2);
    const shellGrad = this.ctx.createRadialGradient(-10, -10, 5, 0, 0, r);
    shellGrad.addColorStop(0, '#8d6e63');
    shellGrad.addColorStop(0.7, '#4e342e');
    shellGrad.addColorStop(1, '#271915');
    this.ctx.fillStyle = shellGrad;
    this.ctx.fill();
    this.ctx.strokeStyle = '#ffb300';
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // 2. يدا الضفدع الأخضران الممسكتان بالحافة
    this.ctx.fillStyle = '#43a047';
    this.ctx.strokeStyle = '#1b5e20';
    this.ctx.lineWidth = 2;
    // اليد اليمنى واليسرى
    [-24, 24].forEach(offsetY => {
      this.ctx.beginPath();
      this.ctx.ellipse(r * 0.4, offsetY, 10, 7, offsetY > 0 ? 0.3 : -0.3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    });

    // 3. رأس الضفدع الأخضر اللامع
    this.ctx.beginPath();
    this.ctx.ellipse(8 - this.frog.recoil, 0, 26, 22, 0, 0, Math.PI * 2);
    const headGrad = this.ctx.createRadialGradient(8, -4, 4, 8, 0, 26);
    headGrad.addColorStop(0, '#76ff03');
    headGrad.addColorStop(0.6, '#43a047');
    headGrad.addColorStop(1, '#1b5e20');
    this.ctx.fillStyle = headGrad;
    this.ctx.fill();
    this.ctx.stroke();

    // 4. عيون الضفدع الكرتونية البارزة مع بؤبؤ متتبع
    [-18, 18].forEach(eyeY => {
      // مقلة العين
      this.ctx.beginPath();
      this.ctx.arc(16 - this.frog.recoil, eyeY, 11, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();
      this.ctx.strokeStyle = '#1b5e20';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // البؤبؤ الأزرق الكبير
      this.ctx.beginPath();
      this.ctx.arc(18 - this.frog.recoil, eyeY, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = '#0288d1';
      this.ctx.fill();

      // بؤبؤ داخلي أسود
      this.ctx.beginPath();
      this.ctx.arc(19 - this.frog.recoil, eyeY, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#000000';
      this.ctx.fill();

      // نقطة بريق العين الأبيض
      this.ctx.beginPath();
      this.ctx.arc(16 - this.frog.recoil, eyeY - 2, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();
    });

    // 5. فم الضفدع الحاضن للكرة الحالية الجاهزة للإطلاق
    this.ctx.beginPath();
    this.ctx.arc(28 - this.frog.recoil + this.frog.tongueOut, 0, 14, 0, Math.PI * 2);
    this.ctx.fillStyle = '#b71c1c';
    this.ctx.fill();

    // الكرة الحالية في الفم
    this.draw3DRollingOrb(
      28 - this.frog.recoil + this.frog.tongueOut,
      0,
      this.frog.currentOrb,
      this.frog.currentPower,
      0,
      ORB_RADIUS
    );

    // 6. الكرة الاحتياطية التالية على ظهر الضفدع (Next Ball)
    this.draw3DRollingOrb(
      -18 - this.frog.recoil,
      0,
      this.frog.nextOrb,
      this.frog.nextPower,
      0,
      ORB_RADIUS - 4
    );

    this.ctx.restore();
  }

  drawVisualFX() {
    // رسم الشرارات والجزيئات المتناثرة
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // رسم نصوص النقاط والكومبو العائمة
    for (let i = 0; i < this.popups.length; i++) {
      const pop = this.popups[i];
      this.ctx.save();
      this.ctx.globalAlpha = pop.alpha;
      this.ctx.fillStyle = '#ffeb3b';
      this.ctx.shadowColor = '#000';
      this.ctx.shadowBlur = 4;
      this.ctx.font = '900 17px Tajawal, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(pop.txt, pop.x, pop.y);
      this.ctx.restore();
    }
  }

  startAppLoop() {
    const loop = () => {
      this.update();
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// بدء التطبيق فور جهوزية الشاشة
window.addEventListener('DOMContentLoaded', () => {
  new ZumaMasterApp();
});
