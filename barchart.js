 let margin={top:40, bottom:100, left:150, right:90},
    width=1000-margin.left-margin.right,
    height=600-margin.top-margin.bottom;

// define x and y scales

  let horizontal=d3.scale.ordinal().rangeRoundBands([0,width],0.12),
    vertical=d3.scale.linear().rangeRound([height,0]);

  let color = d3.scale.category10();

  let xAxis=d3.svg.axis()
    .scale(horizontal)
    .orient("bottom");

  let yAxis=d3.svg.axis()
    .scale(vertical)
    .orient("left");

// scalable vector graphics

  let svg=d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// import convertedTojsonfile

  d3.json("output/convertedTojson.json",function(err,data){
    if(err) console.log("data not loaded");

  let xData=["sugar","salt"];
  let dataIntermediate = xData.map(function (c) {
        return data.map(function (d) {
            return {x: d.country, y: d[c]};
        });
    });
  let dataStackLayout = d3.layout.stack()(dataIntermediate);

  // specify x and y scales domain

  horizontal.domain(dataStackLayout[0].map(function (d) {
        return d.x;
    }));
  vertical.domain([0,
        d3.max(dataStackLayout[dataStackLayout.length - 1],
                  function (d) { return d.y0 + d.y;})
      ])
      .nice();
  let layer = svg.selectAll(".stack")
          .data(dataStackLayout)
          .enter().append("g")
          .attr("class", "stack")
          .style("fill", function (d, i) {
                return color(i);
    });

// draw the bars

  layer.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            return horizontal(d.x);
          })
          .attr("y", function (d) {
              return vertical(d.y + d.y0);
          })
          .attr("height", function (d) {
              return vertical(d.y0) - vertical(d.y + d.y0);
        })
      .transition().duration(3000)
      .delay(function(d,i){return i*200 ;})
      .attr("width", horizontal.rangeBand());
    

// draw the xaxis

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("transform", "translate(" + width + ",0)")
      .attr("dy","1.3em")
      .attr("dx","1.2em")
      .style("font-size","15px")
      .style("font-weight","bold")
      .text("country");

  svg.append("g")
    .attr("class", "axis")
    .call(yAxis)
    .append("text")
       .attr("transform", "rotate(-90)")
       .attr("dy","1em")
       .style("text-anchor", "end")
       .style("font-size","15px")
       .style("font-weight","bold")
       .text("salt,sugar");

       let legend = svg.selectAll(".legend")
         .data(color.domain().slice())
         .enter().append("g")
         .attr("class", "legend")
         .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

     legend.append("rect")
         .attr("x", width - 18)
         .attr("width", 18)
         .attr("height", 18)
         .style("fill", color);

     legend.append("text")
         .attr("x", width - 24)
         .attr("y", 9)
         .attr("dy", ".35em")
         .style("text-anchor", "end")
         .style("fill","black")
         .text(function(d,i) { return xData[i]; });

  });