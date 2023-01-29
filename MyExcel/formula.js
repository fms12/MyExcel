for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [activeCell, cellProp] = getCellAndCellProp(address);
      let enteredData = activeCell.innerText;

      if (enteredData === cellProp.value) return;

      cellProp.value = enteredData;
      // If data modifies remove P-C relation and make formula empty and then update children with new modified values
      removeChildFromParent(cellProp.formula);
      cellProp.formula = "";
      updateChildrenCells(address);
    });
  }
}

let formulaBar = document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown", async(e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && inputFormula) {
    //If change in formula then remove old Parent Child relation -> evaluate new Parent Child relation and then add new Parent Child relation
    let adress = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(adress);
    if (inputFormula !== cellProp.formula) {
      removeChildFromParent(cellProp.formula);
    }

    //Make graph relation
    addChildToGraphComponent(inputFormula, adress);
    //check formula is cyclic or not?
    let cycleResponse = isGraphCyclic(graphComponentMatrix);
    if (cycleResponse) {
      // alert("Your formula is making a cycle");
      let response  = confirm("your formula is cyclic, Do you want to trace your file");
      while(response){
        //Keep on tracking color until user is satisfied
        await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);
        response = confirm("your formula is cyclic, Do you want to trace your file");
      }
      removeChildFromGraphComponet(inputFormula, adress);//Cyclic relation, so break this relation from the graph component
      return;
    }

    let evaluatedValue = evaluateFormula(inputFormula);

    // Update UI and CellProp in DB
    setCellUIAndCellProp(evaluatedValue, inputFormula, adress);

    //Establish Parent child relationship
    addChildToParent(inputFormula);
    updateChildrenCells(adress);
    // console.log(sheetDB);
  }
});

function addChildToParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    //Get first value A1 = A;
    let asciiValue = encodedFormula[i].charCodeAt(0);
    //check if it is value of any adress
    if (asciiValue >= 65 && asciiValue <= 90) {
      //Decode and get its value
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      parentCellProp.children.push(childAddress);
    }
  }
}

function removeChildFromParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    //Get first value A1 = A;
    let asciiValue = encodedFormula[i].charCodeAt(0);
    //check if it is value of any adress
    if (asciiValue >= 65 && asciiValue <= 90) {
      //Decode and get its value
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      let index = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(index, 1);
    }
  }
}

function removeChildFromGraphComponet(formula, childAddress) {
  let [crid, ccid] = decodeRowIDandColID(childAddress);
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let ascciValue = encodedFormula[i].charCodeAt(0);
    if (ascciValue >= 65 && ascciValue <= 90) {
      let [prid, pcid] = decodeRowIDandColID(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].pop();
    }
  }
}

function addChildToGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeRowIDandColID(childAddress);
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
      let asciiValue = encodedFormula[i].charCodeAt(0);
      if (asciiValue >= 65 && asciiValue <= 90) {
          let [prid, pcid] = decodeRowIDandColID(encodedFormula[i]);
          // B1: A1 + 10
          // rid -> i, cid -> j
          graphComponentMatrix[prid][pcid].push([crid, ccid]);
      }
  }
}

function updateChildrenCells(parentAddress) {
  let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
  let childrens = parentCellProp.children;

  for (let i = 0; i < childrens.length; i++) {
    let childAddress = childrens[i];
    let [childCell, childCellProp] = getCellAndCellProp(childAddress);
    let childFormula = childCellProp.formula;

    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
    //call recursion to update all cells
    updateChildrenCells(childAddress);
  }
}

function evaluateFormula(formula) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    //Get first value A1 = A;
    let asciiValue = encodedFormula[i].charCodeAt(0);
    //check if it is value of any adress
    if (asciiValue >= 65 && asciiValue <= 90) {
      //Decode and get its value
      let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }

  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
  // let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);
  //UI Update
  cell.innerText = evaluatedValue;

  //DB Update
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}