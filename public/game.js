let pasos = [];
let estado = "inicio";
let tiempo = 0;
let intervalo;

const ingredientesDesordenados = [
  "guisocucha.png",
  "aceitunacucha.png",
  "huevocucha.png",
  "lechugas.png",
  "tomates.png",
  "queso.png",
  "saltena_cerrada.png"
].sort(() => Math.random() - 0.5);

ingredientesDesordenados.forEach(nombre => {
  const img = document.createElement("img");
  img.src = nombre;
  img.className = "ingrediente";
  img.draggable = true;
  img.ondragstart = empezarArrastre;
  document.getElementById("zona-ingredientes").appendChild(img);
});

function iniciarTiempo() {
  intervalo = setInterval(() => {
    tiempo++;
    document.getElementById("tiempo").textContent = `TIEMPO: ${formatearTiempo(tiempo)}`;
  }, 1000);
}

function formatearTiempo(segundos) {
  const min = Math.floor(segundos / 60);
  const sec = segundos % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function detenerTiempo() {
  clearInterval(intervalo);
}

function empezarArrastre(event) {
  const nombre = event.target.src.split('/').pop();
  event.dataTransfer.setData("ingrediente", nombre);
}

function allowDrop(event) {
  event.preventDefault();
}

function soltarIngrediente(event) {
  event.preventDefault();
  const ingrediente = event.dataTransfer.getData("ingrediente");

  if (estado === "inicio" && ingrediente === "guisocucha.png") {
    mostrarImagen("guiso.png");
    pasos.push("guisocucha");
    estado = "masaguiso";
  } else if (estado === "masaguiso" && ingrediente === "aceitunacucha.png") {
    mostrarImagen("aceituna.png");
    pasos.push("aceitunacucha");
  } else if (estado === "masaguiso" && ingrediente === "huevocucha.png") {
    mostrarImagen("huevo.png");
    pasos.push("huevocucha");
  } else if (estado === "masaguiso" && ingrediente === "saltena_cerrada.png") {
    mostrarImagen("saltena_cerrada.png");
    pasos.push("saltena_cerrada");
  } else if (estado === "inicio" && ["lechugas.png", "tomates.png", "queso.png"].includes(ingrediente)) {
    alert("❌ Perdiste: colocaste un ingrediente inválido antes del guiso.");
    pasos.push("error");
  } else if (estado === "masaguiso" && ["lechugas.png", "tomates.png", "queso.png"].includes(ingrediente)) {
    mostrarImagen(ingrediente);
    pasos.push("error");
  } else {
    alert("⚠️ Este ingrediente no puede colocarse ahora.");
  }
}

function mostrarImagen(nombreArchivo) {
  const img = document.createElement("img");
  img.src = nombreArchivo;
  img.className = "colocado";
  img.style.width = "30%";
  img.style.maxWidth = "200px";
  img.style.aspectRatio = "1 / 1";
  img.style.objectFit = "contain";
  img.style.position = "absolute";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%)";
  img.style.zIndex = "2";
  img.style.pointerEvents = "none";
  document.getElementById("mesa").appendChild(img);
}

function validarArmado() {
  detenerTiempo();

  fetch('/validar-armado', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pasos })
  })
  .then(res => res.json())
  .then(data => {
    if (data.resultado === "correcto") {
      fetch(`/generate-quiz?ts=${Date.now()}`)
        .then(res => res.json())
        .then(quiz => {
          mostrarQuizPorPregunta(quiz.questions);
        });
    } else {
      alert("😢 Perdiste. Intenta de nuevo.");
      location.reload();
    }
  });
}

function mostrarQuizPorPregunta(preguntas) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";
  container.style.display = "block";

  let actual = 0;
  let puntaje = 0;

  function mostrarPregunta(index) {
    container.innerHTML = "";

    const q = preguntas[index];
    const title = document.createElement("h3");
    title.textContent = `Pregunta ${index + 1}: ${q.question}`;
    container.appendChild(title);

    q.options.forEach((opcion, i) => {
      const btn = document.createElement("button");
      btn.textContent = opcion;
      btn.className = "opcion-btn";
      btn.onclick = () => {
        const esCorrecta = q.answer.includes(i);
        btn.style.backgroundColor = esCorrecta ? "#4CAF50" : "#f44336";
        btn.style.color = "#fff";
        btn.disabled = true;
        if (esCorrecta) puntaje++;
        container.querySelectorAll(".opcion-btn").forEach(b => b.disabled = true);
      };
      container.appendChild(btn);
    });

    const siguiente = document.createElement("button");
    siguiente.textContent = index < preguntas.length - 1 ? "Siguiente" : "Finalizar";
    siguiente.className = "siguiente-btn";
    siguiente.onclick = () => {
      if (index < preguntas.length - 1) {
        mostrarPregunta(index + 1);
      } else {
        mostrarResultadoFinal();
      }
    };
    container.appendChild(siguiente);
  }

  function mostrarResultadoFinal() {
    container.innerHTML = `<h2>🎉 ¡Has completado el quiz!</h2>
      <p>Tu puntaje: <strong>${puntaje} / ${preguntas.length}</strong></p>
      <button onclick="location.reload()" class="siguiente-btn">Volver a jugar</button>`;
  }

  mostrarPregunta(actual);
}

document.getElementById("btn-horno").addEventListener("click", validarArmado);
iniciarTiempo();