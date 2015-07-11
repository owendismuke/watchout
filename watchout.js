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
    .duration(1000);
  // creates new enemies, assigns initial (x,y) coords
  enemy.enter().append("circle")
    .attr("r", radius)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("class", "enemy");
  // currently unused, but can add removal functionality if difficulty selector is implemented
  enemy.exit().remove();

};

update();
setInterval(update, 1000);