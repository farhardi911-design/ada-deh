/* =========================
   QUIZ GAME
========================= */

const questions = [
  {
    question: "Apa kegiatan yang sangat disukai sahabat lu keii?",
    type: "choice",
    answers: [" tidur", "Main game", "Jalan-jalan", "Nonton film"],
    correct: " tidur"
  },
  {
    question: "Apa hobi sahabat lu keii?",
    type: "choice",
    answers: ["Baca Manhwa", "Main game", "Mancing", "Olahraga"],
    correct: "Baca Manhwa"
  },
  {
    question: "Gimana sifat sahabat lu keii?",
    type: "choice",
    answers: ["Baik", "Tengil", "bercanda", "Pendiam"],
    correct: " bercanda"
  },
  {
    question: "Apa yang lu tahu tentang sahabat lu keii?",
    type: "text"
  },
  {
    question: "Kapan tanggal lahir sahabat lu keii?",
    type: "choice",
    answers: [
      "16 Maret 2010",
      "16 April 2010",
      "17 Maret 2010",
      "15 Maret 2010"
    ],
    correct: "16 Maret 2010"
  }
];

let currentQuestion = 0;
let score = 0;


/* =========================
   GOOGLE APPS SCRIPT
========================= */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxBJZRgl8BnXnDFVJUNwIHnoqKCQvjjNgfM5hMrSV_T1ceNrv0EJoa6gN3_L9CUR4uF/exec";


function sendQuestion4Answer(answer) {
  if (!answer || !answer.trim()) return;

  const status = document.getElementById("question4Status");

  if (status) {
    status.textContent = "Mengirim jawaban...";
    status.className = "question4-status sending";
  }

  try {
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        question: "Apa yang kamu ketahui tentang temanmu?",
        answer: answer.trim()
      }),
      keepalive: true
    });

    if (status) {
      status.textContent = "Jawaban dikirim ♡";
      status.className = "question4-status success";
    }

  } catch (error) {
    console.error("Gagal mengirim jawaban:", error);

    if (status) {
      status.textContent = "Game tetap lanjut.";
      status.className = "question4-status error";
    }
  }
}


/* =========================
   LOAD QUESTION
========================= */

function loadQuestion() {
  const q = questions[currentQuestion];

  const questionNumber =
    document.getElementById("questionNumber");

  const question =
    document.getElementById("question");

  const answers =
    document.getElementById("answers");

  const textAnswer =
    document.getElementById("textAnswer");

  const nextButton =
    document.getElementById("nextButton");

  const progressBar =
    document.getElementById("progressBar");

  questionNumber.textContent =
    `Pertanyaan ${currentQuestion + 1} / ${questions.length}`;

  question.textContent = q.question;

  answers.innerHTML = "";

  textAnswer.value = "";

  const question4Status = document.getElementById("question4Status");
  if (question4Status) {
    question4Status.textContent = "";
    question4Status.className = "question4-status";
  }

  nextButton.disabled = true;

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  progressBar.style.width = progress + "%";


  /* PILIHAN GANDA */

  if (q.type === "choice") {

    answers.style.display = "grid";
    textAnswer.style.display = "none";

    q.answers.forEach(answer => {

      const button = document.createElement("button");

      button.className = "answer-btn";
      button.type = "button";
      button.textContent = answer;

      button.onclick = () => {

        const allButtons =
          document.querySelectorAll(".answer-btn");

        allButtons.forEach(btn => {
          btn.disabled = true;
        });

        if (answer === q.correct) {

          button.classList.add("correct");
          score++;
          updateScore();

        } else {

          button.classList.add("wrong");

          allButtons.forEach(btn => {

            if (btn.textContent === q.correct) {
              btn.classList.add("correct");
            }

          });
        }

        nextButton.disabled = false;
      };

      answers.appendChild(button);
    });

  }


  /* JAWABAN TEKS */

  else if (q.type === "text") {

    answers.style.display = "none";
    textAnswer.style.display = "block";

    textAnswer.oninput = () => {
      nextButton.disabled =
        textAnswer.value.trim() === "";
    };
  }
}


/* =========================
   NEXT QUESTION
========================= */

function nextQuestion() {

  const q = questions[currentQuestion];


  /* NOMOR 4 = KIRIM EMAIL */

  if (q.type === "text") {

    const text =
      document.getElementById("textAnswer").value.trim();

    if (!text) return;

    // Kirim tanpa menunggu email
    void sendQuestion4Answer(text);
  }


  currentQuestion++;


  if (currentQuestion < questions.length) {

    loadQuestion();

  } else {

    showResult();
  }
}


