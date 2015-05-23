// Game board options
var gameBoard = {
  height: 500,
  width: 500,
  numEnemies: 2,
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


// Drag mechanics

var dragmove = function(d) {
  d3.select(this)
    // .style("top", ((d3.event.sourceEvent.pageY) - this.offsetHeight/2)+"px")
    // .style("left", ((d3.event.sourceEvent.pageX) - this.offsetWidth/2)+"px")
    .attr("y", (d3.event.sourceEvent.pageY)-80)
    .attr("x", (d3.event.sourceEvent.pageX)-30)
}

var drag = d3.behavior.drag().on("drag", dragmove);

d3.select(".player")
  .call(drag)


// Collide mechanics

// function collide(node){
//     var trans = d3.transform(d3.select(node).attr("transform")).translate,
//       x1 = trans[0],
//       x2 = trans[0] + (+d3.select(node).attr("r")),
//       y1 = trans[1],
//       y2 = trans[1] + (+d3.select(node).attr("r"));

//   var colliding = false;
//   points.each(function(d,i){
//     var ntrans = d3.transform(d3.select(this).attr("transform")).translate,
//       nx1 = ntrans[0],
//       nx2 = ntrans[0] + (+d3.select(this).attr("r")),
//       ny1 = ntrans[1],
//       ny2 = ntrans[1] + (+d3.select(this).attr("r"));


//       if(!(x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1))
//         colliding=true;
//   })

//   return colliding;
// }

// Tween function implementing collide
// function translateAlong(path) {
//   var l = path.getTotalLength();
//   return function(d, i, a) {
//     return function(t) {
//       var p = path.getPointAtLength(t * l);

//       d3.select(this).attr("transform","translate(" + p.x + "," + p.y + ")");

//       if(collide(this))
//         d3.select(this).style("fill", "red")
//        else
//         d3.select(this).style("fill", "steelblue")
//     };
//   };
// }

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
    .tween("custom", testFactory)
    .attr('x', function(d){return d[0];})
    .attr('y', function(d){return d[1];})
}

var collisionDetection = function(newData) {
  // capture starting x and y position
  // capture ending x and y position
  return function(t){
    // uses x and y variables from closure to execute the collision math
  }
}

var updateCurrentScore = function(){
  scoreBoard.currentScore ++;
  d3.select('.current > span').text(scoreBoard.currentScore);
}

var updateHighScore = function(){
  if (scoreBoard.currentScore > scoreBoard.highScore){
    console.log('current score = ', scoreBoard.currentScore, 'high score = ', scoreBoard.highScore, "high score is greater than current score= ", scoreBoard.currentScore > scoreBoard.highScore)
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
  // var i = d3.interpolateRound(0, 100);
  var hasCollided = false;
  var startPosX = parseFloat(d3.select(this).attr('x'));
  var startPosY = parseFloat(d3.select(this).attr('y'));
  var endPosY = newData[1];
  var endPosX = newData[0];
  return function(t) {
    // this.textContent = i(t);
    // console.log("startX = " + startPosX + ", startY = " + startPosY);
    // console.log("endX = " + endPosX + ", endY = " + endPosY);
    // console.log(newData);
    var player = {
      x: 200, y: 200, width: 100, height: 100
    }
    var enemy = {
      x: startPosX + (endPosX - startPosX) * t,
      y: startPosY + (endPosY - startPosY) * t,
      width: 20,
      height: 20
    }

    if (player.x < enemy.x + enemy.width &&
       player.x + player.width > enemy.x &&
       player.y < enemy.y + enemy.height &&
       player.height + player.y > enemy.y && !hasCollided) {
        // collision detected!
        // console.log("collision!!!")
        // console.log("Player on collision: " + player.x + " " + player.y);
        // console.log("Enemy on collision: " + enemy.x + " " + enemy.y);
        updateHighScore();
        updateCollision();
        hasCollided = true;
        return;
    }

  }

};



setInterval(updateCurrentScore, 100);
setInterval(tick, 1000);





// function collide(node){
//   var trans = d3.transform(d3.select(node).attr("transform")).translate,
//     x1 = trans[0],
//     x2 = trans[0] + (+d3.select(node).attr("r")),
//     y1 = trans[1],
//     y2 = trans[1] + (+d3.select(node).attr("r"));

//   var colliding = false;
//   points.each(function(d,i){
//     var ntrans = d3.transform(d3.select(this).attr("transform")).translate,
//       nx1 = ntrans[0],
//       nx2 = ntrans[0] + (+d3.select(this).attr("r")),
//       ny1 = ntrans[1],
//       ny2 = ntrans[1] + (+d3.select(this).attr("r"));


//       if(!(x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1))
//         colliding=true;
//   })

//   return colliding;
// }



