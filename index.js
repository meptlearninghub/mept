
document.addEventListener('DOMContentLoaded', () => {
  // =====================================================
  // EXISTING LOGIN ELEMENTS — PRESERVED
  // =====================================================
  const loginForm = document.getElementById('loginForm');
  const loginContainer = document.getElementById('login-container');
  const mainContainer = document.getElementById('main-container');
  const publicHome = document.getElementById('public-home');
  const publicHeader = document.getElementById('publicHeader');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginError = document.getElementById('loginError');

  const GOOGLE_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbwVwCVFXrCh1KLFmFk-a_t7UhOzWjzSpbVM7ckL5tcdnr76DWpZpKmYMOXmn9SVKx8Vew/exec';

  const APP_SECRET_TOKEN = 'MySecretToken123';
  const DEVICE_ID_KEY = 'mept_device_id';

  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const welcomeUsername = document.getElementById('welcomeUsername');

  // =====================================================
  // DEVICE ID — ORIGINAL BEHAVIOR PRESERVED
  // =====================================================
  function getDeviceId() {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
      deviceId =
        'DEV-' +
        Math.random().toString(36).substring(2, 15) +
        '-' +
        Date.now();

      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
  }

  // =====================================================
  // PAGE NAVIGATION
  // =====================================================
  function showPublicHome(scrollToTop = true) {
    if (publicHeader) publicHeader.classList.remove('hidden');
    if (publicHome) publicHome.classList.remove('hidden');

    if (loginContainer) loginContainer.classList.add('hidden');
    if (mainContainer) mainContainer.classList.add('hidden');

    closeMobileMenu();

    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    document.title = 'MEPT Master Hub | Prepare with Confidence';
  }

  function showLoginPage() {
    if (publicHeader) publicHeader.classList.add('hidden');
    if (publicHome) publicHome.classList.add('hidden');

    if (mainContainer) mainContainer.classList.add('hidden');
    if (loginContainer) loginContainer.classList.remove('hidden');

    if (loginError) loginError.style.display = 'none';

    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'auto' });

    document.title = 'Login | MEPT Master Hub';

    // Focus the username field for easier login.
    if (usernameInput) {
      setTimeout(() => usernameInput.focus(), 50);
    }
  }

  function showMainDashboard() {
    if (publicHeader) publicHeader.classList.add('hidden');
    if (publicHome) publicHome.classList.add('hidden');

    if (loginContainer) loginContainer.classList.add('hidden');
    if (mainContainer) mainContainer.classList.remove('hidden');

    if (welcomeUsername) {
      welcomeUsername.textContent =
        localStorage.getItem('currentUser') || 'Seafarer';
    }

    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'auto' });

    document.title = 'Dashboard | MEPT Master Hub';
  }

  // =====================================================
  // ALL LOGIN BUTTONS OPEN THE LOGIN PAGE
  // =====================================================
  document.querySelectorAll('[data-open-login]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();

      // Do not open the login page over an active dashboard.
      if (localStorage.getItem('isLoggedIn') === 'true') {
        showMainDashboard();
        return;
      }

      showLoginPage();
    });
  });

  // =====================================================
  // RETURN TO PUBLIC HOME
  // =====================================================
  const backToHome = document.getElementById('backToHome');

  if (backToHome) {
    backToHome.addEventListener('click', () => {
      if (loginForm) loginForm.reset();
      if (loginError) loginError.style.display = 'none';

      showPublicHome();
    });
  }

  // =====================================================
  // PASSWORD VISIBILITY TOGGLE
  // =====================================================
  const togglePassword = document.getElementById('togglePassword');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';

      passwordInput.type = isHidden ? 'text' : 'password';
      togglePassword.textContent = isHidden ? '🙈' : '👁';
      togglePassword.setAttribute(
        'aria-pressed',
        String(isHidden)
      );

      passwordInput.focus();
    });
  }

  // =====================================================
  // LOGIN ERROR
  // =====================================================
  function showError(message) {
    if (!loginError) return;

    loginError.textContent =
      message || 'Login မအောင်မြင်ပါ။ ပြန်လည်စစ်ဆေးပါ။';

    loginError.style.display = 'block';
  }

  // =====================================================
  // LOGIN — ORIGINAL GOOGLE APPS SCRIPT REQUEST
  // =====================================================
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const username = usernameInput.value.trim();
      const enteredKey = passwordInput.value.trim();
      const submitBtn = loginForm.querySelector(
        'button[type="submit"]'
      );

      if (!username || !enteredKey) {
        showError('❌ ကျေးဇူးပြု၍ Username နှင့် Key ကို ထည့်ပါ။');
        return;
      }

      const originalLabel = submitBtn
        ? submitBtn.innerHTML
        : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<span>စစ်ဆေးနေပါသည်...</span><span>⏳</span>';
      }

      if (loginError) loginError.style.display = 'none';

      // IMPORTANT: Preserve the original backend payload.
      const payload = {
        key: enteredKey,
        username: username,
        deviceId: getDeviceId(),
        token: APP_SECRET_TOKEN
      };

      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(
            'Login request failed: HTTP ' + response.status
          );
        }

        const result = await response.json();

        if (result.success) {
          // Preserve original localStorage behavior.
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', username);

          if (loginError) loginError.style.display = 'none';

          showMainDashboard();
        } else {
          showError(
            result.message ||
            '❌ Username သို့မဟုတ် Key မှားနေပါသည်။ ပြန်စစ်ပါ။'
          );
        }
      } catch (error) {
        console.error('Login Error:', error);

        showError(
          '❌ အင်တာနက် သို့မဟုတ် Server ချိတ်ဆက်မှု ပြဿနာရှိနေပါသည်။ ပြန်လည်ကြိုးစားပါ။'
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalLabel;
        }
      }
    });
  }

  // =====================================================
  // LOGOUT — RETURN TO PUBLIC LANDING PAGE
  // =====================================================
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');

      if (loginForm) loginForm.reset();
      if (loginError) loginError.style.display = 'none';

      showPublicHome();
    });
  }

  // =====================================================
  // MOBILE NAVIGATION
  // =====================================================
  const mobileMenuToggle =
    document.getElementById('mobileMenuToggle');

  const navLinks = document.getElementById('navLinks');

  function closeMobileMenu() {
    if (navLinks) navLinks.classList.remove('open');

    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.textContent = '☰';
    }
  }

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');

      mobileMenuToggle.setAttribute(
        'aria-expanded',
        String(isOpen)
      );

      mobileMenuToggle.textContent = isOpen ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('click', (event) => {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(event.target) &&
        !mobileMenuToggle.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMobileMenu();
    });
  }

  // =====================================================
  // ACTIVE PUBLIC NAVIGATION
  // =====================================================
  function initializeActiveNavigation() {
    if (!navLinks || !('IntersectionObserver' in window)) {
      return;
    }

    const links = Array.from(
      navLinks.querySelectorAll('a[href^="#"]')
    );

    const sections = links
      .map((link) => {
        return document.querySelector(
          link.getAttribute('href')
        );
      })
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visible.length) return;

        const activeId = visible[0].target.id;

        links.forEach((link) => {
          const active =
            link.getAttribute('href') === '#' + activeId;

          link.classList.toggle('active', active);

          if (active) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      },
      {
        rootMargin: '-15% 0px -65% 0px',
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // =====================================================
  // SCROLL REVEAL ANIMATIONS
  // =====================================================
  function initializeRevealAnimations() {
    const elements = document.querySelectorAll(
      '#public-home .reveal'
    );

    if (!elements.length) return;

    const reduceMotion = window.matchMedia &&
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    if (
      reduceMotion ||
      !('IntersectionObserver' in window)
    ) {
      elements.forEach((element) => {
        element.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    elements.forEach((element) => observer.observe(element));
  }

  // Enable reveal animations only after JS is running.
  document.documentElement.classList.add('js-motion');

  // =====================================================
  // FOOTER YEAR
  // =====================================================
  document.querySelectorAll('.current-year').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // =====================================================
  // INITIAL PAGE STATE
  // =====================================================
  initializeActiveNavigation();
  initializeRevealAnimations();

  // Existing login persistence is preserved:
  // - No saved login -> Public Home
  // - Saved login -> Member Dashboard
  //
  // This is UI persistence, not a fresh server verification.
  if (localStorage.getItem('isLoggedIn') === 'true') {
    showMainDashboard();
  } else {
    showPublicHome(false);
  }
});
