/**
 * إعدادات الأصول والوسائط الخارجية (External Assets Configuration)
 * يمكنك هنا وضع روابط مباشرة لملفات صورك وأصواتك (PNG, JPG, SVG, MP3, WAV)
 * أو مسارات محلية داخل مستودعك مثل 'assets/images/frog.png'
 */
const GAME_ASSETS_CONFIG = {
  // 1. مكتبة الصور والأشكال الخارجية
  images: {
    // صورة الضفدع الرامي (خلفية شفافة PNG أو SVG)
    frog: '', // مثال: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png' أو مسار محلي
    // صورة خلفية المعبد
    background: '', // مثال: 'assets/images/temple_bg.jpg'
    // صورة فم الجمجمة أو الثقب النهائي
    skull: '', // مثال: 'https://cdn-icons-png.flaticon.com/512/3069/3069224.png'
    // قوام وزخارف الكرات الخارجية (يمكن استخدام صور لكل لون)
    marbles: {
      ruby: '',     // أحمر
      sapphire: '', // أزرق
      emerald: '',  // أخضر
      amber: '',    // أصفر
      amethyst: ''  // بنفسجي
    }
  },

  // 2. مكتبة الأصوات والموسيقى الخارجية
  audio: {
    // موسيقى خلفية المعبد (Looping BGM)
    bgm: '', // مثال: 'https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3'
    // صوت الإطلاق
    shoot: '', // مثال: 'assets/audio/shoot.mp3'
    // صوت تفجير الكرات والمطابقة
    match: '', // مثال: 'assets/audio/pop.mp3'
    // صوت التصادم والدخول في السلسلة
    insert: '', // مثال: 'assets/audio/click.mp3'
    // صوت سحب الكرات المغناطيسي المتتالي
    snap: '',
    // صوت الفوز بالمرحلة
    victory: '',
    // صوت الخسارة
    gameover: ''
  }
};

/**
 * مدير تحميل الوسائط مع دعم الـ Fallback التلقائي
 */
class AssetManager {
  constructor(config) {
    this.config = config;
    this.images = {};
    this.sounds = {};
    this.isLoaded = false;
  }

  async loadAll(onProgress) {
    const imgKeys = Object.keys(this.config.images);
    const audioKeys = Object.keys(this.config.audio);
    let total = imgKeys.length + audioKeys.length;
    let current = 0;

    const report = () => {
      current++;
      if (onProgress) onProgress(Math.floor((current / total) * 100));
    };

    // تحميل الصور
    for (const key of imgKeys) {
      const src = this.config.images[key];
      if (typeof src === 'string' && src.trim() !== '') {
        try {
          this.images[key] = await this.loadImage(src);
        } catch (e) {
          console.warn(`تعذر تحميل الصورة الخارجية [${key}]، سيتم استخدام الرسم الإجرائي البديل:`, e);
          this.images[key] = null;
        }
      } else {
        this.images[key] = null;
      }
      report();
    }

    // تحميل الأصوات
    for (const key of audioKeys) {
      const src = this.config.audio[key];
      if (typeof src === 'string' && src.trim() !== '') {
        try {
          const audio = new Audio();
          audio.src = src;
          audio.preload = 'auto';
          this.sounds[key] = audio;
        } catch (e) {
          console.warn(`تعذر تحميل الصوت الخارجي [${key}]، سيتم تفعيل محاكي الصوت الرقمي:`, e);
          this.sounds[key] = null;
        }
      } else {
        this.sounds[key] = null;
      }
      report();
    }

    this.isLoaded = true;
    return true;
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  }

  playSound(name, fallbackFunc) {
    const sound = this.sounds[name];
    if (sound) {
      try {
        sound.currentTime = 0;
        sound.play().catch(() => {
          if (fallbackFunc) fallbackFunc();
        });
      } catch (err) {
        if (fallbackFunc) fallbackFunc();
      }
    } else {
      if (fallbackFunc) fallbackFunc();
    }
  }

  playBGM() {
    const bgm = this.sounds['bgm'];
    if (bgm) {
      bgm.loop = true;
      bgm.volume = 0.5;
      bgm.play().catch(() => {});
    }
  }
}
