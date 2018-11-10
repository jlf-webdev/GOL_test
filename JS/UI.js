/*----------------------------------------------------------------------------------------------------
  -------------------------------------UI FUNCTIONS-------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/


canvas.addEventListener('click', selectBox);
function selectBox(e){
  if (patternObjects[patternNumber] != null){
    patternObjects[patternNumber].displayed = 0;
  }
    // mouse position
    var pos = getMousePos(canvas, e); // in OTHER FUNCTIONS section
          xpos = pos.x -1;
          ypos = pos.y-1;

    // box grid position
    var boxX = Math.ceil(xpos/boxWidth) ;
    var boxY = Math.ceil(ypos/boxWidth) ;
    //console.log(boxX + "-" + boxY);

    // box start coordonates
    var startX = (boxX-1)*boxWidth;
    var startY = (boxY-1)*boxWidth;

    // draw box & change cell state in grid
    if (boxes[boxX-1][boxY-1].state == 0){
      boxes[boxX-1][boxY-1].state = 1;
      c.fillStyle="blue";
      c.fillRect(startX,startY,boxWidth-1,boxWidth-1);
    }
    else if (boxes[boxX-1][boxY-1].state == 1){
      boxes[boxX-1][boxY-1].state = 0;
      liveBoxes.splice[liveBoxId] = boxes[boxX-1][boxY-1];
      liveBoxId -= 1;
      c.fillStyle="#555";
      c.fillRect(startX,startY,boxWidth-1,boxWidth-1);
    }


    liveBoxes.length = 0;
    liveBoxId = 0;
    drawGrid();
    for (let i=0 ; i<cols; i++){
      for (let j=0; j<rows; j++){
        if(boxes[i][j].state == 1){
          liveBoxes[liveBoxId] = boxes[i][j];
          liveBoxId += 1;
        }
      }
    }

    gen = 0;
    genCounterElement.innerText= gen;

    draw();
  }


function playPause(){

  if (patternObjects[patternNumber] != null){
    patternObjects[patternNumber].displayed = 0;
  }
  if (pause == 1){
    if (gen == 0){
      patternZone(); // in OTHER FUNCTIONS section
      cachePattern();  // in OTHER FUNCTIONS section
    }
    pause = 0;
    generation();
  }
  else{
    pause = 1;
    once = 0;
    playIconElement.innerText = "play_arrow";
  }
}

function pauseGame(){
  pause = 1;
  once = 0;
  playIconElement.innerText = "play_arrow";
}

function replay(){

   if (patternObjects[patternNumber] != null){
     patternObjects[patternNumber].displayed = 0;
   }
  H_spread = startPatternObject.H_spread;
  V_spread = startPatternObject.V_spread;

  checkList.length = 0;
  checkListId = 0;
  liveBoxes.length = 0;
  liveBoxId = 0;
  gen = 0;
  genCounterElement.innerText= "Generation " + gen;

  while (H_spread > cols ||  V_spread > rows){
    boxSizeDown();
    liveBoxes.length=0;
    liveBoxId = 0;
  }

  var colsDiff = (cols - H_spread);
  var rowsDiff = (rows - V_spread);
  var H_offset = Math.floor(colsDiff/2);
  var V_offset = Math.floor(rowsDiff/2);

  for (var i = 0; i<cols; i++){
    for (var j = 0; j<rows; j++){
      boxes[i][j].state = 0;
      boxes[i][j].neighbors = 0;
      boxes[i][j].checked = 0;
      boxes[i][j].age = 0;

      if (i >= H_offset && i < H_offset+H_spread && j >= V_offset && j < V_offset+V_spread){
        boxes[i][j].state = startPattern[i-H_offset][j-V_offset];

        if (startPattern[i-H_offset][j-V_offset] == 1){
          liveBoxes[liveBoxId] = boxes[i][j];
          liveBoxId += 1;
        }
      }
    }
  }
  draw();
}


function random(){
  if (patternObjects[patternNumber] != null){
    patternObjects[patternNumber].displayed = 0;
  }
  liveBoxes.length=0;
  liveBoxId = 0;
  checkList.length=0;
  checkListId = 0;
  drawGrid();
  gen = 0;
  for (let i=0 ; i<cols; i++){
    for (let j=0; j<rows; j++){
      let state = 0;
      if (Math.random() > 0.5){
        state = Math.floor(Math.random() * Math.floor(2));
      }
      boxes[i][j].state = state;
      if (state == 1){
        liveBoxes[liveBoxId] = boxes[i][j];
        liveBoxId += 1;
      }
    }
  }
  draw();
  gen = 0;
  genCounterElement.innerText= "Generation " + gen;
}

function clearGame(){
  if (patternObjects[patternNumber] != null){
    patternObjects[patternNumber].displayed = 0;
  }
  pauseGame();
  liveBoxes.length=0;
  liveBoxId = 0;
  checkList.length=0;
  checkListId = 0;
  for (let i=0 ; i<cols; i++){
    for (let j=0; j<rows; j++){
      boxes[i][j].state = 0;
      boxes[i][j].neighbors = 0;
      boxes[i][j].checked = 0;
    }
  }
  if (boxWidth > 2){
    drawGrid();
  }
  else {
    noGrid();
  }
  gen = 0;
  genCounterElement.innerText= "Generation " + gen;
}

var delta = 0;
function speedUp(){
  if (delta >= 5){

  //}

  //if (delay >= 5 ){
    if (pause == 0){
      playPause();
      delay = delay - delta;
      playPause();
    }
    else{
      delay = delay - delta;
    }

    delta = delta - 5;
  }
  var speed = Math.floor(((1500 - delay)/1500)*100);
  console.log('speedUp => ' + "delay : " + delay);
  console.log("speed : " + speed + "%");
  console.log("delta : " + delta + "ms");
  var text = speed + "%";
  speedIndicator.innerText= text;
}

function speedDown(){


  if (delay < 1500 ){
    delta = delta + 5;
    if (pause == 0){
      playPause();
      delay = delay + delta;
      playPause();
    }
    else{
      delay = delay + delta;
    }
  }
   var speed = Math.floor(((1500 - delay)/1500)*100);
   console.log('speedDown => ' + "delay : " + delay);
   console.log("speed : " + speed + "%");
   console.log("delta : " + delta + "ms");
   if (speed == 0){
     var text = speed + "%";
   }
   else{
     var text = speed + "%";
   }

   speedIndicator.innerText= text;
}


function boxSizeUp(){
  if (boxSizeId < sizeList.length-1){

    liveBoxes.length = 0;
    liveBoxId = 0;
    checkList.length = 0;
    checkListId = 0;

    boxSizeId = boxSizeId + 1;
    boxWidth = sizeList[boxSizeId].boxSize;
    canvas.width = sizeList[boxSizeId].canvas_width;
    canvas.height = sizeList[boxSizeId].canvas_height;
    var canvas_H_offset = sizeList[boxSizeId].canvas_H_offset + "px";
    var canvas_V_offset = sizeList[boxSizeId].canvas_V_offset + "px";
    canvas.style.marginLeft = canvas_H_offset
    canvas.style.marginTop = canvas_V_offset;

    var newCols = canvas.width/boxWidth;
    var newRows = canvas.height/boxWidth;
    var colsDiff = (cols - newCols);
    var rowsDiff = (rows - newRows);
    var H_offset = Math.floor(colsDiff/2);
    var V_offset = Math.floor(rowsDiff/2);



    var newSet = make2DArray(newCols,newRows);     // in OTHER FUNCTIONS section
    var newSetId = 0;
    for (let i=0 ; i<newCols; i++){
      for (let j=0; j<newRows; j++){
        newSet[i][j] = boxes[i+H_offset][j+V_offset];
        newSet[i][j].boxId = newSetId;
        newSet[i][j].x = i;
        newSet[i][j].y = j;
        if (newSet[i][j].state == 1){
          liveBoxes[liveBoxId] = newSet[i][j];
          liveBoxId += 1;
        }
        newSetId += 1;
      }
    }


    cols = newCols;
    rows = newRows;
    boxes = make2DArray(cols,rows);   // in OTHER FUNCTIONS section
    boxes = newSet;
    drawGrid();
    draw();
    gridSizeIndicator.innerText= cols + "*" + rows;
    //console.log(newSet);
    //console.log(boxes);
  }
}

function boxSizeDown(){
  if (boxSizeId >= 1){

    //pauseGame();

    liveBoxes.length = 0;
    liveBoxId = 0;
    checkList.length = 0;
    checkListId = 0;

    var tempSet = make2DArray(cols,rows);    // in OTHER FUNCTIONS section
    tempSetId = 0;
    var tempSet = boxes;

    boxSizeId = boxSizeId - 1;
    boxWidth = sizeList[boxSizeId].boxSize;
    canvas.width = sizeList[boxSizeId].canvas_width;
    canvas.height = sizeList[boxSizeId].canvas_height;

    var canvas_H_offset = sizeList[boxSizeId].canvas_H_offset + "px";
    var canvas_V_offset = sizeList[boxSizeId].canvas_V_offset + "px";
    canvas.style.marginLeft = canvas_H_offset
    canvas.style.marginTop = canvas_V_offset;

    var newCols = canvas.width/boxWidth; //12 => 16
    var newRows = canvas.height/boxWidth;// start 2 end 13 ystart 1 end 6
    var colsDiff = (newCols - cols); //4
    var rowsDiff = (newRows - rows);
    var H_offset = Math.floor(colsDiff/2);  //2
    var V_offset = Math.floor(rowsDiff/2);
    var oldCols = cols;
    var oldRows = rows;

    cols = newCols;
    rows = newRows;
    createGridArray();
    //console.log(tempSet);
    //console.log(boxes);

    for (let i=0 ; i<oldCols; i++){
      for (let j=0; j<oldRows; j++){
        boxes[i+H_offset][j+V_offset].state = tempSet[i][j].state;
        if (boxes[i+H_offset][j+V_offset].state == 1){
          liveBoxes[liveBoxId] = boxes[i+H_offset][j+V_offset];
          liveBoxId += 1;
        }
        tempSetId += 1;
      }

    gridSizeIndicator.innerText= cols + "*" + rows;
    }





    drawGrid();
    draw();
  }
}



var patternId = 0;
var patternName = "";
var savedPatterns = new Array();
function savePattern(){
  // if (patternObjects[patternNumber] != null){
  //   patternObjects[patternNumber].displayed = 0;
  // }
  if (boxWidth > 3){
    if (patternObjects[patternNumber] == null ||  patternObjects[patternNumber].displayed == 0){

      patternZone();  // in OTHER FUNCTIONS section
      var saved = make2DArray(H_spread,V_spread);  // in OTHER FUNCTIONS section

      // save and avoid empty pattern
      console.log('save');
      var allowedPatternSize = 0;
      for (let i=0 ; i<H_spread; i++){
        for (let j=0; j<V_spread; j++){
          saved[i][j] = boxes[i+H_start][j+V_start].state;
          allowedPatternSize += saved[i][j];
        }
      }

      if (allowedPatternSize > 0 && allowedPatternSize < 1000){
        //console.log(saved);
        console.log("Number of cells : " + allowedPatternSize);
        savedPatterns[patternId] = saved;
        patternName = "Pattern_" + (patternId+1);

        createPatternObject(saved);  // in OTHER FUNCTIONS section

        patternNumber = patternId;
        patternId = patternId + 1;
        storePattern();
      }
      else{
        console.log("empty pattern");
      }
    }
  }
}

function storePattern(){
  console.log("stored");
  //localStorage.clear();
  //localStorage.removeItem("ID");
  let str = JSON.stringify(patternId);
  localStorage.setItem("LastID", str);


  //str = JSON.stringify(patternObjects[patternId]);
  str = JSON.stringify(patternObjects);
  //console.log(str);
  //var Name = "Pattern_" + (patternId+1);
  var Name = "PatternObjects";
  localStorage.setItem(Name, str);

}

function loadPatterns(){
  if (localStorage.getItem("LastID") === null || localStorage.getItem("LastID") <=0 ){
    localStorage.setItem("LastID", 0);
  }
  else if (localStorage.getItem("PatternObjects")  != null){
    original = localStorage.getItem("LastID");
    patternId = JSON.parse(original);
    //console.log(original);

    /*for(var i=0; i<=patternId; i++){
      var Name = 'Pattern_' + (i+1);
      original = localStorage.getItem(Name);
      patternObjects[i] = JSON.parse(original);
      console.log(original);
    }*/

    original = localStorage.getItem("PatternObjects");
    patternObjects = JSON.parse(original);

    patternObjects[patternId-1].displayed = 0;
    //patternId = patternId +1;
  }
}

function deletePattern(){
  if (patternObjects[patternNumber].displayed == 1 ){
    patternObjects.splice(patternNumber, 1);
    patternId -= 1;


    if (patternId <0){
      patternId = 0;
    }

    patternNumber -= 1;
    if (patternNumber <0){
      patternNumber = 0;
    }
    clearGame();
    storePattern();
    loadPatterns();
 }
}



var patternNumber = 0;
function skipPrevious(){
  if (patternNumber > 0){
    patternObjects[patternNumber].displayed = 0;
    patternNumber = patternNumber - 1;
  }
  showSavedPattern();  // in OTHER FUNCTIONS section
  patternObjects[patternNumber].displayed = 1;
}

function skipNext(){
  if (patternNumber < patternId-1){
    patternObjects[patternNumber].displayed = 0;
    patternNumber = patternNumber + 1;
  }
  showSavedPattern();   // in OTHER FUNCTIONS section
  patternObjects[patternNumber].displayed = 1;
}
