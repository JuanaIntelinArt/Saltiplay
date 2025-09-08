const express = require('express');
const app = express();
const PORT = 3000;

// Esto permite servir archivos como game.html e imágenes
app.use(express.static('public'));

function generateQuiz() {
  const quizzes = [/* ... tus preguntas ... */];
  return quizzes.sort(() => 0.5 - Math.random()).slice(0, 5);
}

app.get('/generate-quiz', (req, res) => {
  res.json({ questions: generateQuiz() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});