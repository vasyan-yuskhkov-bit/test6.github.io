const questions = [
  { q: "Где обычно можно встретить иксодового клеща — переносчика вируса?", options: ["Только в густом еловом лесу","В траве, кустарниках, на лесных тропах и опушках, в парках","Только в болотистой местности","В сухой степи без растительности"], correct: 1 },
  { q: "В какое время года риск укуса клеща наиболее высок?", options: ["Декабрь–февраль","Апрель–июнь и август–сентябрь","Только июль","Круглый год одинаков"], correct: 1 },
  { q: "Как чаще всего клещ попадает на человека?", options: ["Падает с дерева","Прицепляется с травы или кустарника на одежду/обувь","Прыгает с земли","Заносится домашними животными"], correct: 1 },
  { q: "Что нужно сделать сразу после обнаружения присосавшегося клеща?", options: ["Залить его маслом","Аккуратно удалить и поместить в контейнер","Прижечь йодом","Срочно принять антибиотик"], correct: 1 },
  { q: "Куда лучше всего обращаться для исследования клеща?", options: ["В продуктовый магазин","В лабораторию Роспотребнадзора","В аптеку","В ветеринарную клинику"], correct: 1 },
  { q: "Какие симптомы указывают на начало клещевого энцефалита?", options: ["Только боль в месте укуса","Высокая температура, головная боль, тошнота","Зуд и сыпь по всему телу","Кашель и насморк"], correct: 1 },
  { q: "Существует ли прививка против клещевого энцефалита?", options: ["Да, есть эффективные вакцины","Нет, только антибиотики","Есть, но она не помогает","Только народные средства"], correct: 0 },
  { q: "Кому рекомендуется вакцинация в первую очередь?", options: ["Только детям до 7 лет","Только пенсионерам","Жителям эндемичных районов, лесникам, туристам","Никому"], correct: 2 },
  { q: "Какая защита в лесу наиболее эффективна?", options: ["Короткие шорты","Светлая закрытая одежда + репелленты","Нательный крестик","Громкое пение"], correct: 1 },
  { q: "Что может назначить врач для экстренной профилактики?", options: ["Греющий компресс","Банки и горчичники","Иммуноглобулин","Слабительные"], correct: 2 }
];

let currentQ = 0, score = 0, userName = "", gender = 1, selectedAnswers = [];

// Калькулятор
function setGender(g) {
  gender = g;
  document.getElementById('maleBtn').classList.toggle('active', g === 1);
  document.getElementById('femaleBtn').classList.toggle('active', g === 0);
}

function calculateKcal() {
  const weight = parseFloat(document.getElementById('weight').value);
  if (!weight) return alert("Введите вес!");
  let base = weight * 24;
  let result = gender === 1 ? Math.round(base * 1.1) : Math.round(base * 0.95);
  document.getElementById('kcalResult').innerHTML = `Рекомендуется <strong>${result} ккал</strong> в день`;
  document.getElementById('kcalResult').classList.remove('hidden');
}

// Опросник
function startQuiz() {
  userName = document.getElementById('userName').value.trim();
  if (!userName) return alert("Введите имя!");

  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('quizScreen').classList.remove('hidden');
  document.getElementById('quizUser').textContent = userName;
  
  currentQ = 0;
  score = 0;
  selectedAnswers = [];
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQ];
  document.getElementById('qNum').textContent = currentQ + 1;
  document.getElementById('questionText').textContent = q.q;

  const opts = document.getElementById('options');
  opts.innerHTML = '';

  q.options.forEach((text, i) => {
    const div = document.createElement('div');
    div.textContent = text;
    div.onclick = () => {
      selectedAnswers[currentQ] = i;
      document.getElementById('nextBtn').classList.remove('hidden');
    };
    opts.appendChild(div);
  });

  document.getElementById('nextBtn').classList.add('hidden');
}

function nextQuestion() {
  currentQ++;
  if (currentQ < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById('quizScreen').classList.add('hidden');
  document.getElementById('resultScreen').classList.remove('hidden');

  const percent = Math.round((score / 10) * 100); // score будет рассчитан ниже

  // Подсчёт правильных ответов
  score = 0;
  selectedAnswers.forEach((answer, index) => {
    if (answer === questions[index].correct) score++;
  });

  const finalPercent = Math.round((score / 10) * 100);

  document.getElementById('resultUser').textContent = userName;
  const circle = document.getElementById('scoreCircle');
  circle.textContent = finalPercent + '%';
  circle.style.borderColor = finalPercent >= 80 ? '#10b981' : '#f59e0b';

  document.getElementById('resultMsg').textContent = finalPercent >= 80 
    ? 'Отличный результат! Вы хорошо подготовлены.' 
    : 'Есть над чем поработать.';

  saveResult(finalPercent);
}

function saveResult(percent) {
  let results = JSON.parse(localStorage.getItem('medicalResults') || '[]');
  results.unshift({ name: userName, date: new Date().toLocaleString('ru-RU'), score: percent });
  localStorage.setItem('medicalResults', JSON.stringify(results.slice(0, 50)));
}

function showAdminPanel() {
  document.getElementById('resultScreen').classList.add('hidden');
  loginAdmin();
}

function loginAdmin() {
  const pass = document.getElementById('adminPass').value;
  if (pass === "sofr2928") {
    document.getElementById('adminContent').classList.remove('hidden');
    showAllResults();
  } else {
    alert("Неверный пароль!");
  }
}

function showAllResults() {
  let results = JSON.parse(localStorage.getItem('medicalResults') || '[]');
  let html = results.length ? '' : '<p>Пока нет результатов</p>';
  
  results.forEach(r => {
    html += `<div><strong>${r.name}</strong> — ${r.date} — <span class="text-indigo-600">${r.score}%</span></div>`;
  });
  document.getElementById('adminResults').innerHTML = html;
}

function restartQuiz() {
  document.getElementById('resultScreen').classList.add('hidden');
  document.getElementById('startScreen').classList.remove('hidden');
  document.getElementById('userName').value = '';
}