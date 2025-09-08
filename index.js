const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

function generateQuiz() {
  const subjects = ["She", "He", "They", "I", "We"];
  const verbs = [
    { base: "go", past: "went", future: "will go", present: "goes", ing: "going" },
    { base: "eat", past: "ate", future: "will eat", present: "eats", ing: "eating" },
    { base: "study", past: "studied", future: "will study", present: "studies", ing: "studying" },
    { base: "play", past: "played", future: "will play", present: "plays", ing: "playing" },
    { base: "walk", past: "walked", future: "will walk", present: "walks", ing: "walking" }
  ];
  const complements = ["to the park", "lunch", "English", "soccer", "to the store"];
  const times = {
    past: "yesterday",
    present: "every day",
    future: "tomorrow"
  };

  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const buildSentence = (subject, verb, complement, tense) => {
    switch (tense) {
      case "past": return `${subject} ${verb.past} ${complement} ${times.past}.`;
      case "present": return `${subject} ${verb.present} ${complement} ${times.present}.`;
      case "future": return `${subject} ${verb.future} ${complement} ${times.future}.`;
      case "continuous": return `${subject} is ${verb.ing} ${complement} now.`;
      default: return `${subject} ${verb.base} ${complement}.`;
    }
  };

  const v = random(verbs);
  const c = random(complements);

  return [
    {
      question: "Which sentence correctly uses the simple future tense?",
      options: [
        buildSentence("She", v, c, "past"),
        buildSentence("She", v, c, "present"),
        buildSentence("She", v, c, "continuous"),
        buildSentence("She", v, c, "future")
      ],
      answer: [3]
    },
    {
      question: "Which sentence is written in the simple past tense?",
      options: [
        buildSentence("They", v, c, "future"),
        buildSentence("They", v, c, "present"),
        buildSentence("They", v, c, "continuous"),
        buildSentence("They", v, c, "past")
      ],
      answer: [3]
    },
    {
      question: "Choose the most formal way to introduce yourself:",
      options: [
        "Hey, I'm Alex!",
        "Yo, Alex here!",
        "Hiya, I'm Alex!",
        "Good morning, my name is Alex Smith."
      ],
      answer: [3]
    },
    {
      question: "Which sentence contains a grammar mistake in the future tense?",
      options: [
        "He will goes to the party.",
        "He will go to the party.",
        "He is going to the party.",
        "He shall go to the party."
      ],
      answer: [0]
    },
    {
      question: "Which sentence is grammatically correct in the past tense?",
      options: [
        "I go to the cinema last night.",
        "I went to the cinema last night.",
        "I goes to the cinema last night.",
        "I runned to the store."
      ],
      answer: [1]
    }
  ];
}

app.post('/validar-armado', (req, res) => {
  const { pasos } = req.body;
  const correcto =
    pasos.includes("guisocucha") &&
    pasos.includes("aceitunacucha") &&
    pasos.includes("huevocucha") &&
    pasos.includes("saltena_cerrada") &&
    !pasos.includes("error");

  res.json({
    resultado: correcto ? "correcto" : "incorrecto",
    mensaje: correcto
      ? "¡Salteña armada correctamente!"
      : "Ups... algo salió mal en el armado."
  });
});

app.get('/generate-quiz', (req, res) => {
  const quiz = generateQuiz();
  res.json({ questions: quiz });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});