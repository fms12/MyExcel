let collectedSheetDB = [];
let sheetDB = [];
{
  let addSheetBtn = document.querySelector(".sheet-add-icon");
  addSheetBtn.click();
  handleSheetProperties();
}
// for (let i = 0; i < rows; i++) {
//   let sheetRow = [];
//   for (let j = 0; j < cols; j++) {
//     let cellProps = {
//       bold: false,
//       italic: false,
//       underline: false,
//       alignment: "left",
//       fontFamily: "monospace",
//       fontSize: 14,
//       fontColor: "#000000",
//       BGColor: "#000000", // Just for indication Purpose, default color
//       value: "",
//       formula: "",
//       children: [],
//     };
//     sheetRow.push(cellProps);
//   }

//   sheetDB.push(sheetRow);
// }

//selctors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-grp");
let fontFamily = document.querySelector(".font-family-grp");
let fontColor = document.querySelector(".font-color-prop");
let BGColor = document.querySelector(".BG-color-prop");
let alignment = document.querySelectorAll(".alignmet");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeCell = "#d1d8e0";
let inactiveCell = "#ecf0f1";

//Attach Property Listeners -> Application of 2way Binding
bold.addEventListener("click", (e) => {
  //Access active cells
  //Adress
  //Find row and columns values
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  //Modification
  cellProp.bold = !cellProp.bold; //action performed
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
  bold.style.backgroundColor = cellProp.bold ? activeCell : inactiveCell;
});

italic.addEventListener("click", (e) => {
  //Access active cells
  //Adress
  //Find row and columns values
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  //Modification
  cellProp.italic = !cellProp.italic; //action performed
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
  italic.style.backgroundColor = cellProp.italic ? activeCell : inactiveCell;
});

underline.addEventListener("click", (e) => {
  //Access active cells
  //Adress
  //Find row and columns values
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  //Modification
  cellProp.underline = !cellProp.underline; //action performed
  cell.style.textDecoration = cellProp.underline ? "underline" : "none";
  underline.style.backgroundColor = cellProp.underline
    ? activeCell
    : inactiveCell;
});

//font size
fontSize.addEventListener("change", (e) => {
  //Access active cells
  //Adress
  //Find row and columns values
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.fontSize = fontSize.value;
  cell.style.fontSize = cellProp.fontSize + "px";
  fontSize.value = cellProp.fontSize;
});

//fontFamily
fontFamily.addEventListener("change", (e) => {
  //Access active cells
  //Adress
  //Find row and columns values
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.fontFamily = fontFamily.value;
  cell.style.fontFamily = cellProp.fontFamily;
  fontFamily.value = cellProp.fontFamily;
});

//fontColor
fontColor.addEventListener("change", (e) => {
  //Access active cells
  //Adress
  //Find row and columns values
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.fontColor = fontColor.value;
  cell.style.color = cellProp.fontColor;
  fontColor.value = cellProp.fontColor;
});

//BGColor
BGColor.addEventListener("change", (e) => {
  //Access active cells
  //Adress
  //Find row and columns values
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.BGColor = BGColor.value;
  cell.style.backgroundColor = cellProp.BGColor;
  BGColor.value = cellProp.BGColor;
});

//Alignment
alignment.forEach((alignElem) => {
  alignElem.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    let alignValue = e.target.classList[0];
    cellProp.alignment = alignValue; // Data change
    cell.style.textAlign = cellProp.alignment; // UI change (1)
    switchCaseForTextAlignment(alignValue);
  });
});

function switchCaseForTextAlignment(alignValue) {
  switch (
    alignValue // UI change (2)
  ) {
    case "left":
      leftAlign.style.backgroundColor = activeCell;
      centerAlign.style.backgroundColor = inactiveCell;
      rightAlign.style.backgroundColor = inactiveCell;
      break;
    case "center":
      leftAlign.style.backgroundColor = inactiveCell;
      centerAlign.style.backgroundColor = activeCell;
      rightAlign.style.backgroundColor = inactiveCell;
      break;
    case "right":
      leftAlign.style.backgroundColor = inactiveCell;
      centerAlign.style.backgroundColor = inactiveCell;
      rightAlign.style.backgroundColor = activeCell;
      break;
  }
}

//Send Cells 1 by 1 to attach Properties
let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
  addListeneToAttachCellProperties(allCells[i]);
}

function addListeneToAttachCellProperties(cell) {
  cell.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [rid, cid] = decodeRowIDandColID(address);
    let cellProp = sheetDB[rid][cid];

    //Get all the properties of this cell
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor =
      cellProp.BGColor == "#000000" ? "transparent" : BGColor;
    cell.style.textAlign = cellProp.alignment;

    // Apply UI Properties to the cell
    bold.style.backgroundColor = cellProp.bold ? activeCell : inactiveCell;
    italic.style.backgroundColor = cellProp.italic ? activeCell : inactiveCell;
    underline.style.backgroundColor = cellProp.underline
      ? activeCell
      : inactiveCell;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    fontColor.value = cellProp.fontColor;
    BGColor.value = cellProp.BGColor;
    switchCaseForTextAlignment(cellProp.alignment);

    let formulaBar = document.querySelector(".formula-bar");
    formulaBar.value = cellProp.formula;
    cell.innerText = cellProp.value;
  });
}

function getCellAndCellProp(address) {
  let [rid, cid] = decodeRowIDandColID(address);
  //Adress cell & storage object
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  //console.log(cell);
  let cellProp = sheetDB[rid][cid];
  return [cell, cellProp];
}

function decodeRowIDandColID(address) {
  // address it is in the format of string
  //A1
  let rid = Number(address.slice(1)) - 1; //-1 to get the index
  let cid = Number(address.charCodeAt(0)) - 65;
  return [rid, cid];
}
