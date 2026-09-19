// Robust Client-side Password Protection Gate for Portfolio Case Studies
(function() {
  const PASSCODE = "000026";
  
  // Wipe all legacy persistent localStorage tokens so it never auto-bypasses
  try {
    localStorage.removeItem("portfolio_auth_aic");
    localStorage.removeItem("portfolio_auth_parliament");
    localStorage.removeItem("portfolio_auth_global");
    localStorage.removeItem("portfolio_auth_000026");
    localStorage.removeItem("portfolio_auth_protected");
  } catch (e) {}

  // Determine specific page
  const path = (window.location.pathname || "").toLowerCase();
  let pageId = "aic";
  let projectTitle = "Agency for Integrated Care (AIC)";

  if (path.includes("parliament")) {
    pageId = "parliament";
    projectTitle = "Parliament of Singapore";
  } else if (path.includes("aic")) {
    pageId = "aic";
    projectTitle = "Agency for Integrated Care (AIC)";
  }

  const SESSION_KEY = "portfolio_session_unlocked_" + pageId;

  function isUnlocked() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  function setUnlocked() {
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch (e) {}
  }

  function reLock() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
    window.location.reload();
  }

  function addRelockNavButton() {
    const navLinks = document.querySelector('.nav .links');
    if (navLinks && !document.getElementById('nav-relock-btn')) {
      const lockBtn = document.createElement('button');
      lockBtn.id = 'nav-relock-btn';
      lockBtn.className = 'nav-lock-toggle';
      lockBtn.title = 'Re-lock this case study';
      lockBtn.setAttribute('aria-label', 'Re-lock this case study');
      lockBtn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span>Lock</span>
      `;
      lockBtn.addEventListener('click', function(e) {
        e.preventDefault();
        reLock();
      });
      navLinks.insertBefore(lockBtn, navLinks.firstChild);
    }
  }

  function unlockPage() {
    setUnlocked();
    
    // Remove lock classes
    document.documentElement.classList.remove('is-locked');
    document.body.classList.remove('is-locked');
    
    const gate = document.getElementById('password-gate');
    if (gate) {
      gate.classList.add('unlock-success');
      setTimeout(function() {
        if (gate.parentNode) gate.parentNode.removeChild(gate);
      }, 250);
    }
    addRelockNavButton();
  }

  function initGate() {
    if (isUnlocked()) {
      document.documentElement.classList.remove('is-locked');
      document.body.classList.remove('is-locked');
      const existingGate = document.getElementById('password-gate');
      if (existingGate && existingGate.parentNode) {
        existingGate.parentNode.removeChild(existingGate);
      }
      addRelockNavButton();
      return;
    }

    document.documentElement.classList.add('is-locked');
    document.body.classList.add('is-locked');

    // Create gate HTML if not present
    if (!document.getElementById('password-gate')) {
      const gateHtml = document.createElement('div');
      gateHtml.id = 'password-gate';
      gateHtml.className = 'password-gate-overlay';
      gateHtml.innerHTML = `
        <div class="password-gate-card">
          <div class="password-gate-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div class="password-gate-eyebrow">RESTRICTED ACCESS · NDA PROTECTED</div>
          <h2 class="password-gate-title">${projectTitle}</h2>
          <p class="password-gate-desc">
            This case study contains confidential institutional and government designs. Please enter the passcode to view the documentation and screens.
          </p>
          <form id="password-gate-form" class="password-gate-form" autocomplete="off" onsubmit="return false;">
            <div class="password-input-wrap">
              <input type="password" id="gate-passcode" class="password-gate-input" placeholder="Enter passcode" maxlength="20" autofocus required />
              <button type="button" id="toggle-pwd-btn" class="toggle-pwd-btn" aria-label="Toggle password visibility" title="Show/Hide passcode">
                <svg class="eye-open" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <svg class="eye-closed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              </button>
            </div>
            <div id="gate-error" class="password-gate-error" style="display:none;">
              Incorrect passcode. Please enter 000026 or contact Subith.
            </div>
            <button type="button" id="gate-submit-btn" class="password-gate-submit">
              <span>Unlock Case Study</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </form>
          <div class="password-gate-footer">
            <a href="index.html" class="gate-back-link">← Return to Selected Work</a>
          </div>
        </div>
      `;
      document.body.appendChild(gateHtml);

      // Forward wheel events to background
      gateHtml.addEventListener('wheel', function(e) {
        if (e.target === gateHtml) {
          window.scrollBy(0, e.deltaY);
        }
      }, { passive: true });

      const form = document.getElementById('password-gate-form');
      const input = document.getElementById('gate-passcode');
      const error = document.getElementById('gate-error');
      const submitBtn = document.getElementById('gate-submit-btn');
      const toggleBtn = document.getElementById('toggle-pwd-btn');
      const eyeOpen = toggleBtn.querySelector('.eye-open');
      const eyeClosed = toggleBtn.querySelector('.eye-closed');

      toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (input.type === 'password') {
          input.type = 'text';
          eyeOpen.style.display = 'none';
          eyeClosed.style.display = 'block';
        } else {
          input.type = 'password';
          eyeOpen.style.display = 'block';
          eyeClosed.style.display = 'none';
        }
        input.focus();
      });

      function verifyAndUnlock() {
        const raw = input.value || "";
        const clean = raw.trim();

        if (clean === PASSCODE || clean === "26" || clean === "026" || clean === "0026" || clean === "00026") {
          error.style.display = 'none';
          unlockPage();
        } else {
          error.style.display = 'block';
          input.classList.remove('shake');
          void input.offsetWidth;
          input.classList.add('shake');
          input.focus();
          input.select();
        }
      }

      submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        verifyAndUnlock();
      });

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        verifyAndUnlock();
      });

      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          verifyAndUnlock();
        }
      });

      setTimeout(function() {
        if (input) input.focus();
      }, 80);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGate);
  } else {
    initGate();
  }
})();
