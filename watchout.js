// Game board options
var gameBoard = {
  height: 900,
  width: 900,
  numEnemies: 20,
};

// Score board results
var scoreBoard = {
  highScore: 0,
  currentScore: 0,
  collisions: 0
};

// Enemy class
var Enemy = function(x, y, id) {
  this.height = '40px';
  this.width = '40px';
  this.x = x;
  this.y = y;
  this.id = id;
}

// Player class
var Player = function(x, y) {
  this.height = '50px';
  this.width = '50px';
  this.x = x;
  this.y = y;
}

// Create game board as SVG
var svg = d3.select('.container')
  .append('svg')
  .attr('height', gameBoard.height + 'px')
  .attr('width', gameBoard.width + 'px');

// Create border around gameboard
var borderPath = svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", gameBoard.height)
  .attr("width", gameBoard.width)
  .style("stroke", 'blue') // i guess..
  .style("fill", "none")
  .style("stroke-width", '5px');




// Generate player
var player1 = new Player(250,250);
d3.select('svg')
  .append('image')
  .attr('xlink:href', './img/justin.png')
  .attr('width', player1.width)
  .attr('height', player1.height)
  .attr('x', player1.x)
  .attr('y', player1.y)
  .attr('class', 'player');


// Drag mechanics
var dragmove = function(d) {
  d3.select(this)
    .attr("y", (d3.event.sourceEvent.pageY)-80)
    .attr("x", (d3.event.sourceEvent.pageX)-30)
}

var drag = d3.behavior.drag().on("drag", dragmove);

d3.select(".player")
  .call(drag)

// Generate an array of enemies based on number of enemies defined in game board options
var generateEnemies = function(numEnemies) {
  var enemies = [];
  var posX;
  var posY;
  var ID;
  for (var i =0; i<numEnemies; i++){
    posX = Math.random() * gameBoard.width;
    posY = Math.random() * gameBoard.height;
    ID = Math.floor(Math.random() * 3);
    enemies.push(new Enemy(posX, posY, ID))
  }
  return enemies;
}


var enemyData = generateEnemies(gameBoard.numEnemies);

d3.select('svg').selectAll('image').data(enemyData)
  .enter()
  .append('image')
  // .attr('xlink:href', './asteroid.png')
  .attr('xlink:href', function(d){ return "./img/" + d.id + ".png";})
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
    .tween("custom", testFactory)
    .attr('x', function(d){return d[0];})
    .attr('y', function(d){return d[1];})
}

var updateCurrentScore = function(){
  scoreBoard.currentScore ++;
  d3.select('.current > span').text(scoreBoard.currentScore);
}

var updateHighScore = function(){
  if (scoreBoard.currentScore > scoreBoard.highScore){
    scoreBoard.highScore = scoreBoard.currentScore;
    d3.select('.high > span').text(scoreBoard.highScore);
  }
  scoreBoard.currentScore = 0;
}

var updateCollision = function(){
  scoreBoard.collisions ++;
  d3.select('.collisions > span').text(scoreBoard.collisions);
}

var testFactory = function(newData) {
  var hasCollided = false;
  var startPosX = parseFloat(d3.select(this).attr('x'));
  var startPosY = parseFloat(d3.select(this).attr('y'));
  var endPosY = newData[1];
  var endPosX = newData[0];

  return function(t) {
    var player = {
      x: parseFloat(d3.select('.player').attr('x')),
      y: parseFloat(d3.select('.player').attr('y')),
      width: 30,
      height: 30
    }
    var enemy = {
      x: startPosX + (endPosX - startPosX) * t,
      y: startPosY + (endPosY - startPosY) * t,
      width: 20,
      height: 20
    }
    // console.log("X player ", player.x, " Y player", player.y);
    if (player.x < enemy.x + enemy.width &&
       player.x + player.width > enemy.x &&
       player.y < enemy.y + enemy.height &&
       player.height + player.y > enemy.y && !hasCollided) {
        // collision detected!
        updateHighScore();
        updateCollision();
        hasCollided = true;
        return;
    }

  }

};

d3.select('#jammie').on('click', function() {
  d3.select('.player').attr('xlink:href', './img/jammie.png');
});

d3.select('#justin').on('click', function() {
  d3.select('.player').attr('xlink:href', './img/justin.png');
});

// Game Start - PLAY!!
setInterval(updateCurrentScore, 100);
setInterval(tick, 1000);

