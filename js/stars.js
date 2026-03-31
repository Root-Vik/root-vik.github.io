/* ============================================
   STAR PARTICLES — Shining stars + silver lines
   Lightweight canvas animation
   ============================================ */
(function () {
  function boot() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, stars = [], lines = [];

    function resize() {
      w = canvas.width = document.documentElement.clientWidth || window.innerWidth;
      h = canvas.height = Math.max(document.body.scrollHeight, window.innerHeight * 3);
    }

  // Star particle
  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 1.8 + 0.3;
      this.speed = Math.random() * 0.15 + 0.02;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      // Purple to pink color
      const t = Math.random();
      if (t < 0.4) {
        this.color = '0,210,255';    // cyan
      } else if (t < 0.65) {
        this.color = '99,102,241';   // indigo
      } else if (t < 0.82) {
        this.color = '148,163,184';  // silver-blue
      } else {
        this.color = '224,231,255';  // periwinkle white
      }
    }
    update() {
      this.y -= this.speed;
      this.pulse += this.pulseSpeed;
      if (this.y < -10) {
        this.y = h + 10;
        this.x = Math.random() * w;
      }
    }
    draw() {
      const glow = Math.sin(this.pulse) * 0.3 + 0.7;
      const a = this.opacity * glow;
      ctx.beginPath();
      ctx.arc(this.x, this.y - window.scrollY * 0.3, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${a})`;
      ctx.fill();
      // Shimmer glow
      if (this.size > 1.2) {
        ctx.beginPath();
        ctx.arc(this.x, this.y - window.scrollY * 0.3, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${a * 0.12})`;
        ctx.fill();
      }
    }
  }

  // Silver shooting line
  class ShootingLine {
    constructor() { this.reset(); }
    reset() {
      this.active = false;
      this.timer = Math.random() * 600 + 200;
    }
    activate() {
      this.active = true;
      this.x = Math.random() * w;
      this.y = Math.random() * h * 0.6;
      this.len = Math.random() * 120 + 60;
      this.angle = Math.random() * 0.4 - 0.2 + Math.PI * 0.25;
      this.speed = Math.random() * 3 + 2;
      this.opacity = 0.6;
      this.life = 0;
      this.maxLife = this.len / this.speed + 20;
    }
    update() {
      if (!this.active) {
        this.timer--;
        if (this.timer <= 0) this.activate();
        return;
      }
      this.life++;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity = Math.max(0, 0.6 * (1 - this.life / this.maxLife));
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      if (!this.active) return;
      const yOff = -window.scrollY * 0.3;
      const tailX = this.x - Math.cos(this.angle) * this.len * 0.7;
      const tailY = this.y - Math.sin(this.angle) * this.len * 0.7;
      const grad = ctx.createLinearGradient(tailX, tailY + yOff, this.x, this.y + yOff);
      grad.addColorStop(0, `rgba(0,210,255,0)`);
      grad.addColorStop(1, `rgba(0,210,255,${this.opacity})`);
      ctx.beginPath();
      ctx.moveTo(tailX, tailY + yOff);
      ctx.lineTo(this.x, this.y + yOff);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function init() {
    resize();
    stars = [];
    lines = [];
    const count = Math.min(Math.floor(w * h / 8000), 200);
    for (let i = 0; i < count; i++) stars.push(new Star());
    for (let i = 0; i < 4; i++) lines.push(new ShootingLine());
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => { s.update(); s.draw(); });
    lines.forEach(l => { l.update(); l.draw(); });
    requestAnimationFrame(animate);
  }

    window.addEventListener('resize', () => { resize(); init(); });
    init();
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
