/**
 * Interactive Paper Airplane Cursor & Contrail System
 * Subith M Portfolio
 */
(function() {
  // Only activate on devices with fine pointer and hover support
  if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
    return;
  }

  // Create cursor container & SVG if not present
  let cursor = document.getElementById('airplane-cursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.id = 'airplane-cursor';
    cursor.innerHTML = `
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 21.5L22.5 12L2.5 2.5L3.8 10.8L16.5 12L3.8 13.2L2.5 21.5Z" fill="#1C2B45" stroke="#FAF8F3" stroke-width="0.75" stroke-linejoin="round"/>
        <path d="M3.8 10.8L16.5 12L3.8 13.2V10.8Z" fill="#235952" opacity="0.3"/>
      </svg>
    `;
    document.body.appendChild(cursor);
  }

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let currentAngle = 0;
  let targetAngle = 0;
  let lastMoveTime = 0;
  let isMoving = false;
  let lastParticleTime = 0;

  // Track raw mouse position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastMoveTime = performance.now();
    isMoving = true;
    cursor.style.opacity = '1';
  });

  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && !e.toElement) {
      cursor.style.opacity = '0';
    }
  });

  window.addEventListener('mouseover', () => {
    cursor.style.opacity = '1';
  });

  // Track hover on interactive elements
  const interactiveSelectors = 'a, button, input, textarea, select, .project-card, .itrack-tab-btn, .ytl-filter-btn, .ytl-card-zoom-btn, .ytl-card-media, .ytl-lightbox-btn, .btn-primary, .btn-secondary, [role="button"]';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      cursor.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      cursor.classList.remove('is-hovering');
    }
  });

  // Contrail particle generator
  function createParticle(x, y, angleDeg) {
    const now = performance.now();
    if (now - lastParticleTime < 45) return; // limit frequency
    lastParticleTime = now;

    const dot = document.createElement('div');
    dot.className = 'cursor-trail-dot';
    
    // Offset slightly behind the airplane tail (tail is opposite to heading angle)
    const rad = (angleDeg * Math.PI) / 180;
    const tailOffset = 12;
    const px = x - Math.cos(rad) * tailOffset;
    const py = y - Math.sin(rad) * tailOffset;

    dot.style.left = `${px}px`;
    dot.style.top = `${py}px`;
    document.body.appendChild(dot);

    setTimeout(() => {
      dot.remove();
    }, 450);
  }

  // Animation Loop
  function render() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Smooth lerp for position
    cursorX += dx * 0.28;
    cursorY += dy * 0.28;

    // Calculate angle if moving
    if (dist > 1.5) {
      // Angle in degrees from movement vector
      const targetRad = Math.atan2(dy, dx);
      let angleDeg = targetRad * (180 / Math.PI);

      // Shortest rotation interpolation
      let angleDiff = (angleDeg - targetAngle + 180) % 360 - 180;
      if (angleDiff < -180) angleDiff += 360;
      targetAngle += angleDiff;

      // Smooth angle transition
      currentAngle += (targetAngle - currentAngle) * 0.25;

      // Spawn subtle particle dot when gliding fast enough
      if (dist > 3) {
        createParticle(cursorX, cursorY, currentAngle);
      }
    } else {
      // Idle float slight tilt
      if (performance.now() - lastMoveTime > 150) {
        isMoving = false;
        // Ease angle gently back towards -25deg when hovering/idle
        targetAngle += (-25 - targetAngle) * 0.05;
        currentAngle += (targetAngle - currentAngle) * 0.1;
      }
    }

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    const svg = cursor.querySelector('svg');
    if (svg) {
      svg.style.transform = `rotate(${currentAngle}deg)`;
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
