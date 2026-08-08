document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginContainer = document.getElementById('login-container');
  const mainContainer = document.getElementById('main-container');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginError = document.getElementById('loginError');

  // ================================================================
  // 📌 ဤနေရာတွင် User များအသုံးပြုမည့် Key (သော့) များကို သတ်မှတ်ပါ။
  //    သင်အလိုရှိသော သော့များကို အောက်ပါ Array ထဲတွင် ထည့်ပါ။
  // ================================================================
  const VALID_KEYS = [
    'MEPT2026',    // သင်သတ်မှတ်သော သော့ ၁
    'DEVPPK123',   // သင်သတ်မှတ်သော သော့ ၂
    'ADMIN888'     // သင်သတ်မှတ်သော သော့ ၃
  ];
  // ================================================================

  // Login session စစ်ဆေးခြင်း
  if (localStorage.getItem('isLoggedIn') === 'true') {
    showMainDashboard();
  }

  // Form submit လုပ်သည့်အခါ
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const enteredKey = document.getElementById('password').value.trim();
    const username = document.getElementById('username').value.trim();

    // Username မထည့်ပါက သတိပေးချက်
    if (!username) {
      loginError.textContent = '❌ ကျေးဇူးပြု၍ Username ထည့်ပါ။';
      loginError.style.display = 'block';
      return;
    }

    // Key စစ်ဆေးခြင်း (VALID_KEYS ထဲမှ တစ်ခုခုနှင့် ကိုက်ညီမှု)
    if (VALID_KEYS.includes(enteredKey)) {
      // အောင်မြင်ပါက Dashboard သို့ ပို့ဆောင်မည်
      localStorage.setItem('isLoggedIn', 'true');
      loginError.style.display = 'none';
      showMainDashboard();
    } else {
      // မှားပါက Error ပြသမည်
      loginError.textContent = '❌ သော့မှားနေပါသည်။ ကျေးဇူးပြု၍ ပြန်လည်စစ်ဆေးပါ။';
      loginError.style.display = 'block';
    }
  });

  // Logout ထွက်သည့်အခါ
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    showLoginForm();
  });

  function showMainDashboard() {
    loginContainer.classList.add('hidden');
    mainContainer.classList.remove('hidden');
  }

  function showLoginForm() {
    mainContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
    // Error မက်ဆေ့ခ်ျကို ပြန်ဖျောက်ထားရန်
    loginError.style.display = 'none';
  }
});