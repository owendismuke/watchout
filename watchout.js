// start slingin' some d3 here.

var width = 800;
var height = 600;
var radius = 15;


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

var onCollision = function(){
  var collsSpan = d3.select(".collisions span");
  var collisions = Number(collsSpan.text());

  collsSpan.text(++collisions);

};

// checkCollision somehow needs to check the distance between an enemy and the player, and if there
// is a collision detected, run a collidedCallback to have the desired behavior
var checkCollision = function(enemy, collidedCallback) { 
  //grab current enemy x,y, and r
  //grab player x,y, r
  var radiusSum = parseFloat(enemy.attr("r")) + parseFloat(player.attr("r"));
  var xDiff = parseFloat(enemy.attr("cx")) - parseFloat(player.attr("cx"));
  var yDiff = parseFloat(enemy.attr("cy")) - parseFloat(player.attr("cy"));

  var separation = Math.sqrt( Math.pow(xDiff, 2) + Math.pow(yDiff, 2) );

  //check separation with formula to at least sum of radii
  if (separation < radiusSum) {
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
  
  var startPos = {
    x: parseFloat(enemy.attr("cx")),
    y: parseFloat(enemy.attr("cy"))
  };

  var endPos = {
    x: endData.x,
    y: endData.y
  };


  return function(t) {
    checkCollision(enemy, onCollision);

    var enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x)*t,
      y: startPos.y + (endPos.y - startPos.y)*t
    };

    enemy.attr("cx", enemyNextPos.x)
         .attr("cy", enemyNextPos.y);
  };


};

// we will also eventually want functions to keep track of and update current score, high score, and deaths

// update is a function to move the enemies around the board
// future - will need to perform collision detection during the move
var update = function() {

  // define an enemy with predetermined radius, and random center based on size of canvas
  var enemy = svg.selectAll("circle.enemy")
  .data(d3.range(16).map(function() { return {x: Math.random() * (width - radius) + radius, y: Math.random() * (height - radius) + radius}; }));
  // selects all previously existing enemies, assigns new (x,y) coords
  enemy.transition() 
    .attr("cx", function(d) {
                  d.x = Math.random() * (width - radius) + radius; 
                  return d.x;
                })
    .attr("cy", function(d) { 
                  d.y = Math.random() * (height - radius) + radius; 
                  return d.y;
                })
    .duration(1000)
    .tween("collisions", tweenWithCollisionDetection); //Implement tween
  // creates new enemies, assigns initial (x,y) coords
  enemy.enter().append("circle")
    .attr("r", radius)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("class", "enemy");
  // currently unused, but can add removal functionality if difficulty selector is implemented
  enemy.exit().remove();

};

// seeds the game board with our enemy players
update();
// makes our enemy players move by calling update() on an interval of 1 second
setInterval(update, 1000);