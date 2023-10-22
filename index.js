const grid = document.getElementById("game-board");
const numRows = 15;
const numCols = 20;
const gridData = Array.from(Array(numRows), () => Array(numCols).fill(null));
const UrbanCenter = {
  name: "CU",
  type: 0,
  lvl: 1,
  updatePrice: 500,
  maxNumberOfHouses: 2,
  maxNumberOfMines: 2
}
const Mina = {
  name: "M",
  type: 1,
  lvl: 1,
  price: 200,
  updatePrice: 200
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
let clickedCell = null;

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
      cell.setAttribute("data-type", 0);
      cell.setAttribute("data-lvl", 1);
      cell.classList.add("occupied");
      cell.classList.add("cu");
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

          const counter = setInterval(() => {
            time--;
            document.querySelector(`.gold-farmer-time-${activeMineId}`).innerHTML = time;
            if (time === 0) {
              clearInterval(counter);
            }
          }, 1000);

          setTimeout(() => {
            gold += 500 * cell.dataset.lvl;
            document.querySelector('.gold-qtn').innerHTML = gold;
            document.querySelector(`.gold-farmer-${activeMineId}`).remove();
          }, goldTime * 1000);
          activeGoldFarmer++; // auementa la cantidad de minas activa
          break;
      }
      clickedCell = null;
    }

    function checkTypeStructure () {
      switch (cell.dataset.type) {
        case "0":
          // return UrbanCenter;
        case "1":
          document.querySelector('.mines-qtn').innerHTML = `${numberOfMines} / ${UrbanCenter.maxNumberOfMines}`;
          break;
        case "2":
          // return Casa;
      }
    }

    // evento clic para agregar estructuras o realizar acciones en las estructuras existentes
    cell.addEventListener("click", (e) => {
      clickedCell = cell;
      if (selectedStructure !== null) {
        if (!cell.classList.contains("occupied")) {
          cell.innerHTML = selectedStructure.name;
          cell.classList.remove("hovered");
          cell.classList.add(`occupied`);
          cell.setAttribute("data-type", selectedStructure.type);
          cell.setAttribute("data-lvl", selectedStructure.lvl);
          selectedStructure = null;
          checkTypeStructure(cell);

        } else {
          alert("Esta casilla ya está ocupada.");
        }
      } else if (clickedCell.innerHTML !== "") {
        structureAction(cell);
      }
    });

    grid.appendChild(cell);
  }
}

const modal = document.getElementById('myModal');
const updateBtn = document.getElementById('updateBtn');
const farmBtn = document.getElementById('farmBtn');

// mejorar estructura
updateBtn.addEventListener('click', function() {
  modal.style.display = 'none';
  updateStructure();
});

// recolectar oro
farmBtn.addEventListener('click', function() {
  modal.style.display = 'none';
  checkAction(clickedCell);
});

function structureAction(cell) {
  farmBtn.style.display = 'inline-block';
  switch (cell.dataset.type) {
    case "0":
      document.querySelector('.structure-info').innerHTML =
        ` 
         Costo de la mejora ${cell.dataset.lvl * UrbanCenter.updatePrice} <br>
         Oro disponible: ${gold}
      `;
      farmBtn.style.display = 'none';
      modal.style.display = 'block';
      break;
    case "1":
      document.querySelector('.structure-info').innerHTML =
        ` 
         Costo de la mejora ${cell.dataset.lvl * Mina.updatePrice} <br>
         Oro disponible: ${gold}
      `;
      modal.style.display = 'block';
      break;
  }
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
          numberOfMines++;
          document.querySelector('.gold-qtn').innerHTML = gold;
        } else {
          alert("No tienes suficiente oro para comprar esta Mina.");
          selectedStructure = null;
        }
    }
}

function updateStructure () {
  switch (clickedCell.dataset.type) {
    case "0":
      if (gold >= UrbanCenter.updatePrice * clickedCell.dataset.lvl) {
        gold -= UrbanCenter.updatePrice * clickedCell.dataset.lvl;
        document.querySelectorAll('.cu').forEach((cu) => {
          cu.setAttribute('data-lvl', Number(cu.dataset.lvl) + 1);
        })
        UrbanCenter.lvl++;
        UrbanCenter.maxNumberOfMines += 2;
        UrbanCenter.maxNumberOfHouses += 2;
        document.querySelector('.mines-qtn').innerHTML = `${numberOfHouses} / ${UrbanCenter.maxNumberOfHouses}`;
      } else {
        alert("No tienes suficiente oro para avanzar a la siguiente edad.");
      }
      break;
    case "1":
      if (gold >= Mina.updatePrice * clickedCell.dataset.lvl) {
        gold -= Mina.updatePrice * clickedCell.dataset.lvl;
        clickedCell.setAttribute('data-lvl', Number(clickedCell.dataset.lvl) + 1);
      } else {
        alert("No tienes suficiente oro para actualizar esta Mina.");
      }
  }
  document.querySelector('.gold-qtn').innerHTML = gold;
  clickedCell = null;
}

// Agregar botones para seleccionar estructuras
const structureButtons = document.createElement("div");
structureButtons.innerHTML = `
    <button onclick="selectStructure(Mina)">Mina de gold (M)</button>
    <button onclick="selectStructure(Casa)">Casa (C)</button>
`;

const structureNavRecourse = document.createElement("div");
structureNavRecourse.innerHTML = `
     <span>
        Oro: <span class="gold-qtn">${gold}</span>
        Workers: <span class="workers-qtn">${numberOfHouses}</span>
        Houses: <span class="houses-qtn">${numberOfHouses}</span>
        Mines: <span class="mines-qtn">${numberOfHouses} / ${UrbanCenter.maxNumberOfMines}</span>
     </span>
  `;

document.querySelector('.structures').appendChild(structureButtons);
document.querySelector('.nav').appendChild(structureNavRecourse);