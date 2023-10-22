const grid = document.getElementById("game-board");
const numRows = 15;
const numCols = 20;
const gridData = Array.from(Array(numRows), () => Array(numCols).fill(null));
const UrbanCenter = {
  name: "CU",
  type: 0,
  lvl: 1,
  maxNumberOfHouses: 2,
  maxNumberOfMines: 2
}
const Mina = {
  name: "M",
  type: 1,
  lvl: 2,
  price: 200
}
const Casa = {
  name: "C",
  type: 2,
  lvl: 1,
  price: 100
}
let numberOfHouses = 0;
let numberOfMines = 0;
let numberOfWorkers = 2;
let gold = 500;
goldTime = 5;
activeGoldFarmer = 1;

let selectedStructure = null;
const recourseData = {
  maxGoldFarmers: 2
}

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
      cell.classList.add("occupied");
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
          let time = goldTime;
          let activeMineId = activeGoldFarmer;


          const structureGoldFarmer = document.createElement('div');
          structureGoldFarmer.innerHTML = `
            <div class="gold-farmer-${activeMineId}">
              Tiempo restante de oro: <span class="gold-farmer-time-${activeMineId}">${goldTime}</span>
            </div>
          `;
          document.querySelector('.game-info').appendChild(structureGoldFarmer);

          const conuter = setInterval(() => {
            time--;
            document.querySelector(`.gold-farmer-time-${activeMineId}`).innerHTML = time;
            if (time === 0) {
              clearInterval(conuter);
            }
          }, 1000);

          setTimeout(() => {
            gold += 500 * Mina.lvl;
            document.querySelector('.gold-qtn').innerHTML = gold;
            document.querySelector(`.gold-farmer-${activeMineId}`).remove();
          }, goldTime * 1000);
          activeGoldFarmer++; // auementa la cantidad de minas activa
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

  const modal = document.getElementById('myModal');
  const opcion1Btn = document.getElementById('opcion1Btn');
  const opcion2Btn = document.getElementById('opcion2Btn');

  // openModalBtn.addEventListener('click', function() {
  //   modal.style.display = 'block';
  // });

  opcion1Btn.addEventListener('click', function() {
    // Lógica para la opción 1
    modal.style.display = 'none';
  });

  opcion2Btn.addEventListener('click', function() {
    // Lógica para la opción 2
    modal.style.display = 'none';
  });
}

// Función para seleccionar una estructura
function selectStructure(structure) {
  selectedStructure = structure;

    switch (structure.name) {
      case "C":
        // Si la estructura es una Casa, se verifica si hay suficiente oro para comprarla
        if (gold >= structure.price && numberOfHouses < UrbanCenter.maxNumberOfHouses) {
          gold -= structure.price;
          numberOfHouses++;
          document.querySelector('.gold-qtn').innerHTML = gold;
        } else {
          alert("No tienes suficiente oro para comprar esta Casa.");
          selectedStructure = null;
        }
        break;

      case "M":
        // Si la estructura es una Mina, se verifica si hay suficiente oro para comprarla
        if (gold >= structure.price && numberOfMines < UrbanCenter.maxNumberOfMines) {
          gold -= structure.price;
          document.querySelector('.gold-qtn').innerHTML = gold;
        } else {
          alert("No tienes suficiente oro para comprar esta Mina.");
          selectedStructure = null;
        }
    }
}

// Agregar botones para seleccionar estructuras
const structureButtons = document.createElement("div");
structureButtons.innerHTML = `
    <button onclick="selectStructure(Mina)">Mina de gold (M)</button>
    <button onclick="selectStructure('E')">Recolector de Elixir (E)</button>
    <button onclick="selectStructure('D')">Torre de Defensa (D)</button>
    <button onclick="selectStructure(Casa)">Casa (C)</button>
`;

const structureNavRecourse = document.createElement("div");
structureNavRecourse.innerHTML = `
     <span>
        Oro: <span class="gold-qtn">${gold}</span>
        Workers: <span class="workers-qtn">${numberOfWorkers}</span>
        Houses: <span class="houses-qtn">${numberOfHouses}</span>
     </span>
  `;

document.querySelector('.structures').appendChild(structureButtons);
document.querySelector('.nav').appendChild(structureNavRecourse);