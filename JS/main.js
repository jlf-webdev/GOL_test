
// Save can only be donne on min boxWidth=4
// and if the pattern has max 1000 alive cells



/*----------------------------------------------------------------------------------------------------
  -------------------------------------Initialization----------------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/


let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');


let wrapper = document.getElementById("wrapper");
let startScreen = document.getElementById("startScreen");

function displayGame(){
  startScreen.style.display= "none";
  wrapper.style.display= "grid";
  //openFullscreen();
  resize();
}

function fullscreen() {


    let fullscreenIcon_1 = document.querySelector('#fullscreenIcon_1');
    let fullscreenIcon_2 = document.querySelector('#fullscreenIcon_2');

    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    var wrapper = document.getElementById('wrapper');
    if (!isInFullScreen) {
        fullscreenIcon_1.innerText = "fullscreen_exit";
        fullscreenIcon_2.innerText = "fullscreen_exit";

        if (wrapper.requestFullscreen) {
            wrapper.requestFullscreen();
        } else if (wrapper.mozRequestFullScreen) {
            wrapper.mozRequestFullScreen();
        } else if (wrapper.webkitRequestFullScreen) {
            wrapper.webkitRequestFullScreen();
        } else if (wrapper.msRequestFullscreen) {
            wrapper.msRequestFullscreen();
        }
    } else {
        fullscreenIcon_1.innerText = "fullscreen";
        fullscreenIcon_2.innerText = "fullscreen";

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    resize();
}



/*----------------------------------------------------------------------------------------------------
  -------------------------------------GAME SETUP----------------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/


// grid global vars
let grid;
let cols;
let rows;
let boxWidth;


var pageWidth;
var pageHeight;
function getScreenRatio(){
  pageWidth = window.innerWidth;
  pageHeight = window.innerHeight;
  var screenRatio = pageWidth/pageHeight;
  //console.log(screenRatio);
  return screenRatio;
}


// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
function resize(){
  //playPause();
  /*console.log("Pattern Width : " + H_spread);
  console.log("Window innerWidth : " + canvas.width);
  console.log("Pattern Height : " + V_spread);
  console.log("Window innerHeight : " + canvas.height);*/

  if (boxes != null){
    patternZone();
    cachePattern();
  }

 if (boxWidth != 1){
    pageWidth = window.innerWidth;
    pageHeight = window.innerHeight;
    //pageWidth = window.screen.availWidth;
    //pageHeight = window.screen.availHeight;

    var rect = panel.getBoundingClientRect();
    var panelHeight = rect.bottom - rect.top;
    //console.log("panelHeight : " + panelHeight);

    canvas.width = pageWidth;
    canvas.height = pageHeight - (panelHeight + 16);

    createSizeList();
    cols = canvas.width / boxWidth;
    rows = canvas.height / boxWidth;
    getOpenSavedButtonPosition();
    createGridArray();
    if (startPatternObject != null){
      replay();
    }
    gridSizeIndicator.innerText= cols + "*" + rows;
    //playPause();
  }
  else{
    var H_ratio = window.innerWidth/pageWidth;
    var V_ratio = window.innerHeight/pageHeight;
    if ((H_ratio >= 1 && V_ratio >= 1)){
      pageWidth = window.innerWidth;
      pageHeight = window.innerHeight;
      //pageWidth = window.screen.availWidth;
      //pageHeight = window.screen.availHeight;

      var rect = panel.getBoundingClientRect();
      var panelHeight = rect.bottom - rect.top;
      //console.log("panelHeight : " + panelHeight);

      canvas.width = pageWidth;
      canvas.height = pageHeight - (panelHeight + 16);

      createSizeList();
      cols = canvas.width / boxWidth;
      rows = canvas.height / boxWidth;
      getOpenSavedButtonPosition();
      createGridArray();
      if (startPatternObject != null){
        replay();
      }
      gridSizeIndicator.innerText= cols + "*" + rows;
      //playPause();
    }
  }
}

