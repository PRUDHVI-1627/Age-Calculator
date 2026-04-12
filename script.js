// =========================================
//   Age Calculator — script.js
// =========================================

function calculateAge() {
  clearErrors();

  const dayVal   = document.getElementById('day').value.trim();
  const monthVal = document.getElementById('month').value.trim();
  const yearVal  = document.getElementById('year').value.trim();
  const errorMsg = document.getElementById('errorMsg');

  // ── Basic presence check ──
  if (!dayVal || !monthVal || !yearVal) {
    showError('Please fill in all three fields.', !dayVal ? 'day' : !monthVal ? 'month' : 'year');
    return;
  }

  const day   = parseInt(dayVal, 10);
  const month = parseInt(monthVal, 10);
  const year  = parseInt(yearVal, 10);

  // ── Range checks ──
  if (month < 1 || month > 12) {
    showError('Month must be between 1 and 12.', 'month'); return;
  }
  if (day < 1 || day > 31) {
    showError('Day must be between 1 and 31.', 'day'); return;
  }
  if (year < 1900 || year > new Date().getFullYear()) {
    showError(`Year must be between 1900 and ${new Date().getFullYear()}.`, 'year'); return;
  }

  // ── Valid calendar date check ──
  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth()    !== month - 1 ||
    birthDate.getDate()     !== day
  ) {
    showError('That date doesn\'t exist. Double-check the day.', 'day'); return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (birthDate > today) {
    showError('Your birthday can\'t be in the future — unless you\'re a time traveller 🚀', 'year');
    return;
  }

  // ── Age calculation ──
  let years  = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth()    - birthDate.getMonth();
  let days   = today.getDate()     - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // ── Fun stats ──
  const msPerDay    = 1000 * 60 * 60 * 24;
  const totalDays   = Math.floor((today - birthDate) / msPerDay);
  const totalHours  = totalDays * 24;
  const totalMins   = totalHours * 60;

  // Days to next birthday
  let nextBirthday = new Date(today.getFullYear(), month - 1, day);
  if (nextBirthday <= today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const daysToNext = Math.ceil((nextBirthday - today) / msPerDay);

  // ── Update DOM ──
  animateValue('resYears',  years);
  animateValue('resMonths', months);
  animateValue('resDays',   days);

  document.getElementById('totalDays').textContent    = formatNum(totalDays);
  document.getElementById('totalHours').textContent   = formatNum(totalHours);
  document.getElementById('totalMinutes').textContent = formatNum(totalMins);
  document.getElementById('nextBirthday').textContent = daysToNext === 0 ? '🎂 Today!' : daysToNext;

  // ── Birthday message ──
  const bdMsg  = document.getElementById('birthdayMsg');
  const isBday = daysToNext === 0;

  if (isBday) {
    bdMsg.innerHTML = `🎉 Happy Birthday! Today you turn <strong>${years}</strong>. Hope it's a wonderful one!`;
    bdMsg.classList.add('show');
  } else {
    bdMsg.innerHTML = getPersonalityLine(years);
    bdMsg.classList.add('show');
  }

  // ── Show results section ──
  const results = document.getElementById('results');
  results.classList.remove('show');
  void results.offsetWidth; // force reflow for re-animation
  results.classList.add('show');
}

// ─── Helpers ─────────────────────────────

function animateValue(blockId, target) {
  const block  = document.getElementById(blockId);
  const numEl  = block.querySelector('.num');
  let start    = 0;
  const steps  = 28;
  const step   = Math.ceil(target / steps);
  const timer  = setInterval(() => {
    start += step;
    if (start >= target) {
      numEl.textContent = target;
      clearInterval(timer);
    } else {
      numEl.textContent = start;
    }
  }, 30);
}

function formatNum(n) {
  return n.toLocaleString('en-IN');
}

function getPersonalityLine(years) {
  if (years < 13)  return `✨ You're ${years} years young — the world is one big adventure waiting for you.`;
  if (years < 20)  return `🌱 Teenager! ${years} years old and just getting started on the good stuff.`;
  if (years < 30)  return `☀️ Your twenties — ${years} years of figuring it all out, and it looks great on you.`;
  if (years < 40)  return `🌿 Thirty-something and thriving. ${years} years of wisdom, zero apologies.`;
  if (years < 50)  return `🍂 Forty is the new twenty, they say. At ${years}, you're proof.`;
  if (years < 60)  return `🎶 ${years} years and counting — you've earned every single one of them.`;
  if (years < 70)  return `🌻 ${years} years young. The best stories come from the most experienced storytellers.`;
  return `🏅 ${years} glorious years. A life well and truly lived — wear it proudly.`;
}

function showError(message, fieldId) {
  document.getElementById('errorMsg').textContent = message;
  if (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) el.classList.add('error');
  }
}

function clearErrors() {
  document.getElementById('errorMsg').textContent = '';
  ['day', 'month', 'year'].forEach(id => {
    document.getElementById(id).classList.remove('error');
  });
}

// ─── Allow Enter key to trigger calculation ───
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') calculateAge();
});