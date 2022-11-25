function main() {
    var year = document.getElementById("yearInput").value
    var selectedCs = [...document.getElementById("categoryInput").options]
        .filter(option => option.selected)
        .map(option => option.value)

    // var svg = d3.select("#my_dataviz").select("svg");
    
    var margin = 200;
    var width = 1000;
    var height = 500;

    const categories_imgs = {
        "Accomodation" : "img/accomodation_icon.png", 
        "Transportation": "img/transportation_icon.png", 
        "Business & Financial": "img/finance_icon.png", 
        "Other": "img/other_icon.png", 
        "Food & Liquor": "img/food_icon.png", 
        "Non Profit": "img/nonprofit_icon.png", 
        "Personal Services": "img/service_icon.png", 
        "Professional": "img/professional_icon.png", 
        "Retail": "img/retails_icon.png"
    }
    // clear if re-rendering
    const oldSvg = d3.select('#my_dataviz')
        .select("svg")
        .remove()

    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width+margin)
        .attr("height", height+margin);
    
    // var margin = 200;
    // var width = svg.attr("width") - margin;
    // var height = svg.attr("height") - margin;

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

    d3.csv("./data/victoria_data_better_categories.csv").then(
        function(data) {
            // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
            var categories = Array.from(new Set(data.map(d => d.Category)))
                .filter(c => selectedCs.includes(c))
            console.log(categories)
            var neighbourhoods = Array.from(new Set(data.map(d => d.Neighbourhood)))
            
            data = countByCategory(data, year, categories);
            
            // Add image icon to category
            data.forEach((d) => {
                d.Img = categories_imgs[d.Category];
            })

            // color palette = one color per subgroup
            var color = d3.scaleOrdinal()
            .domain(["Open","Close", "Category"])
            .range(['#69b3a2', '#e41a1c'])

            var series = d3.stack()
            .keys(["Open","Close"])
            .offset(d3.stackOffsetDiverging)
            (data);


            var xScale = d3.scaleBand().range([0, width]).padding(0.4);
            xScale.domain(data.map(function (d) { return d.Category; }));

            const highest = data.reduce((prev, cur) => (cur.Open > prev.Open ? cur : prev)).Open;
            const lowest = data.reduce((prev, cur) => (cur.Close < prev.Close ? cur : prev)).Close;
            var yScale = d3.scaleLinear()
                .domain([lowest, highest])
                .range([height, 0]);

            var zScale = d3.scaleOrdinal(d3.schemeCategory10);
            
            g.append("g")
                .selectAll("g")
                .data(series)
                .enter().append("g")
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .on("mouseover", onMouseOver)   // Add listener for the events
                .on("mouseout", onMouseOut)
                .attr("width", xScale.bandwidth)
                .attr("x", function(d) { return xScale(d.data.Category); })
                .attr("y", function(d) { return yScale(d[1]); })
                .transition()
                .ease(d3.easeLinear)
                .duration(500)
                .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); });
            
            // X axis
            svg.append("g")
                .attr("transform", "translate(100," + (100+yScale(0)) + ")")
                .attr("class", "xaxis")
                .call(d3.axisBottom(xScale))
                // .selectAll("text")                  // from down to end is rotate the label for the tick on x-axis
                // .attr("text-anchor", "end")
                // .attr("dx", "-.8em")
                // .attr("dy", ".5em")
                // .attr("transform", "rotate(-65)");

                svg.select(".xaxis").selectAll("text").remove();

                var ticks = svg.select(".xaxis")
                                .selectAll(".tick")
                                .each(function(d,i) {
                                    console.log(d, i, categories_imgs[d]);        
                                    d3.select(this)
                                    .append('image')
                                    .attr('xlink:href', categories_imgs[d])
                                    .attr('x',0)
                                    .attr('width',48)
                                    .attr('height',48)
                                    .attr("class", "circle_icon")
                                    .attr("transform", "translate(-25,-27)");
                                });
            // Y Axis
            g.append("g")
                .call(d3.axisLeft(yScale).tickFormat(function(d){return d;})
                        .ticks(10))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 10)
                .attr("dy", "-5em")
                .attr("stroke", "black")
                .text("Number of businesses per category");

            return data;
        }
    )

    function onMouseOver (d, i) {
        // Get bar's xy position -> augment them for the tooltip
        var xPos = parseFloat(d3.select(this).attr("x") + xScale.bandwidth()/2); // get the center (on x coordinate)
        var yPos = parseFloat(d3.select(this).attr("y") / 2 + height/2); // get the center (on y coordinate)
        
        console.log(d, i);
        // Update tooltip
        d3.select("#tooltip")
            .style('left', xPos + 'px')
            .style('top',  yPos + 'px')
            .select('#value').text(-i[0] != 0 ? "Closed businesses:" + (-i[0]) : "Open Businesses: " + i[1])

            d3.select("#tooltip").classed('hidden', false);

        d3.select(this)
            .attr('class', 'highlight')
        }

    function onMouseOut (d, i) {
        d3.select("#tooltip").classed('hidden', true);

        d3.select(this)
            .attr("class", "bar")
    }
}

function filterOpenInYear(data, year) {
    return data.filter(d => d.IssuedYear <= year && d.ExpiredYear >= year)
}

function filterIssuedInYear(data, year) {
    return data.filter(d => d.IssuedYear == year)
}

function filterExpiredInYear(data, year) {
    return data.filter(d => d.ExpiredYear == year)
}

function countByNeighbourhoodCategory(data, categories, neighbourhoods) {
    var countList = []
    neighbourhoods.forEach(n => {
        categories.forEach(c => {
            var count = data.filter(d => d.Category == c && d.Neighbourhood == n)
                .length
            countList.push({Category: c, Neighbourhood: n, Count: count})
        })
    })
    return countList
}

function countByCategory(data, year, categories) {
    var countList = []
    categories.forEach(c => {
        var open = data.filter(d => d.Category == c && d.IssuedYear == year)
            .length
        var close = data.filter(d => d.Category == c && d.ExpiredYear == year)
        .length 
        countList.push({Category: c, Open: open, Close: -close})
    })
    return countList
}