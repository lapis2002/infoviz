function main() {
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 680 - margin.left - margin.right,
    height = 680 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
  
  // read json data
  sample = false
  if (sample) {
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json", function(data) {
    console.log(data)
    // Give the data to this cluster layout:
    var root = d3.hierarchy(data).sum(function(d){ return d.value}) // Here the size of each leave is given in the 'value' field in input data
    console.log(root)
    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
      .size([width, height])
      .paddingTop(28)
      .paddingRight(7)
      .paddingInner(3)      // Padding between each rectangle
      //.paddingOuter(6)
      //.padding(20)
      (root)
  
    // prepare a color scale
    var color = d3.scaleOrdinal()
      .domain(["boss1", "boss2", "boss3"])
      .range([ "#402D54", "#D18975", "#8FD175"])
  
    // And a opacity scale
    var opacity = d3.scaleLinear()
      .domain([10, 30])
      .range([.5,1])
  
    // use this information to add rectangles:
    svg
      .selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", function(d){ return color(d.parent.data.name)} )
        .style("opacity", function(d){ return opacity(d.data.value)})
  
    // and to add the text labels
    svg
      .selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
        .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.name.replace('mister_','') })
        .attr("font-size", "19px")
        .attr("fill", "white")
  
    // and to add the text labels
    svg
      .selectAll("vals")
      .data(root.leaves())
      .enter()
      .append("text")
        .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+35})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.value })
        .attr("font-size", "11px")
        .attr("fill", "white")
  
    // Add title for the 3 groups
    svg
      .append("text")
        .attr("x", 0)
        .attr("y", 14)    // +20 to adjust position (lower)
        .text("Three group leaders and 14 employees")
        .attr("font-size", "19px")
        .attr("fill",  "grey" )
  
  })}
  else {
  
  // set the dimensions and margins of the graph
  // var margin = {top: 10, right: 10, bottom: 10, left: 10},
  //   width = 680 - margin.left - margin.right,
  //   height = 680 - margin.top - margin.bottom;
  
  // // append the svg object to the body of the page
  // var svg = d3.select("#my_dataviz")
  // .append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  // .append("g")
  //   .attr("transform",
  //         "translate(" + margin.left + "," + margin.top + ")");
  
  d3.json("sample_neighbour2018.json", function(data) {
          // Give the data to this cluster layout:
          console.log(data)
  
          var root = d3.hierarchy(data).sum(function(d){ return d.size}) // Here the size of each leave is given in the 'value' field in input data
          // Then d3.treemap computes the position of each element of the hierarchy
          d3.treemap()
              .size([width, height])
              .paddingTop(28)
              .paddingRight(7)
              .paddingInner(3)      // Padding between each rectangle
              //.paddingOuter(6)
              //.padding(20)
              (root)
  
          // prepare a color scale
          // var color = d3.scaleOrdinal()
          //     .domain(["boss1", "boss2", "boss3"])
          //     .range([ "#402D54", "#D18975", "#8FD175"])
  
          const categories = data.children.map(d=>d.name),      
  
            colors = ["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", 
                      "#fdcce5", "#8bd3c7", "#2f4b7c", "#665191", "#a05195", "#d45087", "#56B870"]
                        
            
                        // '#1C1832', '#9E999D', '#F2259C', '#347EB4', 
                        // '#08ACB6', '#91BB91', '#BCD32F', '#75EDB8',
                        // "#89EE4B", '#AD4FE8', '#D5AB61', '#BC3B3A',
                        // '#F6A1F9', '#87ABBB', '#412433', '#56B870', 
                        // '#FDAB41', '#64624F'],
  
            colorScale = d3.scaleOrdinal() // the scale function
                          .domain(categories) // the data
                          .range(colors);    // the way the data should be shown             
  
          // And a opacity scale
          var opacity = d3.scaleLinear()
              .domain([10, 30])
              .range([.5,1])
  
          // use this information to add rectangles:
          svg
              .selectAll("rect")
              .data(root.leaves())
              .enter()
              .append("rect")
              .attr('x', function (d) { return d.x0; })
              .attr('y', function (d) { return d.y0; })
              .attr('width', function (d) { return d.x1 - d.x0; })
              .attr('height', function (d) { return d.y1 - d.y0; })
              .style("stroke", "black")
              .on("mouseover", onMouseOver)   // Add listener for the events
              .on("mouseout", onMouseOut)
              // .style("fill", function(d){ return colorScale(d.parent.data.name)} )
              .style("fill", function(d){ return colors[categories.indexOf(d.data.name)]} )
              .style("opacity", function(d){ return opacity(d.data.size)})
  
          // and to add the text labels
          svg
              .selectAll("text")
              .data(root.leaves())
              .enter()
              .append("text")
              .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
              .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
              .text(function(d){ return d.data.name.replace('mister_','') })
              .attr("font-size", "10px")
              .attr("fill", "white")
              
  
          // and to add the text labels
          svg
              .selectAll("vals")
              .data(root.leaves())
              .enter()
              .append("text")
              .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
              .attr("y", function(d){ return d.y0+35})    // +20 to adjust position (lower)
              .text(function(d){ return d.data.value })
              .attr("font-size", "11px")
              .attr("fill", "white")
  
          // Add title for the 3 groups
          svg
              .append("text")
              .attr("x", 0)
              .attr("y", 14)    // +20 to adjust position (lower)
              .text("Number of businesses per neighbourhood")
              .attr("font-size", "19px")
              .attr("fill",  "grey" )
  
      })
  
      function onMouseOver (d, i) {
          // Get bar's xy position -> augment them for the tooltip
          var xPos = parseFloat(d3.select(this).attr("x")); // get the center (on x coordinate)
          var yPos = parseFloat(d3.select(this).attr("y")); // get the center (on y coordinate)
  
          // Update tooltip
          d3.select("#tooltip")
              .style('left', xPos + 'px')
              .style('top',  yPos + 'px')
              .select('#value').text(d.data.size)
  
              d3.select("#tooltip").classed('hidden', false);
  
          d3.select(this)
              .attr('class', 'highlight')
      }
  
      function onMouseOut (d, i) {
          d3.select("#tooltip").classed('hidden', true);
      }
  }
}






