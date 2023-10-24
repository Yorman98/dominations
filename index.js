const grid = document.getElementById("game-board");
const numRows = 15;
const numCols = 20;
const gridData = Array.from(Array(numRows), () => Array(numCols).fill(null));
const maxTimeToBuild = 10000; // 15 segundos
const UrbanCenter = {
  name: "CU",
  type: 0,
  lvl: 1,
  updatePrice: 500,
  maxNumberOfHouses: 2,
  maxNumberOfMines: 2,
  maxNumberOfWorkers: 2
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
const Food = {
    name: "F",
    type: 3,
    price: 100
}
let numberOfHouses = 0;
let numberOfMines = 0;
let numberOfWorkers = 2;
let numberOfFood = 0;

let gold = 1500;
let goldTime = 5;
let activeGoldFarmer = 1;
let activeBuilders = 1;

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
        if (!cell.classList.contains("occupied") && numberOfWorkers > 0) {
            var time = maxTimeToBuild / 1000;
            let auxStructure = selectedStructure;
            numberOfWorkers--;
            document.querySelector('.workers-qtn').innerHTML = `${numberOfWorkers} / ${UrbanCenter.maxNumberOfWorkers}`;
            // Mensaje decirle al usuario que la estructura se está construyendo
            const buildingStructure = document.createElement('div');
            let activeBuildersId = activeBuilders;
            buildingStructure.innerHTML = `
                <div class="building-structure-${activeBuildersId}">
                    Construyendo estructura tipo (${auxStructure.name}) en ${time}...
                </div>
            `;
            document.querySelector('.game-info').appendChild(buildingStructure);
            var messageInterval = setInterval(() => {
                document.querySelector(`.building-structure-${activeBuildersId}`).innerHTML = `
                    <div class="building-structure-${activeBuildersId}">
                        Construyendo estructura tipo (${auxStructure.name}) en ${time}...
                    </div>
                `;
                time--;
                if (time === 0) clearInterval(messageInterval);
            }, 1000);
            setTimeout(() => {
                cell.innerHTML = auxStructure.name;
                if(auxStructure.name === "C") {
                    numberOfWorkers++;
                }
                cell.classList.remove("hovered");
                cell.classList.add(`occupied`);
                cell.setAttribute("data-type", auxStructure.type);
                cell.setAttribute("data-lvl", auxStructure.lvl);
                selectedStructure = null;
                checkTypeStructure(cell);
                document.querySelector(`.building-structure-${activeBuildersId}`).remove();
                time = maxTimeToBuild / 1000;
                numberOfWorkers++;
                document.querySelector('.workers-qtn').innerHTML = `${numberOfWorkers} / ${UrbanCenter.maxNumberOfWorkers}`;
            }, maxTimeToBuild);

            activeBuilders++;
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
          document.querySelector('.houses-qtn').innerHTML = numberOfHouses;
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
          document.querySelector('.mines-qtn').innerHTML = `${numberOfMines} / ${UrbanCenter.maxNumberOfMines}`;
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
        document.querySelector('.urban-center-lvl').innerHTML = UrbanCenter.lvl;
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

// Agregar un animal aleatorio en una celda vacía
function showAnimalLetterOnGrid() {
    const emptyCells = document.querySelectorAll(".empty");
    // Elige una celda vacía al azar excepto las celdas en las orillas
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    if (!randomCell.innerHTML) {
        const randomAnimal = "An";
        randomCell.innerHTML = randomAnimal;
        randomCell.classList.add("occupied-by-animal");
        randomCell.classList.remove("empty");
        randomCell.setAttribute("data-type", randomAnimal);

        // Agrega un evento clic para eliminar la letra
        randomCell.addEventListener("click", () => {
            if(randomCell.classList.contains("occupied-by-animal")) {
                // aumentar la cantidad de oro
                gold += 100;
                // actualizar la cantidad de oro en el DOM
                document.querySelector('.gold-qtn').innerHTML = gold;
                // aumentar la cantidad de comida
                numberOfFood++;
                // actualizar la cantidad de comida en el DOM
                document.querySelector('.food-qtn').innerHTML = numberOfFood;
                randomCell.innerHTML = '';
                randomCell.classList.add("empty");
                randomCell.classList.remove("occupied-by-animal");
                randomCell.removeAttribute("data-type");
            }
        });

        // configura un temporizador para eliminar la letra después de un cierto tiempo
        setTimeout(() => {
        randomCell.innerHTML = '';
        randomCell.classList.add("empty");
        randomCell.classList.remove("occupied");
        randomCell.removeAttribute("data-type");
        }, 5000); // Cambia 5000 a la cantidad de tiempo deseada en milisegundos
    }
}  

// Agregar botones para seleccionar estructuras
const structureButtons = document.createElement("div");
structureButtons.innerHTML = `
    <button onclick="selectStructure(Mina)">Mina de gold (M)</button>
    <button onclick="selectStructure(Casa)">Casa (C)</button>
`;

const structureNavRecourse = document.createElement("div");
structureNavRecourse.innerHTML = `
     <div class="nav-info">
        <span class="info-container">Nivel de la aldea: <span class="urban-center-lvl">${UrbanCenter.lvl}</span></span>
        <span class="info-container">Oro: <span class="gold-qtn">${gold}</span></span>
        <span class="info-container">Workers: <span class="workers-qtn">${numberOfWorkers} / ${UrbanCenter.maxNumberOfWorkers}</span></span>
        <span class="info-container">Houses: <span class="houses-qtn">${numberOfHouses} / ${UrbanCenter.maxNumberOfHouses}</span></span>
        <span class="info-container">Mines: <span class="mines-qtn">${numberOfHouses} / ${UrbanCenter.maxNumberOfMines}</span></span>
        <span class="info-container">Food: <span class="food-qtn">${numberOfFood}</span></span>
     </div>
  `;

document.querySelector('.structures').appendChild(structureButtons);
document.querySelector('.nav').appendChild(structureNavRecourse);
// Agregar un temporizador para mostrar un animal aleatorio en una celda vacía cada 15 segundos
setInterval(showAnimalLetterOnGrid, 15000); 