const grid = document.getElementById("game-board");
const numRows = 15;
const numCols = 20;
const gridData = Array.from(Array(numRows), () => Array(numCols).fill(null));
const Mina = {
        name: "M",
        type: 1,
        lvl: 2
    }
let oro = 100;

let selectedStructure = null;

// Función para verificar si una celda está en las orillas de la matriz
function isOnBorder(row, col) {
    return row === 0 || row === numRows - 1 || col === 0 || col === numCols - 1;
}

// Función para verificar si una celda está dentro del "Centro Urbano"
function isCenterCell(row, col) {
    return row >= 6 && row <= 9 && col >= 7 && col <= 10;
}

// Llena al azar algunas celdas con Árboles y Bosques en las orillas
for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell", "empty");
        cell.dataset.row = row;
        cell.dataset.col = col;

        // Si la celda está en las orillas, asigna "Árbol" o "Bosque" al azar
        if (isOnBorder(row, col)) {
            const randomStructure = ["A", "B"][Math.floor(Math.random() * 2)];
            cell.innerHTML = randomStructure;
            cell.setAttribute("data-type", randomStructure);
        }

        // Si la celda está dentro del "Centro Urbano", asigna "CU"
        if (isCenterCell(row, col)) {
            cell.innerHTML = "CU";
            cell.classList.add("occupied");
        }

        cell.addEventListener("mouseenter", () => {
            if (!cell.classList.contains("occupied")) {
                cell.classList.add("hovered");
            } else {
                cell.classList.add("occupied-hovered");
            }
        });

        cell.addEventListener("mouseleave", () => {
            cell.classList.remove("hovered");
            cell.classList.remove("occupied-hovered");
        });

        // Función para verificar si la celda tiene una estructura y realizar la acción correspondiente
        function checkAction(cell) {
            switch (Number(cell.dataset.type)) {
                case 1:
                    setTimeout(() => {
                        oro += 500 * Mina.lvl;
                        document.querySelector('.gold-qtn').innerHTML = oro;
                    }, 5000);
                    break;
            }
        }

        // evento clic para agregar estructuras o realizar acciones en las estructuras existentes
        cell.addEventListener("click", (e) => {
            if (selectedStructure !== null) {
                if (!cell.classList.contains("occupied")) {
                    cell.innerHTML = selectedStructure.name;
                    cell.classList.remove("hovered");
                    cell.classList.add(`occupied`);
                    cell.setAttribute("data-type", selectedStructure.type);
                    selectedStructure = null;

                } else {
                    alert("Esta casilla ya está ocupada.");
                }
            } else {
                checkAction(cell);
            }
        });

        grid.appendChild(cell);
    }
}

// Función para seleccionar una estructura
function selectStructure(structure) {
    selectedStructure = structure;
}

// Agregar botones para seleccionar estructuras
const structureButtons = document.createElement("div");
structureButtons.innerHTML = `
            <button onclick="selectStructure(Mina)">Mina de Oro (M)</button>
            <button onclick="selectStructure('E')">Recolector de Elixir (E)</button>
            <button onclick="selectStructure('D')">Torre de Defensa (D)</button>
            <button onclick="selectStructure('C')">Cuartel (C)</button>
            <button onclick="selectStructure('A')">Almacén (A)</button>
        `;

structureNavRecourse = document.createElement("div");
structureNavRecourse.innerHTML = `
           <div>Oro: <span class="gold-qtn">${oro}</div></div></div>
        `;
document.querySelector('.structures').appendChild(structureButtons);
document.querySelector('.nav').appendChild(structureNavRecourse);