const questions = [
  {
    text: "Q1. Eight",
    options: ["null", "neun", "acht", "eins"],
    correct: 2
  },
  {
    text: "Q2. One",
    options: ["vier", "eins", "zwei", "drei"],
    correct: 1
  },
  {
    text: "Q3. Five",
    options: ["fünf", "acht", "zehn", "sechs"],
    correct: 0
  }
];

let current = 0;
let answered = false;
let xp = 0;
let hearts = 5;

function updateXP() {
  document.getElementById("xp-display").textContent = "XP: " + xp;
}

function updateHearts() {
  const heartContainer = document.getElementById("hearts");
  heartContainer.innerHTML = ""; // Clear existing

  for (let i = 0; i < hearts; i++) {
    const heart = document.createElement("span");
    heart.classList.add("heart");
    heart.innerHTML = "&#10084;";
    heartContainer.appendChild(heart);
  }
}

function loadQuestion(index) {
  answered = false;
  const q = questions[index];
  document.getElementById("question-text").textContent = q.text;
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`opt${i + 1}`);
    btn.textContent = q.options[i];
    btn.style.backgroundColor = "#ecf0f1";
    btn.disabled = false;
  }
}

function checkAnswer(button) {
  if (answered) return;

  answered = true;
  const selectedIndex = Array.from(button.parentNode.children).indexOf(button);
  const correctIndex = questions[current].correct;

  if (selectedIndex === correctIndex) {
    button.style.backgroundColor = "#b0f2b4";
    xp += 50;
    updateXP();
  } else {
    button.style.backgroundColor = "#f7a7a7";
    const correctBtn = document.getElementById(`opt${correctIndex + 1}`);
    correctBtn.style.backgroundColor = "#b0f2b4";
    hearts -= 1;
    updateHearts();
    if (hearts <= 0) {
      alert("💔 Game over! You ran out of hearts.");
      disableAllOptions();
      return;
    }
  }

  disableAllOptions();
}

function disableAllOptions() {
  for (let i = 0; i < 4; i++) {
    document.getElementById(`opt${i + 1}`).disabled = true;
  }
}

function nextQuestion() {
  current++;
  if (current < questions.length) {
    loadQuestion(current);
  } else {
    alert("🎉 Lesson Complete!");
  }
}

// Initial UI Setup
updateXP();
updateHearts();
loadQuestion(current);
