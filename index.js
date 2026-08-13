document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginContainer = document.getElementById('login-container');
  const mainContainer = document.getElementById('main-container');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginError = document.getElementById('loginError');

  // ================================================================
  // 📌 Key သက်တမ်းသတ်မှတ်ချက်များ
  // ================================================================
  const SEV_CHAR_START = '2026-08-01';
  const SEV_CHAR_END   = '2027-02-02';
  const EIGHT_CHAR_START = '2026-08-11';
  const EIGHT_CHAR_END   = '2026-09-12';
  const TEN_CHAR_START   = '2026-10-01';
  const TEN_CHAR_END     = '2027-05-02';

  // ================================================================
  // 📌 Key စာရင်းများ
  // ================================================================
  const SEV_CHAR_KEYS = [
  'MEP7A9X', 'K92B74L', 'MEP3M8Q', 'P47L21R', 'MEP9Z3K',
    'R81X52M', 'MEP2W6V', 'B34Y89P', 'MEP5T1Z', 'Q62N47X',
    'MEP8K3R', 'L19V52Q', 'MEP4P7W', 'Z83M21Y', 'MEP6X9T',
    'X47R82P', 'MEP1B5Z', 'V92Q34M', 'MEP7L8K', 'W31Y52R',
    'MEP3Z9X', 'N82P47L', 'MEP9T2W', 'Y52M81Q', 'MEP4R3Z',
    'P19K62X', 'MEP8V7L', 'T34W92M', 'MEP2Y8R', 'G71P52Z'
  ];
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
  // 📱 Device Identification & Key Lock Logic
  // ================================================================
  const DEVICE_ID_KEY = 'mept_device_id';
  const BOUND_KEY = 'mept_bound_key';

  function getDeviceId() {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = 'DEV-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  }

  function bindKeyToDevice(key) {
    localStorage.setItem(BOUND_KEY, key);
  }

  function isKeyValidForThisDevice(key) {
    const boundKey = localStorage.getItem(BOUND_KEY);
    if (!boundKey) return true;
    return boundKey === key;
  }

  // ================================================================
  // 🗓️ Key သက်တမ်းစစ်ဆေးခြင်း (FIXED)
  // ================================================================
  function isDateInRange(dateStr, startStr, endStr) {
    const date = new Date(dateStr);
    const start = new Date(startStr);
    const end = new Date(endStr);
    return date >= start && date <= end;
  }

  function validateKey(key) {
    const today = new Date().toISOString().split('T')[0];

    // 7-character keys
    if (key.length === 7 && SEV_CHAR_KEYS.includes(key)) {
      return isDateInRange(today, SEV_CHAR_START, SEV_CHAR_END);
    }
    // 8-character keys
    else if (key.length === 8 && EIGHT_CHAR_KEYS.includes(key)) {
      return isDateInRange(today, EIGHT_CHAR_START, EIGHT_CHAR_END);
    }
    // 11-character keys (TEN_CHAR_KEYS)
    else if (key.length === 11 && TEN_CHAR_KEYS.includes(key)) {
      return isDateInRange(today, TEN_CHAR_START, TEN_CHAR_END);
    }
    return false;
  }

  // ================================================================
  // 🔐 Login လုပ်ငန်းစဉ်
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

    if (!validateKey(enteredKey)) {
      loginError.textContent = '❌ သော့မှားနေပါသည် သို့မဟုတ် သက်တမ်းကုန်ဆုံးနေပါသည်။';
      loginError.style.display = 'block';
      return;
    }

    if (!isKeyValidForThisDevice(enteredKey)) {
      loginError.textContent = '❌ ဤ Device တွင် အခြား သော့ ပေါင်းစပ်ထားပြီး ဖြစ်ပါသည်။';
      loginError.style.display = 'block';
      return;
    }

    bindKeyToDevice(enteredKey);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
    loginError.style.display = 'none';
    showMainDashboard();
  });

  // ================================================================
  // 🚪 Logout & Session စစ်ဆေးခြင်း
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

  if (localStorage.getItem('isLoggedIn') === 'true') {
    showMainDashboard();
  }
});
