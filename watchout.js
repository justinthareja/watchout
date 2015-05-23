// Game board options
var gameBoard = {
  height: 500,
  width: 500,
  numEnemies: 20,
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

// Player class
var Player = function(x, y) {
  this.height = '40px';
  this.width = '40px';
  this.x = x;
  this.y = y;
}

// Create game board as SVG
var svg = d3.select('.container')
  .append('svg')
  .attr('height', gameBoard.height + 'px')
  .attr('width', gameBoard.width + 'px');



// Generate player
var player1 = new Player(250,250);
d3.select('svg')
  .append('image')
  .attr('xlink:href', './asteroid.png')
  .attr('width', player1.width)
  .attr('height', player1.height)
  .attr('x', player1.x)
  .attr('y', player1.y)
  .attr('class', 'player');


var dragmove = function(d) {
  d3.select(this)
    // .style("top", ((d3.event.sourceEvent.pageY) - this.offsetHeight/2)+"px")
    // .style("left", ((d3.event.sourceEvent.pageX) - this.offsetWidth/2)+"px")
    .attr("y", (d3.event.sourceEvent.pageY)-15)
    .attr("x", (d3.event.sourceEvent.pageX)-15)
}

var drag = d3.behavior.drag().on("drag", dragmove);

d3.select(".player")
  .call(drag)


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
  .attr('class', 'enemy')

var setPosition = function(numEnemies) {
  var positions = [];
  for(var i = 0; i<numEnemies; i++){
    var posX = Math.random() * gameBoard.width;
    var posY = Math.random() * gameBoard.height;
    positions.push([posX, posY])
  }
  return positions;
}

var tick = function(){
  var newData = setPosition(gameBoard.numEnemies);
  d3.selectAll('.enemy').data(newData)
    .transition()
    .duration(1500)
    .attr('x', function(d){return d[0];})
    .attr('y', function(d){return d[1];})
}

setInterval(tick, 1000);




