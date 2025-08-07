// Updated script.js for LinguaQuest
let questions = [
  {
    type: "mcq",
    question: "Q1. What does “Guten Abend” mean?",
    options: ["Good Morning", "Good Evening", "Good Afternoon", "Good Bye"],
    answer: "Good Evening"
  },
  {
    type: "fill",
    question: "Q2. Tschüss! means ______ in English.",
    answer: "Bye"
  },
  {
    type: "audio",
    question: "Q3. Listen and select the correct word",
    audio: "../Audio/Cheers.mp3",
    options: ["Sorry", "Cheers", "Congrats", "Wonderful"],
    answer: "Cheers"
  },
  {
    type: "match",
    question: "Q4. Match numbers",
    pairs: [
      { left: "Guten Abend", right: "Good Evening" },
      { left: "Guten Morgan", right: "Good Morning" },
      { left: "Guten Tag", right: "Good Afternoon" }
    ]
  },
  {
    type: "mcq",
    question: "Q5. Which of these means “See you soon”?",
    options: ["Auf Wiedersehen", "Bis bald", "Guten Morgen", "Wie bitte"],
    answer: "Bis bald"
  },
  {
    type: "fill",
    question: "Q6. Guten ______! (Good morning)",
    answer: "Morgen"
  },
  {
    type: "audio",
    question: "Q7. Listen and select the correct word",
    audio: "../Audio/Good bye.mp3",
    options: ["Welcome", "Great", "Good Bye", "Please"],
    answer: "Good Bye"
  },
];

let current = 0;
let xp = 0;
let hearts = 5;
let answered = false;
let matchAnswers = {};
let matchedCount = 0;
let totalPairs = 0;
let correctSound = new Audio("../Audio/correct.mp3");
let wrongSound = new Audio("../Audio/wrong.mp3");
let lesson2 = new Audio("../Audio/lesson2.mp3");

function loadQuestion() {
  const box = document.getElementById("question-box");
  const nextBtn = document.getElementById("next-btn");
  nextBtn.disabled = true;
  answered = false;

  if (current >= questions.length) {
  box.innerHTML = `
    <h3>Well done!</h3>
    <p>Total XP: ${xp}</p>
    <a class="back" href="../HTML/select_lesson.html">
      <button>Back to Lessons</button>
    </a>
  `;
  lesson2.play();
  nextBtn.style.display = "none";
  return;
}

  const q = questions[current];
  let html = `<p>${q.question}</p>`;

  if (q.type === "mcq") {
    html += `<div class="option-container">`;
    q.options.forEach(opt => {
      html += `<button class="option" onclick="checkMCQAnswer(this, '${q.answer}')">${opt}</button>`;
    });
    html += `</div>`;
  }

  if (q.type === "fill") {
    html += `<div class="input-container">
      <input type="text" class="blank-input" id="fill-answer" placeholder="Your answer..." />
      <button onclick="checkFillAnswer('${q.answer}')">Check</button>
    </div>`;
  }

 if (q.type === "match") {
  html += `<div class="match-columns">
    <div class="column" id="left-column">`;

  // Left column (numbers) stays in correct order
  q.pairs.forEach(p => {
    html += `<div class="droppable" data-left="${p.left}" ondragover="event.preventDefault()" ondrop="handleDrop(event, '${p.left}')">${p.left}</div>`;
  });

  html += `</div>
    <div class="column" id="right-column">`;

  // Right column (German words) is shuffled
  const shuffledRight = [...q.pairs].sort(() => 0.5 - Math.random());
  shuffledRight.forEach(p => {
    html += `<div class="draggable" draggable="true" ondragstart="handleDragStart(event, '${p.right}')" data-right="${p.right}">${p.right}</div>`;
  });

  html += `</div></div>
  <p style="font-size:0.9rem;color:#ccc;">Drag German words to correct numbers</p>`;

  matchedCount = 0;
  totalPairs = q.pairs.length;
  matchAnswers = q.pairs.reduce((acc, pair) => {
    acc[pair.left] = pair.right;
    return acc;
  }, {});
}

  if (q.type === "audio") {
    html += `<div class="audio-container">
      <audio controls src="${q.audio}"></audio>
      <div class="option-container">`;
    q.options.forEach(opt => {
      html += `<button class="option" onclick="checkMCQAnswer(this, '${q.answer}')">${opt}</button>`;
    });
    html += `</div></div>`;
  }

  box.innerHTML = html;
}

function checkMCQAnswer(btn, correct) {
  if (answered) return;
  answered = true;
  const options = document.querySelectorAll(".option");
  options.forEach(o => {
    if (o.innerText === correct) o.classList.add("correct");
    if (o !== btn) o.disabled = true;
  });

  if (btn.innerText === correct) {
    xp += 50;
    correctSound.play();
  } else {
    btn.classList.add("incorrect");
    hearts -= 1;
    updateHearts();
    wrongSound.play();
  }

  document.getElementById("xp-display").innerText = `XP: ${xp}`;
  document.getElementById("next-btn").disabled = false;
}

function checkFillAnswer(correct) {
  if (answered) return;
  const input = document.getElementById("fill-answer");
  if (!input.value.trim()) return;

  answered = true;
  const val = input.value.trim().toLowerCase();

  if (val === correct.toLowerCase()) {
    xp += 50;
    input.style.borderColor = "green";
    correctSound.play();
  } else {
    input.style.borderColor = "red";
    hearts -= 1;
    wrongSound.play();
    updateHearts();
  }

  document.getElementById("xp-display").innerText = `XP: ${xp}`;
  document.getElementById("next-btn").disabled = false;
}

function updateHearts() {
  const heartContainer = document.getElementById("hearts");
  const allHearts = heartContainer.querySelectorAll(".heart");
  allHearts.forEach((h, i) => {
    h.style.opacity = i < hearts ? "1" : "0.2";
  });

  if (hearts <= 0) {
  document.getElementById("question-box").innerHTML = `
    <h3>Game Over!</h3>
    <a class="back" href="../HTML/select_lesson.html">
      <button>Back to Lessons</button>
    </a>
  `;
  document.getElementById("next-btn").style.display = "none";
}

}

function handleDragStart(event, word) {
  event.dataTransfer.setData("text", word);
}

function handleDrop(event, leftValue) {
  if (answered) return;

  const draggedWord = event.dataTransfer.getData("text");
  const expected = matchAnswers[leftValue];
  const dropTarget = event.target;

  if (dropTarget.classList.contains("correct-drop") || dropTarget.classList.contains("incorrect-drop")) {
    return; // already used
  }

  if (draggedWord === expected) {
    dropTarget.classList.add("correct-drop");
    dropTarget.textContent = `${leftValue} → ${draggedWord}`;
    xp += 50;
    correctSound.play();
  } else {
    dropTarget.classList.add("incorrect-drop");
    dropTarget.textContent = `${leftValue} → ${draggedWord}`;
    hearts -= 1;
    wrongSound.play();
    updateHearts();
  }

  matchedCount++;
  document.getElementById("xp-display").innerText = `XP: ${xp}`;

  // ✅ Allow continuing even if not all matches are correct
  if (matchedCount === totalPairs) {
    answered = true;
    document.getElementById("next-btn").disabled = false;
  }
}

function nextQuestion() {
  current++;
  loadQuestion();
}

window.onload = loadQuestion;
