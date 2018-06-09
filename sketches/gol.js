var grid;
var song;
var button;

function setup () {
  createCanvas(400, 400);
  song = loadSound("1985.mp3",loaded);
  button = createButton("play some dope music");
  button.mousePressed(togglePlaying); // add something with && for another function
  grid = new Grid(20);
  grid.randomize();

}

function loaded() {
  console.log("loaded");
}

function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    song.setVolume(0.8);
    button.html("stop this nonsense");
  } else {
    song.pause();
    button.html("play music again")
  }
}


function draw() {
  background(250);

  grid.updateNeighborCount();
  grid.updatePopulation();
  grid.draw();

}

class Cell {
  constructor (column, row, cellSize) {
    this.column = column;
    this.row = row;
    this.cellSize = cellSize;

    this.isAlive = false;
    this.liveNeighborCount = 0;
  }

  draw() {
    if (this.isAlive === false){
      fill(240);
    } else {
      fill(200,0,200);
    }

    noStroke();
    rect(this.column * this.cellSize + 1, this.row * this.cellSize + 1, this.cellSize - 1, this.cellSize - 1);
  }

  setIsAlive(value) {
    if (value){
      this.isAlive = true;
    } else{
      this.isAlive = false;
    }
  }

  liveOrDie() {
    if(this.isAlive == false && this.liveNeighborCount == 3){
       this.isAlive = true;
    } else if(this.isAlive == true && this.liveNeighborCount < 2) {
       this.isAlive = false;
    } else if(this.isAlive == true && (this.liveNeighborCount == 2 || this.liveNeighborCount == 3)) {
       this.isAlive = true;
    } else if(this.isAlive == true && this.liveNeighborCount > 3) {
       this.isAlive = false;
    }
    //print(this.isAlive || "empty");
    //print(this.liveNeighborCount || "huh whaa")

// Any live cell with fewer than two live neighbors dies, as if by under population.
// Any live cell with two or three live neighbors lives on to the next generation.
// Any live cell with more than three live neighbors dies, as if by overpopulation.
// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.


  }


}

class Grid {
  constructor (cellSize) {
    // update the contructor to take cellSize as a parameter
    this.cellSize = cellSize;
    // use cellSize to calculate and assign values for numberOfColumns and numberOfRows
    this.numberOfColumns = width/cellSize;
    this.numberOfRows = height/cellSize;

    // var x = this.numberOfColumns; // how big the first array should be
    // var y = this.numberOfRows; // how big each array inside of the first array should be
    var cells = new Array(this.numberOfColumns);
    this.cells = cells;
    for (var i = 0; i < cells.length; i ++) {
      cells[i] = new Array(this.numberOfRows);
    }

    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row] = new Cell(column, row, cellSize);
      }
    }

    //print(this.cells || "empty");

  }

  draw() {
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        var cell = this.cells[column][row];
        cell.draw();

      }
    }
  }

  randomize() {
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        var cell = this.cells[column][row];
        cell.setIsAlive(floor(random(2)));

      }
    }
  }



  updateNeighborCount() {
  // Loop over each cell in grid
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row ++) {
        var currentCell = this.cells[column][row];
       // Loop over neighbors excluding itself and avoid invalid grid locations
       // Reset neighbor count to 0
        currentCell.liveNeighborCount = 0;

        // count neighbors
        for (var xOffset = -1; xOffset <= 1; xOffset++) {
          for (var yOffset = -1; yOffset <= 1; yOffset++) {
            var neighborX = currentCell.column + xOffset; // neighborX = 1
            var neighborY = currentCell.row + yOffset; // neighborY = 1

            if (neighborX >= 0 && neighborX < this.numberOfColumns && neighborY >= 0 && neighborY < this.numberOfRows){
              var neighbourCell = this.cells[neighborX][neighborY];

              if (neighbourCell.isAlive === true && neighbourCell != currentCell){
              currentCell.liveNeighborCount = currentCell.liveNeighborCount + 1;

              //print(neighbourCell == currentCell);
              }
            }
            //var neighbourCell = this.cells[neighborX][neighborY];



        // do something with neighborX and neighborY
          }
        }
        //currentCell.liveNeighborCount = currentCell.liveNeighborCount - 1;

        //print(currentCell.liveNeighborCount);
      }
    }

  }

  updatePopulation() {
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row ++) {
        var currentCell = this.cells[column][row];
        currentCell.liveOrDie();
        //print(currentCell || "emptiness")
      }
    }

  }

}