function setup(){
  createSizeList();
  cols = canvas.width / boxWidth;
  rows = canvas.height / boxWidth;
  //drawGrid();
  getOpenSavedButtonPosition();
  createGridArray();
  loadPatterns();
  random();
  draw();
  genCounterElement.innerText= "Generation 0";
  gridSizeIndicator.innerText= cols + "*" + rows;
  for (let i=0; i<12; i++){
    speedDown();
  }
}


var minSize = 1;
var maxSize = 100;
var sizeList = [];
var boxSizeId = 4;
var nextSize = minSize;
function createSizeList(){
  sizeList.length = 0;
  //var lastSize = minSize;
  var sizeCounter = 0;
  var maxWidth = canvas.width;
  var maxHeight = canvas.height;

  for(i=minSize; i<=100; i++){
    var found = 0;
    var width = maxWidth;
    var height = maxHeight;


    while (found != 1 && width >= canvas.width-10 && height >= canvas.height-10){
      if (width % i == 0){
        if (height % i == 0){
          //if (last_X_numberOfBoxes != width/i && last_Y_numberOfBoxes != height/i){
            sizeList[sizeCounter] = new Size(i, width, height) ;
            sizeList[sizeCounter].canvas_H_offset = Math.floor((maxWidth - width)/2);
            sizeList[sizeCounter].canvas_V_offset = Math.floor((maxHeight - height)/2);
            /*console.log("\nsize : " + i);
            console.log("width : " + width);
            console.log("height : " + height);*/
            sizeCounter = sizeCounter + 1;
            found = 1;
          //  var last_X_numberOfBoxes = width / i;
          //  var last_Y_numberOfBoxes = height / i;
          //}
        }
        else{
          height -= 1;
        }
      }
      else {
        width -= 1;
      }
    }
  }


  boxWidth = sizeList[boxSizeId].boxSize;
  canvas.width = sizeList[boxSizeId].canvas_width;
  canvas.height = sizeList[boxSizeId].canvas_height;
}

function drawGrid(){
  c.fillStyle="black";
  c.fillRect(0,0,canvas.width,canvas.height);

  c.lineWidth = 1;
  c.strokeStyle = "#333";

  for (var i=1; i<cols; i++){
    c.beginPath();
    c.moveTo(((i*boxWidth)+0.5),1);
    c.lineTo(((i*boxWidth)+0.5), (canvas.height));
    c.stroke();
  }

  for (var i=1; i<rows; i++){
    c.beginPath();
    c.moveTo(1,((i*boxWidth)+0.5));
    c.lineTo(canvas.width, ((i*boxWidth)+0.5));
    c.stroke();
  }
}

function noGrid(){
  c.fillStyle="black";
  c.fillRect(0,0,canvas.width,canvas.height);
}


var boxes;
var boxId;
function createGridArray(){
  boxes = make2DArray(cols,rows);
  boxId = 0;
  for (let i=0 ; i<cols; i++){
    for (let j=0; j<rows; j++){
      //let state = Math.floor(Math.random() * Math.floor(2));
      let state = 0;
      createBox(i,j,state);
      boxId += 1;
    }
  }
}

var liveBoxes = [];
var liveBoxId =0;
function createBox(x, y, state, checked, neighbors, age){

  boxes[x][y] = new box(boxId, x, y,state, checked, neighbors, age);
  boxes[x][y].checked = 0;
  boxes[x][y].neighbors = 0;
  boxes[x][y].age = 0;

  // store live boxes in a list
  if (state == 1){
    liveBoxes[liveBoxId] = boxes[x][y];
    liveBoxId += 1;
  }
}



