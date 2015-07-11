// start slingin' some d3 here.

var width = 800;
var height = 600;
var radius = 15;

var highScore = 0;
var currentScore = 0;
var collisions = 0;


var svg = d3.select("body").append("svg")
  // future idea - make canvas size responsive to size of browser window
  .attr("width", width)
  .attr("height", height);


var dragmove = function(d) {
  d3.select(this)
    // allows us to continually set the new origin (x,y) coordinates of the node
    .attr("cx", d.x = Math.max(radius, Math.min(width - radius, d3.event.x)))
    .attr("cy", d.y = Math.max(radius, Math.min(height - radius, d3.event.y)));
}

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("drag", dragmove);

// create our player circle
var player = svg.selectAll(".player").data([{x: width/2, y: height/2}])
              .enter().append("circle")
              .attr("r", radius - 5)
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
              .attr("class", "player")
              .style("fill", "red")
              .call(drag);

var increaseScore = function() {
  currentScore++;
  if (currentScore > highScore) {
    highScore = currentScore;
  }
  d3.select(".current span").text(currentScore);
  d3.select(".high span").text(highScore);
};

var onCollision = function(){
  // increment collisions
  d3.select(".collisions span").text(++collisions);
  // reset current score to 0
  currentScore = 0;
  d3.select(".current span").text(currentScore);
};

// checkCollision somehow needs to check the distance between an enemy and the player, and if there
// is a collision detected, run a collidedCallback to have the desired behavior
var checkCollision = function(enemy, collidedCallback) { 
  //grab current enemy x,y, and r
  //grab player x,y, r
  var radiusSum = 15 + parseFloat(player.attr("r"));
  var xDiff = parseFloat(enemy.attr("x")) - parseFloat(player.attr("cx"));
  var yDiff = parseFloat(enemy.attr("y")) - parseFloat(player.attr("cy"));

  var separation = Math.sqrt( Math.pow(xDiff, 2) + Math.pow(yDiff, 2) );

  //check separation with formula to at least sum of radii
  if (separation < radiusSum) {
    enemy.data("collided", function(d) {
      d.collided = true;
    });
    collidedCallback();
  }
  //if collided
    //run collided callback
};




// tweenFunction has an object for an input, holds the future (x,y) coords of enemy at the next tick
// needs to grab start & end positions from their objects, and returns an anonymous
// function that accepts a timetick as an input, and runs a checkCollision function,
// and then calculates a future (x,y) for next tick, and sets that as the new position of enemy
var tweenWithCollisionDetection = function(endData) {
  var enemy = d3.select(this);

  return function(t) {
    if (!endData.collided) {
      checkCollision(enemy, onCollision);
    }

    if (t === 1) {
      if (!endData.collided) {
        // run score update function
        increaseScore();
      }
      endData.collided = false;
    }
  };
};

// we will also eventually want functions to keep track of and update current score, high score, and deaths

// update is a function to move the enemies around the board
// future - will need to perform collision detection during the move
var update = function() {

  // define an enemy with predetermined radius, and random center based on size of canvas
  var enemy = svg.selectAll("svg.enemy")
  .data(d3.range(16).map(function() { return {x: Math.random() * (width - radius) + radius, y: Math.random() * (height - radius) + radius, collided: false}; }));
  // selects all previously existing enemies, assigns new (x,y) coords
  enemy.transition() 
    .attr("x", function(d) {
                  d.x = Math.random() * (width - radius) + radius; 
                  return d.x;
                })
    .attr("y", function(d) { 
                  d.y = Math.random() * (height - radius) + radius; 
                  return d.y;
                })
    .duration(1000)
    .tween("collisions", tweenWithCollisionDetection); //Implement tween
  // creates new enemies, assigns initial (x,y) coords
  enemy.enter().append("svg")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("class", "enemy")
    .each(function() {
      var enemySVG = d3.select(this);
      enemySVG.append("path")
        .attr("class", "rotate")
        .attr("d", "m 15 0 l 5 10 l 10 5 l -10 5 l -5 10 l -5 -10 l -10 -5 l 10 -5 l 5 -10");
      enemySVG.append("circle")
        .attr("cx", 15)
        .attr("cy", 15)
        .attr("r", 2)
        .attr("fill", "white");
    });
    
  // currently unused, but can add removal functionality if difficulty selector is implemented
  enemy.exit().remove();

};

// seeds the game board with our enemy players
update();
// makes our enemy players move by calling update() on an interval of 1 second
setInterval(update, 1000);