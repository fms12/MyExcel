let rows = 100;
let cols = 26;
 
let addressColContainer = document.querySelector(".address-column-container");
let addressRowContainer = document.querySelector(".address-row-container");
let cellsContainer = document.querySelector(".cells-container")
let addressBar = document.querySelector(".address-bar")

//Columns
for (let i = 0; i < rows; i++) {
  let addressColCell = document.createElement("div");
  addressColCell.setAttribute("class", "address-column");
  addressColCell.innerText = i + 1;
  addressColContainer.appendChild(addressColCell);
}

//Rows
for (let i = 0; i < cols; i++) {
  let addressRow = document.createElement("div");
  addressRow.setAttribute("class", "address-row");
  addressRow.innerText = String.fromCharCode(65 + i);
  addressRowContainer.appendChild(addressRow);
}

//Columns for every row
for (let i = 0; i < rows; i++) {
    let rowContainer = document.createElement("div");
    rowContainer.setAttribute("class","rowContainer");
    for (let j = 0; j < cols; j++) {
        let cell = document.createElement("div");
        cell.setAttribute("class","cell");
        cell.setAttribute("contenteditable","true");
        cell.setAttribute("spellcheck",false);

        // For cell and column identificatio
        cell.setAttribute("rid",i);
        cell.setAttribute("cid",j);

        rowContainer.appendChild(cell);
        addListenerForAddressBarDisplay(cell, i, j);
    }
    cellsContainer.appendChild(rowContainer);
}

// Row Column value
function addListenerForAddressBarDisplay(cell, i, j){
    cell.addEventListener("click", (e) => {
        let rowID = i+1;
        let colID = String.fromCharCode(65+j);
        addressBar.value = `${colID}${rowID}`; 
    })
}

//By Default click on 0th row, 0th col -> 1st cell [whenever the application open]
//here .cell will give us the access of first cell
let firstCell = document.querySelector(".cell");
firstCell.click();