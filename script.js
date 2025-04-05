document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById('start-btn');
  const startBtnStat = document.getElementById('start-btn-stat');
  const startScreen = document.getElementById('avatar-screen');
  const gameScreen = document.getElementById('game-screen');
  const statScreen = document.getElementById('stat-screen');
  const questionElement = document.getElementById('question');
  const answerBtns = document.querySelectorAll('.answer-btn');
  const statMessage = document.getElementById('stat-message');
  const timerText = document.getElementById('timer-text');
  const randomNameBtn = document.getElementById('random-name-btn');
  const generatedNameElement = document.getElementById('generated-name');
  const avatarImages = document.querySelectorAll('.avatar');
  const genderSelect = document.getElementById('gender-select');

  let selectedAvatar = null;
  let correctAnswers = 0;
  let totalQuestions = 0;
  let currentQuestion = {};
  let timeLeft = 60;
  let timerInterval;
  let playerName = "";
  const maleNames = ["evelone", "lebiga", "zloy", "pirat", "stariy_bog", "prime_Freemok"];
  const femaleNames = ["barbie_girl", "gensyxa", "by_owl", "Анастасія", "Світлана"];
  const signs = ["+", "-", "*", "/"];

  function generateRandomName() {
    const gender = genderSelect.value;
    const names = gender === "male" ? maleNames : femaleNames;
    const name = names[Math.floor(Math.random() * names.length)];
    playerName = name;
    generatedNameElement.textContent = `Ваше ім'я: ${name}`;
    startBtn.classList.remove('hidden');
  }

  avatarImages.forEach(img => {
    img.addEventListener('click', () => {
      avatarImages.forEach(avatar => avatar.classList.remove('selected'));
      img.classList.add('selected');
      selectedAvatar = img.src;
    });
  });

  function updateTimer() {
    timerText.textContent = `${timeLeft} сек`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showStatistics();
    } else {
      timeLeft--;
    }
  }

  function showStatistics() {
    const accuracy = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    statMessage.innerHTML = `Ви дали ${correctAnswers} правильних відповідей з ${totalQuestions}<br>Точність: ${accuracy}%`;
    gameScreen.classList.add('hidden');
    statScreen.classList.remove('hidden');
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomSign() {
    return signs[getRandomInt(0, signs.length - 1)];
  }

  class Question {
    constructor() {
      const num1 = getRandomInt(1, 30);
      const num2 = getRandomInt(1, 30);
      const sign = getRandomSign();
      let correctAnswer;

      switch (sign) {
        case "+":
          correctAnswer = num1 + num2;
          break;
        case "-":
          correctAnswer = num1 - num2;
          break;
        case "*":
          correctAnswer = num1 * num2;
          break;
        case "/":
          correctAnswer = (num1 / num2).toFixed(1);
          break;
      }

      this.questionText = `${num1} ${sign} ${num2}`;
      this.correctAnswer = correctAnswer;

      const answers = [
        correctAnswer,
        getRandomInt(1, 60),
        getRandomInt(1, 60),
        getRandomInt(1, 60),
      ];

      shuffle(answers);
      this.answers = answers;
    }

    display() {
      questionElement.textContent = this.questionText;
      answerBtns.forEach((btn, index) => {
        btn.textContent = this.answers[index];
        btn.onclick = this.checkAnswer.bind(this);
      });
    }

    checkAnswer(event) {
      const selectedAnswer = parseFloat(event.target.textContent);
      if (selectedAnswer === parseFloat(this.correctAnswer)) {
        correctAnswers++;
        event.target.style.backgroundColor = "#28a745";
      } else {
        event.target.style.backgroundColor = "#dc3545";
      }

      totalQuestions++;
      setTimeout(() => {
        event.target.style.backgroundColor = "#007bff";
        loadNextQuestion();
      }, 1000);
    }
  }

  function loadNextQuestion() {
    currentQuestion = new Question();
    currentQuestion.display();
  }

  startBtn.addEventListener('click', function () {
    if (!selectedAvatar) {
      alert("Виберіть аватар!");
      return;
    }

    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    correctAnswers = 0;
    totalQuestions = 0;
    timeLeft = 60;
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
    loadNextQuestion();
  });

  startBtnStat.addEventListener('click', function () {
    statScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  });

  randomNameBtn.addEventListener('click', generateRandomName);
});
