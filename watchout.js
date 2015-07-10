// start slingin' some d3 here.

var width = 800;
var height = 600;
var radius = 15;

var svg = d3.select("body").append("svg")
  // future idea - make canvas size responsive to size of browser window
  .attr("width", width)
  .attr("height", height);

// update is a function to move the enemies around the board
// future - will need to perform collision detection during the move
var update = function() {
  // temporary way to generate data for enemy circles, will refactor later?
  // currently only purpose is to determine number of enemy dots
  // include a slider or difficulty setting on index.html, use that to determine 
  // number of enemies?
  var tempArray = [];
  for (var i = 0; i < 20; i++) {
    tempArray.push(i);
  }
  // define an enemy with predetermined radius, and random center based on size of canvas
  var enemy = svg.selectAll("circle").data(tempArray);
  // selects all previously existing enemies, assigns new (x,y) coords
  enemy.transition() 
    .attr("cx", function() { return Math.random() * (width - radius) + radius; })
    .attr("cy", function() { return Math.random() * (height - radius) + radius; })
    .duration(1000);
  // creates new enemies, assigns initial (x,y) coords
  enemy.enter().append("circle")
    .attr("r", radius)
    .attr("cx", function() { return Math.random() * (width - radius) + radius; })
    .attr("cy", function() { return Math.random() * (height - radius) + radius; });
  // currently unused, but can add removal functionality if difficulty selector is implemented
  enemy.exit().remove();

};
update();
setInterval(update, 1000);