/* =========================
   SHOW RESULT
========================= */

function showResult() {

  document.getElementById("quiz").style.display = "none";

  document.getElementById("result").style.display = "block";

  const resultTitle =
    document.getElementById("resultTitle");

  const resultText =
    document.getElementById("resultText");


  if (score === 0) {

    resultTitle.textContent = "DASAR BEGO 😹";

    resultText.textContent =
      "SAHABAT LU AJA LUPA 😂😹";

  }

  else if (score === 4) {

    resultTitle.textContent =
      "keren keii lu masih inget my best freinds!";

    resultText.textContent =
      `Skor kamu ${score}/4. Gila keii berarti lu emang inget gw, sahabat lu keii!`;

  }

  else if (score >= 2) {

    resultTitle.textContent =
      "😎 berarti lu masih kenal gw walau udah lupa";

    resultText.textContent =
      `Skor kamu ${score}/4. mayan tapi gw hampir dilupain, not bad!`;

  }

  else {

    resultTitle.textContent =
      "😂 parah lu udah lupa sama gw ya keii..";

    resultText.textContent =
      `Skor kamu ${score}/4. Kayaknya lu emang lupa tapi pura2 inget😹`;

  }


  const afterGameButton =
    document.getElementById("afterGameButton");

  if (afterGameButton) {
    afterGameButton.style.display = "block";
  }
}


/* =========================
   RESTART QUIZ
========================= */

function restartQuiz() {

  currentQuestion = 0;
  score = 0;

  document.getElementById("quiz").style.display = "block";

  document.getElementById("result").style.display = "none";

  document.getElementById("afterGameButton").style.display = "none";

  document.getElementById("score").textContent =
    "Skor: 0";

  loadQuestion();
}


/* =========================
   UPDATE SCORE
========================= */

function updateScore() {

  const scoreElement =
    document.getElementById("score");

  if (scoreElement) {
    scoreElement.textContent =
      `Skor: ${score}`;
  }
}


/* =========================
   AMBIL SURAT
========================= */

function openSurprise() {
  const loading = document.getElementById("loading");

  if (loading) {
    loading.classList.add("show");
  }

  setTimeout(() => {
    if (loading) {
      loading.classList.remove("show");
    }

    document.body.classList.remove("lock-scroll");

    document.getElementById("surat")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 1800);
}


/* =========================
   KE GAME
========================= */

function goToGame() {

  document.getElementById("kenangan")
    ?.scrollIntoView({
      behavior: "smooth"
    });
}


/* =========================
   MUSIK
========================= */

const music =
  document.getElementById("music");

const musicStatus =
  document.getElementById("musicStatus");


if (music) {

  music.addEventListener("loadedmetadata", () => {

    if (musicStatus) {
      musicStatus.textContent =
        "Musik siap diputar ♡";
    }

  });


  music.addEventListener("play", () => {

    if (musicStatus) {
      musicStatus.textContent =
        "♫ Musik sedang diputar...";
    }

  });


  music.addEventListener("pause", () => {

    if (
      music.currentTime > 0 &&
      !music.ended
    ) {

      if (musicStatus) {
        musicStatus.textContent =
          "Musik dijeda.";
      }

    }

  });


  music.addEventListener("ended", () => {

    if (musicStatus) {
      musicStatus.textContent =
        "Musik selesai ♡";
    }

  });


  music.addEventListener("error", () => {

    if (musicStatus) {
      musicStatus.textContent =
        "File audio tidak ditemukan.";
    }

  });
}


function playMusic() {

  const audio =
    document.getElementById("music");

  if (!audio) return;

  audio.play().catch(error => {

    console.error(
      "Gagal memutar musik:",
      error
    );

  });
}


function stopMusic() {

  const audio =
    document.getElementById("music");

  if (!audio) return;

  audio.pause();

  audio.currentTime = 0;

  if (musicStatus) {

    musicStatus.textContent =
      "Musik dimatikan.";

  }
}


/* =========================
   OPEN ENVELOPE
========================= */

const openLetter =
  document.getElementById("openLetter");

if (openLetter) {

  openLetter.addEventListener("click", openSurprise);

  openLetter.addEventListener("keydown", event => {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();

      openSurprise();
    }

  });
}


/* =========================
   START GAME
========================= */

document.addEventListener("DOMContentLoaded", () => {

  loadQuestion();

});