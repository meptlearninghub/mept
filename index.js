document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginContainer = document.getElementById('login-container');
  const mainContainer = document.getElementById('main-container');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginError = document.getElementById('loginError');

  // ================================================================
  // 📌 Key သက်တမ်းသတ်မှတ်ချက်များ
  // ================================================================
  const EIGHT_CHAR_START = '2026-08-01';
  const EIGHT_CHAR_END   = '2027-02-02';
  const TEN_CHAR_START   = '2026-10-01';
  const TEN_CHAR_END     = '2027-05-02';

  // ================================================================
  // 📌 သင်သတ်မှတ်လိုသော Key များ
  //    (အထက်ပါ Array များတွင် သင့် Key များကို ထည့်ပါ)
  // ================================================================
  const EIGHT_CHAR_KEYS = [
    'KEY1AAAA', 'KEY2BBBB', 'KEY3CCCC', 'KEY4DDDD', 'KEY5EEEE',
    'KEY6FFFF', 'KEY7GGGG', 'KEY8HHHH', 'KEY9IIII', 'KEY10JJJJ',
    'KEY11KKK', 'KEY12LLL', 'KEY13MMM', 'KEY14NNN', 'KEY15OOO',
    'KEY16PPP', 'KEY17QQQ', 'KEY18RRR', 'KEY19SSS', 'KEY20TTT',
    'KEY21UUU', 'KEY22VVV', 'KEY23WWW', 'KEY24XXX', 'KEY25YYY',
    'KEY26ZZZ', 'KEY27AAA', 'KEY28BBB', 'KEY29CCC', 'KEY30DDD'
  ];
  const TEN_CHAR_KEYS = [
    'TENKEY11KKK', 'TENKEY12LLL', 'TENKEY13MMM', 'TENKEY14NNN', 'TENKEY15OOO',
'TENKEY16PPP', 'TENKEY17QQQ', 'TENKEY18RRR', 'TENKEY19SSS', 'TENKEY20TTT',
'TENKEY21UUU', 'TENKEY22VVV', 'TENKEY23WWW', 'TENKEY24XXX', 'TENKEY25YYY',
'TENKEY26ZZZ', 'TENKEY27AAA', 'TENKEY28BBB', 'TENKEY29CCC', 'TENKEY30DDD',
'TENKEY31EEE', 'TENKEY32FFF', 'TENKEY33GGG', 'TENKEY34HHH', 'TENKEY35III',
'TENKEY36JJJ', 'TENKEY37KKK', 'TENKEY38LLL', 'TENKEY39MMM', 'TENKEY40NNN'
  ];

  // ================================================================
  //  One‑Time Use Tracking (Key တစ်ခါသာသုံးနိုင်)
  // ================================================================
  const USED_KEYS_KEY = 'mept_used_keys';

  function isKeyUsed(key) {
    const used = JSON.parse(localStorage.getItem(USED_KEYS_KEY) || '[]');
    return used.includes(key);
  }

  function markKeyUsed(key) {
    const used = JSON.parse(localStorage.getItem(USED_KEYS_KEY) || '[]');
    if (!used.includes(key)) {
      used.push(key);
      localStorage.setItem(USED_KEYS_KEY, JSON.stringify(used));
    }
  }

  // ================================================================
  //  Key သက်တမ်းစစ်ဆေးခြင်း
  // ================================================================
  function isDateInRange(dateStr, startStr, endStr) {
    const date = new Date(dateStr);
    const start = new Date(startStr);
    const end = new Date(endStr);
    return date >= start && date <= end;
  }

  function validateKey(key) {
    // ပထမ Key length စစ်ဆေးပြီး သက်ဆိုင်ရာ Array ထဲတွင် ရှိမရှိ စစ်ဆေးပါ။
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    if (key.length === 8 && EIGHT_CHAR_KEYS.includes(key)) {
      // ၈ လုံး Key အုပ်စု
      return isDateInRange(today, EIGHT_CHAR_START, EIGHT_CHAR_END);
    } else if (key.length === 10 && TEN_CHAR_KEYS.includes(key)) {
      // ၁၀ လုံး Key အုပ်စု
      return isDateInRange(today, TEN_CHAR_START, TEN_CHAR_END);
    }
    return false; // အခြား Key များ သို့မဟုတ် မရှိသော Key
  }

  // ================================================================
  //  Login လုပ်ငန်းစဉ်
  // ================================================================
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const enteredKey = document.getElementById('password').value.trim();
    const username = document.getElementById('username').value.trim();

    if (!username) {
      loginError.textContent = '❌ ကျေးဇူးပြု၍ Username ထည့်ပါ။';
      loginError.style.display = 'block';
      return;
    }

    // ၁။ Key သည် တရားဝင် Key ဖြစ်ပြီး သက်တမ်းမကုန်သေးလား စစ်ဆေးပါ။
    if (!validateKey(enteredKey)) {
      loginError.textContent = '❌ သော့မှားနေပါသည် သို့မဟုတ် သက်တမ်းကုန်ဆုံးနေပါသည်။';
      loginError.style.display = 'block';
      return;
    }

    // ၂။ ဤ Key ကို တစ်ခါသုံးပြီးပြီလား စစ်ဆေးပါ။
    if (isKeyUsed(enteredKey)) {
      loginError.textContent = '❌ ဤသော့ကို အသုံးပြုပြီးပါပြီ။ (တစ်ခါသာ အသုံးပြုနိုင်သည်)';
      loginError.style.display = 'block';
      return;
    }

    // ၃။ အားလုံးအောင်မြင်ပါက Login လုပ်ပြီး Key ကို Used စာရင်းသွင်းပါ။
    markKeyUsed(enteredKey);
    localStorage.setItem('isLoggedIn', 'true');
    loginError.style.display = 'none';
    showMainDashboard();
  });

  // ================================================================
  //  Logout & Session စစ်ဆေးခြင်း
  // ================================================================
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
    loginError.style.display = 'none';
  }

  // Page load လုပ်တိုင်း Session စစ်ဆေးခြင်း
  if (localStorage.getItem('isLoggedIn') === 'true') {
    showMainDashboard();
  }
});
