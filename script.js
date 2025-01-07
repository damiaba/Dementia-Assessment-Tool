// Dementia Assessment Tool with Live Score Display

const app = (() => {
  let currentQuestion = 0;
  let score = 0;

// Helper function to get today's date info
const getTodayInfo = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Adding 1 as months are 0-based
  const date = String(today.getDate()).padStart(2, '0'); // Adds leading zero for single digit dates
  const day = today.toLocaleString('default', { weekday: 'long' });

  const seasons = {
    0: "Winter", 1: "Winter", 2: "Spring", 3: "Spring", 4: "Spring", 5: "Summer",
    6: "Summer", 7: "Summer", 8: "Fall", 9: "Fall", 10: "Fall", 11: "Winter",
  };
  const season = seasons[today.getMonth()];

  const formattedDate = `${date}/${month}/${year}`; // Date in DD/MM/YYYY format

  return { year, month, date, day, season, formattedDate };
};

const todayInfo = getTodayInfo();

  // Updated question set based on SMMSE
  const questions = [
    { question: "What year is this?", type: "text", score: 1, correctAnswer: todayInfo.year.toString() },
    { question: "What season is this?", type: "text", score: 1, correctAnswer: todayInfo.season },
    { question: "What month is this? In Digits", type: "text", score: 1, correctAnswer: todayInfo.month },
    { question: "What is today’s date? Format:DD/MM/YYYY", type: "text", score: 1, correctAnswer: todayInfo.formattedDate },
    { question: "What day of the week is this?", type: "text", score: 1, correctAnswer: todayInfo.day },
    { question: "What country are we in?", type: "text", score: 1, correctAnswer: "Ireland" },
    { question: "What province are we in?", type: "text", score: 1, correctAnswer: "Leinster" },
    { question: "What city/town are we in?", type: "text", score: 1, correctAnswer: "Dublin" },
    { question: "What is the name of this building?", type: "text", score: 1, correctAnswer: "Hospital" },
    { question: "What floor are we on?", type: "text", score: 1, correctAnswer: "5th" },
    { question: "Repeat these objects: Ball, Car, Man.", type: "choice", score: 3 },
    { question: "Spell 'WORLD' backwards.", type: "choice", score: 5 },
    { question: "What were the three objects I asked you to remember?", type: "choice", score: 3 },
    { question: "What is this object? (Show wristwatch)", type: "choice", score: 1 },
    { question: "What is this object? (Show pencil)", type: "choice", score: 1 },
    { question: "Repeat the phrase: 'No ifs, ands or buts.'", type: "choice", score: 1 },
    { question: "Read this and do what it says: CLOSE YOUR EYES.", type: "choice", score: 1 },
    { question: "Write a complete sentence.", type: "choice", score: 1 },
    { question: "Copy this design (two intersecting pentagons).", type: "choice", score: 1 },
    { question: "Take this paper, fold it in half, and place it on the floor.", type: "choice", score: 3 },
  ];

  const resultsCriteria = [
    { min: 26, max: 30, label: "Could be normal" },
    { min: 20, max: 25, label: "Mild signs of dementia" },
    { min: 10, max: 19, label: "Moderate signs of dementia" },
    { min: 0, max: 9, label: "Severe signs of dementia" },
  ];

  const loadQuestion = () => {
    if (currentQuestion < questions.length) {
      const q = questions[currentQuestion];
      const questionElem = document.getElementById("question");
      const answerSection = document.getElementById("answer-section");
      const scoreElem = document.getElementById("score-display");

      if (!questionElem || !answerSection || !scoreElem) {
        console.error("Missing DOM elements");
        return;
      }

      questionElem.textContent = q.question;
      answerSection.innerHTML = ""; // Clear previous question
      scoreElem.textContent = `Current Score: ${score}/30`;

      if (q.type === "text") {
        const input = document.createElement("input");
        input.type = "text";
        input.id = "answer";
        input.placeholder = "Enter your answer here";
        answerSection.appendChild(input);

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit Answer";
        submitBtn.onclick = () => {
          const userAnswer = document.getElementById("answer")?.value.trim();
          if (userAnswer && userAnswer.toLowerCase() === q.correctAnswer.toLowerCase()) {
            score += q.score;
            scoreElem.textContent = `Current Score: ${score}/30`;
          }
          currentQuestion++;
          loadQuestion(); // Load next question
        };
        answerSection.appendChild(submitBtn);
      } else if (q.type === "choice") {
        const correctBtn = document.createElement("button");
        correctBtn.textContent = "Correct";
        correctBtn.onclick = () => submitAnswer(true);
        const incorrectBtn = document.createElement("button");
        incorrectBtn.textContent = "Incorrect";
        incorrectBtn.onclick = () => submitAnswer(false);
        answerSection.appendChild(correctBtn);
        answerSection.appendChild(incorrectBtn);
      }
    } else {
      showResults();
    }
  };

  const submitAnswer = (isCorrect) => {
    const question = questions[currentQuestion];
    const scoreElem = document.getElementById("score-display");

    if (question.type === "choice" && isCorrect) {
      score += question.score;
      scoreElem.textContent = `Current Score: ${score}/30`;
    }

    currentQuestion++;
    loadQuestion();
  };

  const showResults = () => {
    const result = resultsCriteria.find(
      (criteria) => score >= criteria.min && score <= criteria.max
    );
    document.getElementById("quiz-container").innerHTML = `
      <h2>Results</h2>
      <p>Your total score: ${score}/30</p>
      <p>Assessment: ${result.label}</p>
      <button onclick="location.reload()">Restart</button>
    `;
  };

  return {
    start: () => {
      const startBtn = document.getElementById("start-btn");
      if (startBtn) {
        startBtn.addEventListener("click", () => {
          document.getElementById("registration").style.display = "none";
          document.getElementById("quiz-container").style.display = "block";
          const scoreElem = document.createElement("div");
          scoreElem.id = "score-display";
          scoreElem.textContent = `Current Score: ${score}/30`;
          document.getElementById("quiz-container").prepend(scoreElem);
          loadQuestion();
        });
      } else {
        console.error("Start button not found");
      }
    },
  };
})();

window.onload = app.start;

