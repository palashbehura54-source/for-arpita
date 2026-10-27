/**
 * ============================================================================
 * A LITTLE SORRY, ARPITA 💗
 * Interactive logic, Web Audio ambient player, canvas particles, and choices
 * ============================================================================
 */

(function () {
  'use strict';

  // --- Accessibility Check for Reduced Motion ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. AMBIENT PARTICLES (CANVAS HEARTS & PETALS)
     ========================================================================== */
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const maxParticles = prefersReducedMotion ? 0 : (window.innerWidth < 600 ? 18 : 32);

  // Particle types
  const PARTICLE_TYPES = ['heart', 'petal', 'sparkle'];
  const COLORS = ['#FF8FA3', '#FFCCD5', '#FFAEC0', '#FF5E7E', '#EADCF8'];

  class Particle {
    constructor(x, y, isBurst = false, angle = 0, speed = 0) {
      this.x = x ?? Math.random() * width;
      this.y = y ?? (isBurst ? y : height + Math.random() * 50);
      this.type = PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)];
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.size = Math.random() * 12 + 8;
      this.isBurst = isBurst;
      this.opacity = isBurst ? 1 : Math.random() * 0.6 + 0.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;

      if (isBurst) {
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.08;
        this.decay = Math.random() * 0.015 + 0.01;
      } else {
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -(Math.random() * 1.2 + 0.6);
      }
    }

    update() {
      if (this.isBurst) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.opacity -= this.decay;
        this.rotation += this.rotSpeed * 2;
      } else {
        this.x += this.vx + Math.sin(this.y * 0.01) * 0.3;
        this.y += this.vy;
        this.rotation += this.rotSpeed;

        if (this.y < -30) {
          this.y = height + 20;
          this.x = Math.random() * width;
        }
      }
    }

    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      if (this.type === 'heart') {
        const s = this.size * 0.5;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.2, s * 0.5, 0, s * 1.3);
        ctx.bezierCurveTo(s * 1.2, s * 0.5, s, -s * 0.5, 0, s * 0.3);
        ctx.fill();
      } else if (this.type === 'petal') {
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.3, this.size * 0.7, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Twinkle sparkle
        const r = this.size * 0.4;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * Math.PI) / 2) * r, Math.sin((i * Math.PI) / 2) * r);
          ctx.lineTo(
            Math.cos(((i + 0.5) * Math.PI) / 2) * (r * 0.3),
            Math.sin(((i + 0.5) * Math.PI) / 2) * (r * 0.3)
          );
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Create ambient particles
  for (let i = 0; i < maxParticles; i++) {
    const p = new Particle();
    p.y = Math.random() * height; // Spread across initial screen
    particles.push(p);
  }

  // Heart burst helper function
  function createBurst(x, y, count = 20, type = null) {
    if (prefersReducedMotion) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      const p = new Particle(x, y, true, angle, speed);
      if (type) p.type = type;
      particles.push(p);
    }
  }

  // Animation Loop
  let isTabActive = true;
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
  });

  function animateParticles() {
    if (isTabActive && !prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);

        if (p.isBurst && p.opacity <= 0) {
          particles.splice(i, 1);
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  requestAnimationFrame(animateParticles);

  // Resize listener
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  /* ==========================================================================
     2. GENTLE AMBIENT MUSIC (WEB AUDIO API - MUTED BY DEFAULT)
     ========================================================================== */
  class MusicBoxPlayer {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.masterGain = null;
      this.step = 0;
      this.intervalId = null;

      // Soothing Lullaby Arpeggio (Frequencies in Hz: C4, E4, G4, A4, B4, C5, D5, E5)
      // Chords: Cmaj7 -> Am7 -> Fmaj7 -> Gsus4
      this.chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 261.63, 329.63, 349.23], // Fmaj7
        [196.00, 293.66, 392.00, 440.00]  // Gsus4 / G
      ];
    }

    init() {
      if (this.ctx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

      // Lowpass filter for warm, music-box softness
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      this.masterGain.connect(this.filter);
      this.filter.connect(this.ctx.destination);
    }

    playNote(freq) {
      if (!this.ctx || !this.isPlaying) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Music box bell timbre (triangle with soft overtone)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Delicate envelope (fast attack, sweet chime ring-down)
      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.28, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.9);
    }

    start() {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.isPlaying = true;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.4, this.ctx.currentTime + 1);

      this.step = 0;
      this.playStep();
      this.intervalId = setInterval(() => this.playStep(), 600);
    }

    playStep() {
      if (!this.isPlaying) return;
      const chordIndex = Math.floor(this.step / 8) % this.chords.length;
      const currentChord = this.chords[chordIndex];
      const noteIndex = this.step % 4;

      // Play arpeggiated note from current chord
      const freq = currentChord[noteIndex];
      this.playNote(freq);

      // Occasionally add an upper octave sparkle
      if (this.step % 4 === 2 && Math.random() > 0.4) {
        this.playNote(freq * 2);
      }

      this.step++;
    }

    stop() {
      if (!this.isPlaying) return;
      this.isPlaying = false;
      if (this.intervalId) clearInterval(this.intervalId);

      if (this.masterGain && this.ctx) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      }
    }

    toggle() {
      if (this.isPlaying) {
        this.stop();
        return false;
      } else {
        this.start();
        return true;
      }
    }
  }

  const musicPlayer = new MusicBoxPlayer();
  const musicToggleBtn = document.getElementById('music-toggle');
  const musicLabel = musicToggleBtn.querySelector('.music-label');

  musicToggleBtn.addEventListener('click', (e) => {
    const isNowPlaying = musicPlayer.toggle();
    musicToggleBtn.setAttribute('aria-pressed', isNowPlaying ? 'true' : 'false');
    musicLabel.textContent = isNowPlaying ? 'Music: Playing 🎶' : 'Music: Off';

    // Particle burst on click
    const rect = musicToggleBtn.getBoundingClientRect();
    createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10, 'sparkle');
  });

  /* ==========================================================================
     3. SCREEN 1: "OPEN YOUR LITTLE SURPRISE" CTA
     ========================================================================== */
  const openSurpriseBtn = document.getElementById('open-surprise-btn');
  const letterSection = document.getElementById('screen-letter');

  openSurpriseBtn.addEventListener('click', (e) => {
    const rect = openSurpriseBtn.getBoundingClientRect();
    createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 28, 'heart');

    // Smooth scroll down to letter
    letterSection.scrollIntoView({ behavior: 'smooth' });

    // Focus on the letter heading for accessibility
    const letterHeading = document.getElementById('letter-heading');
    if (letterHeading) {
      letterHeading.setAttribute('tabindex', '-1');
      letterHeading.focus({ preventScroll: true });
    }
  });

  /* ==========================================================================
     4. SCREEN 3: VIRTUAL HUG INTERACTION
     ========================================================================== */
  const hugBtn = document.getElementById('hug-btn');
  const hugResponseBox = document.getElementById('hug-response-box');

  hugBtn.addEventListener('click', (e) => {
    // Show the sweet response message
    hugResponseBox.classList.remove('hidden');

    // Shower of floating hearts around the button & teddy
    const rect = hugBtn.getBoundingClientRect();
    createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35, 'heart');

    // Scroll slightly so the response box is in comfortable view if on small screens
    setTimeout(() => {
      hugResponseBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  });

  /* ==========================================================================
     5. SCREEN 5: THREE APOLOGY RESPONSE BUTTONS (LET HER CHOOSE)
     ========================================================================== */
  const choiceBtnA = document.getElementById('choice-btn-a');
  const choiceBtnB = document.getElementById('choice-btn-b');
  const choiceBtnC = document.getElementById('choice-btn-c');

  const panelA = document.getElementById('response-panel-a');
  const panelB = document.getElementById('response-panel-b');
  const panelC = document.getElementById('response-panel-c');

  const allButtons = [
    { btn: choiceBtnA, panel: panelA, burstType: 'heart', burstCount: 30 },
    { btn: choiceBtnB, panel: panelB, burstType: 'heart', burstCount: 35 },
    { btn: choiceBtnC, panel: panelC, burstType: 'petal', burstCount: 25 }
  ];

  allButtons.forEach(({ btn, panel, burstType, burstCount }) => {
    btn.addEventListener('click', () => {
      // Deactivate all panels and buttons
      allButtons.forEach((item) => {
        item.btn.setAttribute('aria-expanded', 'false');
        item.panel.classList.add('hidden');
      });

      // Activate selected
      btn.setAttribute('aria-expanded', 'true');
      panel.classList.remove('hidden');

      // Heart/petal burst from the clicked button
      const rect = btn.getBoundingClientRect();
      createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, burstCount, burstType);

      // Smooth scroll gently into view
      setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    });
  });

  /* ==========================================================================
     6. DELIGHTFUL CLICK/TAP BURST EVERYWHERE ON THE PAGE
     ========================================================================== */
  window.addEventListener('click', (e) => {
    // Don't duplicate burst on buttons that have their own custom burst
    if (
      e.target.closest('button') ||
      e.target.closest('a')
    ) {
      return;
    }
    createBurst(e.clientX, e.clientY, 8, 'heart');
  });

})();
