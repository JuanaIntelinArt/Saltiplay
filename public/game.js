let pasos = [];
let estado = "inicio";

// Ingredientes en orden lógico
const ingredientesOrdenados = [
  "olla.png",               // Se transforma en guisocucha
  "aceitunacucha.png",
  "huevocucha.png",
  "lechugas.png",
  "tomates.png",
  "queso.png",
  "saltena_cerrada.png"
];

// Mostrar ingredientes en pantalla
ingredientesOrdenados.forEach(nombre => {
  const img = document.createElement("img");
  img.src = nombre;
  img.className = "ingrediente";
  img.draggable = true;
  img.ondragstart = empezarArrastre;
  document.getElementById("zona-ingredientes").appendChild(img);
});

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

  if (estado === "inicio" && ingrediente === "olla.png") {
    mostrarImagen("guisocucha.png");
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
    validarArmado();
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
  document.getElementById("mesa").appendChild(img);
}

function validarArmado() {
  fetch('/validar-armado', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pasos })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.mensaje);
    if (data.resultado === "correcto") {
      fetch('/generate-quiz')
        .then(res => res.json())
        .then(quiz => {
          console.log("🎉 Quiz activado:", quiz);
          alert("¡Ganaste! Mira la consola para ver las preguntas.");
        });
    }
  });
}