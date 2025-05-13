// Cargar las frecuencias de palabras guardadas en localStorage, si existen
let wordFrequencies = JSON.parse(localStorage.getItem('wordFrequencies')) || {};

document.addEventListener('DOMContentLoaded', function () {
    // Agregar el evento click al botón "Analizar"
    const analyzeBtn = document.getElementById('analizarBtn');
    analyzeBtn.addEventListener('click', analyzeText);
    
    // Mostrar los resultados al cargar la página
    displayResults();
});

function analyzeText() {
    // Obtener el texto del input
    const textInput = document.getElementById('text-input');
    const text = textInput.value;

    // Enviar el texto al backend usando fetch
    fetch('../php/analyze.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Respuesta del servidor no fue OK');
        }
        return response.json();
    })
    .then(data => {
        // Actualizar las frecuencias con los nuevos resultados
        updateWordFrequencies(data);
        // Mostrar los resultados actualizados
        displayResults();
        // Guardar las frecuencias en localStorage
        saveFrequencies();
    })
    .catch(error => {
        console.error('Error al analizar el texto:', error);
    });
}

function updateWordFrequencies(newData) {
    // Actualizar las frecuencias de las palabras
    for (const [word, frequency] of Object.entries(newData)) {
        if (wordFrequencies[word]) {
            // Si la palabra ya existe, sumar la nueva frecuencia
            wordFrequencies[word] += frequency;
        } else {
            // Si la palabra no existe, agregarla
            wordFrequencies[word] = frequency;
        }
    }
}

function displayResults() {
    // Obtener el contenedor donde se mostrarán los resultados
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Limpiar resultados anteriores

    // Si no hay palabras, mostrar un mensaje de no encontradas
    if (Object.keys(wordFrequencies).length === 0) {
        resultDiv.innerHTML = '<p>No se encontraron palabras significativas.</p>';
        return;
    }

    // Crear una tabla para mostrar las palabras y sus frecuencias
    let output = '<table class="table table-bordered table-striped"><thead><tr><th>Palabra</th><th>Frecuencia</th></tr></thead><tbody>';

    for (const [word, frequency] of Object.entries(wordFrequencies)) {
        output += `<tr><td>${word}</td><td>${frequency}</td></tr>`;
    }

    output += '</tbody></table>';
    resultDiv.innerHTML = output;
}

function saveFrequencies() {
    // Guardar las frecuencias de las palabras en localStorage
    localStorage.setItem('wordFrequencies', JSON.stringify(wordFrequencies));
}
