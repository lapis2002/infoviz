function main() {
    var svg = d3.select("svg");
    var margin = 200;
    var width = svg.attr("width") - margin;
    var height = svg.attr("height") - margin;

    var xScale = d3.scaleBand().range([0, width]).padding(0.4);
    var yScale = d3.scaleLinear().range([height, 0]);

    // title
    svg.append("text")
        .attr("transform", "translate("+450+",0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("Number of business in different categories")

    var g = svg.append("g").attr("transform", "translate("+100+","+100+")");

    d3.csv("./test_catgory.csv").then(
        function(data) {
            xScale.domain(data.map(function (d) { return d.Category; }))
            yScale.domain([0, d3.max(data, function(d){return d.Number})]);

            g.append("g")
                .attr('transform', "translate(0," +height + ")")    // bar position from tick, we need to translate y aix as 0 starts at top left
                .call(d3.axisBottom(xScale))
                .selectAll("text")                  // from down to end is rotate the label for the tick on x-axis
                .attr("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");

            g.append("g")
                .call(d3.axisLeft(yScale).tickFormat(function(d){return d;})
                        .ticks(10))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 10)
                .attr("dy", "-5em")
                .attr("stroke", "black")
                .text("Number of businesses/Category");

            g.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")   // interactive part will go here
                .on("mouseover", onMouseOver)   // Add listener for the events
                .on("mouseout", onMouseOut)
                .attr("x", function (d) {return xScale(d.Category);})
                .attr("y", function (d) {return yScale(d.Number);})
                .attr("width", xScale.bandwidth())
                .transition()
                .ease(d3.easeLinear)
                .duration(500)
                .delay(function (d,i) {return i*50})
                .attr("height", function (d) {return height - yScale(d.Number);});
            return data;
        }
    )

    function onMouseOver (d, i) {
        // Get bar's xy position -> augment them for the tooltip
        var xPos = parseFloat(d3.select(this).attr("x") + xScale.bandwidth()/2); // get the center (on x coordinate)
        var yPos = parseFloat(d3.select(this).attr("y") / 2 + height/2); // get the center (on y coordinate)

        // Update tooltip
        d3.select("#tooltip")
            .style('left', xPos + 'px')
            .style('top',  yPos + 'px')
            .select('#value').text(i.Number)

            d3.select("#tooltip").classed('hidden', false);

        d3.select(this)
            .attr('class', 'highlight')
        
        d3.select(this)
            .transition()
            .duration(200)
            .attr('width', xScale.bandwidth() + 5)
            .attr('y', function (d) { return yScale(d.Number) - 10;})
            .attr("height", function (d) { return height - yScale(d.Number) + 10; });
    }

    function onMouseOut (d, i) {
        d3.select("#tooltip").classed('hidden', true);

        d3.select(this)
            .attr("class", "bar")

        d3.select(this)
            .transition()
            .duration(200)
            .attr('width', xScale.bandwidth())
            .attr('y', function (d) { return yScale(d.Number);})
            .attr("height", function (d) { return height - yScale(d.Number); });
    }
}






