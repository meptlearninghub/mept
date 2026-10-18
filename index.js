
document.addEventListener('DOMContentLoaded', () => {
  // ================================================================
  // EXISTING LOGIN ELEMENTS — IDs PRESERVED
  // ================================================================
  const loginForm = document.getElementById('loginForm');
  const loginContainer = document.getElementById('login-container');
  const mainContainer = document.getElementById('main-container');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginError = document.getElementById('loginError');

  // Existing Google Apps Script URL — unchanged
  const GOOGLE_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbwVwCVFXrCh1KLFmFk-a_t7UhOzWjzSpbVM7ckL5tcdnr76DWpZpKmYMOXmn9SVKx8Vew/exec';

  // Existing token — unchanged
  const APP_SECRET_TOKEN = 'MySecretToken123';

  // ================================================================
  // DEVICE ID STORAGE — EXISTING LOGIC
  // ================================================================
  const DEVICE_ID_KEY = 'mept_device_id';

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

  // ================================================================
  // LOGIN — EXISTING BACKEND REQUEST PRESERVED
  // ================================================================
  if (loginForm && loginContainer && mainContainer && loginError) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const passwordInput = document.getElementById('password');
      const usernameInput = document.getElementById('username');
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      const enteredKey = passwordInput.value.trim();
      const username = usernameInput.value.trim();

      if (!username || !enteredKey) {
        showError('❌ ကျေးဇူးပြု၍ Username နှင့် Key ကို ထည့်ပါ။');
        return;
      }

      // Loading state: preserve the new button design
      const buttonLabel = submitBtn
        ? submitBtn.querySelector('span:first-child')
        : null;

      if (submitBtn) {
        if (buttonLabel) {
          buttonLabel.textContent = 'စစ်ဆေးနေပါသည်...';
        } else {
          submitBtn.textContent = 'စစ်ဆေးနေပါသည်...';
        }

        submitBtn.disabled = true;
      }

      loginError.style.display = 'none';

      // Original payload structure — unchanged
      const payload = {
        key: enteredKey,
        username: username,
        deviceId: getDeviceId(),
        token: APP_SECRET_TOKEN
      };

      try {
        // Original Google Apps Script request — unchanged
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Login request failed: HTTP ' + response.status);
        }

        const result = await response.json();

        if (result.success) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', username);

          loginError.style.display = 'none';
          showMainDashboard();
        } else {
          showError(
            result.message ||
            '❌ Login မအောင်မြင်ပါ။ Username နှင့် Key ကို ပြန်စစ်ပါ။'
          );
        }
      } catch (error) {
        showError(
          '❌ အင်တာနက်ချိတ်ဆက်မှု ပြဿနာရှိနေပါသည်။ ပြန်လည်ကြိုးစားကြည့်ပါ။'
        );

        console.error('Login Error:', error);
      } finally {
        if (submitBtn) {
          if (buttonLabel) {
            buttonLabel.textContent = 'Login ဝင်မည်';
          } else {
            submitBtn.textContent = 'Login ဝင်မည်';
          }

          submitBtn.disabled = false;
        }
      }
    });
  }

  // ================================================================
  // ERROR MESSAGE
  // ================================================================
  function showError(msg) {
    if (!loginError) return;

    loginError.textContent = msg;
    loginError.style.display = 'block';
  }

  // ================================================================
  // DASHBOARD / LOGIN VISIBILITY
  // ================================================================
  function showMainDashboard() {
    if (loginContainer) {
      loginContainer.classList.add('hidden');
    }

    if (mainContainer) {
      mainContainer.classList.remove('hidden');
    }

    updateCurrentYear();
    initializeDashboard();
  }

  function showLoginForm() {
    if (mainContainer) {
      mainContainer.classList.add('hidden');
    }

    if (loginContainer) {
      loginContainer.classList.remove('hidden');
    }

    if (loginError) {
      loginError.style.display = 'none';
    }

    if (loginForm) {
      loginForm.reset();
    }

    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  // ================================================================
  // LOGOUT — EXISTING STORAGE BEHAVIOR PRESERVED
  // ================================================================
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');

      showLoginForm();
    });
  }

  // ================================================================
  // PASSWORD VISIBILITY TOGGLE — UI ENHANCEMENT
  // ================================================================
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';

      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassword.textContent = isPassword ? '🙈' : '👁';
      togglePassword.setAttribute('aria-pressed', String(isPassword));

      passwordInput.focus();
    });
  }

  // ================================================================
  // CURRENT YEAR
  // ================================================================
  function updateCurrentYear() {
    const year = new Date().getFullYear();

    document.querySelectorAll('.current-year').forEach((element) => {
      element.textContent = year;
    });
  }

  updateCurrentYear();

  // ================================================================
  // MOBILE NAVIGATION
  // ================================================================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  function closeMobileMenu() {
    if (navLinks) {
      navLinks.classList.remove('open');
    }

    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.textContent = '☰';
    }
  }

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');

      mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenuToggle.textContent = isOpen ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
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
  }

  // ================================================================
  // ACTIVE NAVIGATION LINK
  // ================================================================
  function initializeActiveNavigation() {
    if (!navLinks) return;

    const links = Array.from(
      navLinks.querySelectorAll('a[href^="#"]')
    );

    const sections = links
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    function setActiveLink(sectionId) {
      links.forEach((link) => {
        const isActive =
          link.getAttribute('href') === '#' + sectionId;

        link.classList.toggle('active', isActive);

        if (isActive) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    if ('IntersectionObserver' in window && sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) => b.intersectionRatio - a.intersectionRatio
            );

          if (visibleEntries.length) {
            setActiveLink(visibleEntries[0].target.id);
          }
        },
        {
          rootMargin: '-15% 0px -65% 0px',
          threshold: [0, 0.1, 0.25, 0.5]
        }
      );

      sections.forEach((section) => observer.observe(section));
    } else {
      window.addEventListener('scroll', () => {
        let currentId = 'dashboard';

        sections.forEach((section) => {
          if (section.getBoundingClientRect().top < 180) {
            currentId = section.id;
          }
        });

        setActiveLink(currentId);
      }, { passive: true });
    }
  }

  // ================================================================
  // SCROLL REVEAL ANIMATIONS
  // ================================================================
  function initializeRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    if (!revealElements.length) return;

    // Show content immediately when reduced motion is preferred.
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      revealElements.forEach((element) => {
        element.classList.add('is-visible');
      });

      return;
    }

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: '0px 0px -35px 0px'
        }
      );

      revealElements.forEach((element) => {
        revealObserver.observe(element);
      });
    } else {
      revealElements.forEach((element) => {
        element.classList.add('is-visible');
      });
    }
  }

  // ================================================================
  // DASHBOARD INITIALIZATION
  // ================================================================
  function initializeDashboard() {
    initializeActiveNavigation();
    initializeRevealAnimations();
  }

  // ================================================================
  // AUTO LOGIN — EXISTING BEHAVIOR PRESERVED
  // ================================================================
  if (localStorage.getItem('isLoggedIn') === 'true') {
    showMainDashboard();
  }
});
