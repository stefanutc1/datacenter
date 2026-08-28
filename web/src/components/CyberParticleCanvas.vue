<template>
  <canvas ref="canvasRef" class="cyber-particle-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
let animationFrameId = null;
let particles = [];
const particleCount = 45;
let mouse = { x: null, y: null, radius: 120 };

class Particle {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.density = Math.random() * 20 + 5;
  }

  draw(ctx) {
    ctx.fillStyle = 'rgba(214, 182, 186, 0.45)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(w, h) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > w) this.vx = -this.vx;
    if (this.y < 0 || this.y > h) this.vy = -this.vy;

    // Mouse interactive repulsion/attraction
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;
        const directionX = forceDirectionX * force * this.density * 0.4;
        const directionY = forceDirectionY * force * this.density * 0.4;
        this.x -= directionX;
        this.y -= directionY;
      }
    }
  }
}

const initParticles = (w, h) => {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(w, h));
  }
};

const connectParticles = (ctx, w, h) => {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 110) {
        const opacity = (1 - dist / 110) * 0.18;
        ctx.strokeStyle = `rgba(184, 117, 122, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
};

const handleMouseMove = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

const handleMouseLeave = () => {
  mouse.x = null;
  mouse.y = null;
};

const handleResize = () => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles(canvas.width, canvas.height);
};

const animate = () => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update(canvas.width, canvas.height);
    particles[i].draw(ctx);
  }
  connectParticles(ctx, canvas.width, canvas.height);

  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  if (canvasRef.value) {
    const canvas = canvasRef.value;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(canvas.width, canvas.height);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize, { passive: true });
    animate();
  }
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseleave', handleMouseLeave);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.cyber-particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  opacity: 0.7;
}
</style>
