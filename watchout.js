// Game board options
var gameBoard = {
  height: 500,
  width: 500,
  numEnemies: 10,
  backgroundColor: 'gray'
};

// Score board results
var scoreBoard = {
  highScore: 0,
  currentScore: 0,
  collisions: 0
};

// Enemy class
var Enemy = function(x, y, id) {
  this.height = '20px';
  this.width = '20px';
  this.x = x;
  this.y = y;
  this.id = id;
}

// Create game board as SVG
var svg = d3.select('.container').append('svg').attr('height', gameBoard.height + 'px').attr('width', gameBoard.width + 'px');

// Generate an array of enemies based on number of enemies defined in game board options
var generateEnemies = function(numEnemies) {
  var enemies = [];
  var posX;
  var posY;
  for (var i =0; i<numEnemies; i++){
    posX = Math.random() * gameBoard.width;
    posY = Math.random() * gameBoard.height;
    enemies.push(new Enemy(posX, posY, i))
  }
  return enemies;
}

var enemyData = generateEnemies(gameBoard.numEnemies);

d3.select('svg').selectAll('image').data(enemyData)
.enter()
.append('image')
.attr('xlink:href', './asteroid.png')
.attr('width', function(d){ return d.width;})
.attr('height', function(d){ return d.height;})
.attr('x', function(d){ return d.x;})
.attr('y', function(d){ return d.y;})