/*----------------------------------------------------------------------------------------------------
  -------------------------------OBJECT CONSTRUCTORS----------------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/



function box(boxId, x,y,state, checked, neighbors, age){
  this.boxId = boxId;
  this.x = x;
  this.y = y;
  this.state = state;
  this.checked = checked;
  this.neighbors = neighbors;
  this.age = age;
}

function Size(boxSize, canvas_width, canvas_height, canvas_H_offset, canvas_V_offset){
  this.boxSize = boxSize;
  this.canvas_width = canvas_width;
  this.canvas_height = canvas_height;
  this.canvas_H_offset = canvas_H_offset;
  this.canvas_V_offset = canvas_V_offset;
}

function pattern(id, name, pattern, H_start, H_end, H_spread, H_gridSize, V_start, V_end, V_spread, V_gridSize, displayed){
  this.id = id;
  this.name = name;
  this.pattern = pattern;
  this.H_start = H_start;
  this.H_end = H_end;
  this.H_spread = H_spread;
  this.H_gridSize = H_gridSize;
  this.V_start = V_start;
  this.V_end = V_end;
  this.V_spread = V_spread;
  this.V_gridSize = V_gridSize;
  this.displayed = displayed;
}




/*----------------------------------------------------------------------------------------------------
  -------------------------------------OTHER FUNCTIONS----------------------------------------------------------
  ----------------------------------------------------------------------------------------------------*/


function make2DArray(cols, rows){
      let arr = new Array(cols);
      for (let i=0; i<arr.length; i++){
        arr[i] = new Array(rows);
      }
      return arr;
    }

function getMousePos(canvas, e) {
      var rect = canvas.getBoundingClientRect();
      return {x: e.clientX - rect.left, y: e.clientY - rect.top};
  }

var H_start = 0;
var H_end = 0;
var V_start = 0;
var V_end = 0;
var H_spread = 0;
var V_spread = 0;
function patternZone(){
  var started = 0;
  for (let i=0 ; i<cols; i++){
    for (let j=0; j<rows; j++){
      if (boxes[i][j].state==1 && started == 0){
        H_start = i;
        H_end = i;
        V_start = j;
        V_end = j;

        started = 1;
      }
      else if(boxes[i][j].state==1){
        if (j < V_start){
          V_start = j;
        }
        if (i > H_end){
          H_end = i;
        }
        if (j > V_end){
          V_end = j;
        }
      }
    }
  }
  H_spread = H_end - H_start + 1;
  V_spread = V_end - V_start + 1;
  // console.log("H start : " + H_start);
  // console.log("H end : " + H_end);
  // console.log("H spread : " + H_spread);
  // console.log("V start : " + V_start);
  // console.log("V end : " + V_end);
  // console.log("V spread : " + V_spread);
  //console.log("PatternId : " + patternId);
}

var startPatternObject;
function cachePattern(){
  //gridState.length = 0;
  startPattern = make2DArray(H_spread, V_spread);
  for (var i = 0; i<H_spread; i++){
    for (var j = 0; j<V_spread; j++){
      startPattern[i][j] = boxes[i+H_start][j+V_start].state;
    }
  }

  var id = startPattern;
  var name = startPattern;
  var H_gridSize = cols;
  var V_gridSize = rows;
  startPatternObject = new pattern(id, name, startPattern, H_start, H_end, H_spread, H_gridSize, V_start, V_end, V_spread, V_gridSize);
}

var patternObjects = [];
function createPatternObject(saved){
  var id = patternId;
  var name = patternName;
  var H_gridSize = cols;
  var V_gridSize = rows;
  var displayed = 1;
  //var pattern = savedPatterns[patternId];
  patternObjects[id] = new pattern(id, name, saved, H_start, H_end, H_spread, H_gridSize, V_start, V_end, V_spread, V_gridSize, displayed);
}

function showSavedPattern(){
  H_spread = patternObjects[patternNumber].H_spread;
  V_spread = patternObjects[patternNumber].V_spread;
  savedPattern = patternObjects[patternNumber].pattern;

  checkList.length = 0;
  checkListId = 0;
  liveBoxes.length = 0;
  liveBoxId = 0;
  gen = 0;
  genCounterElement.innerText= gen;

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
        boxes[i][j].state = savedPattern[i-H_offset][j-V_offset];

        if (savedPattern[i-H_offset][j-V_offset] == 1){
          liveBoxes[liveBoxId] = boxes[i][j];
          liveBoxId += 1;
        }
      }
    }
  }
  draw();
}


//window.onload = setup;
