// Color scheme
var color_scheme_colors = ["#A70225", "#8f1865", "#0a4794", "#cf1d43", "#00224D", "#bf3653", "#5e0417", "#5D0E41", "#0b356b"];

///////////////////////////////////////////////////////////////////////////////////////////
//Bubble chart for undergraduate student population 
///////////////////////////////////////////////////////////////////////////////////////////


var bubble_margin = { top: 0, right: 0, bottom: 0, left: 0 },
    bubble_width = 900 - bubble_margin.left - bubble_margin.right,
    bubble_height = 900 - bubble_margin.top - bubble_margin.bottom;

var main = d3.select("#plot1");

const bubbleChartSvg = main.append("svg")
    .attr("width", 900)
    .attr("height",900);

d3.csv("colleges.csv").then(function (data) {

    let bubbleChart = bubbleChartSvg.append('g')
        .attr('transform', 'translate(' + 0 + ',' + 0 + ')')

    const colorScale = d3.scaleOrdinal()
        .domain(["Public", "Private", "Private For-Profit"])
        .range(["#00224D", "#A0153E", "#5D0E41"]);

    const simulation = d3.forceSimulation(data)
        .force('charge', d3.forceManyBody().strength(0.6))
        .force('center', d3.forceCenter(bubble_width / 2 +100, bubble_height / 2+100))
        .force('collision', d3.forceCollide().radius(d => Math.sqrt(+d['Undergrad Population']) * 0.11))
        .on('tick', () => {
            bubbleChart.selectAll('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        });

    // Draw bubbles
    bubbleChart.selectAll(".myBubbles")
        .data(data)
        .enter()
        .append("circle")
        .attr('class', 'myBubbles')
        .attr("r", d => Math.sqrt(+d['Undergrad Population']) * 0.1) // Bubble size based on Undergrad Population
        .style("fill", d => colorScale(d.Control)) // Color based on Control type
        .style("opacity", 0.9)
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", d => Math.sqrt(+d['Undergrad Population']) * 0.4) // Increase size
                .style("fill", "#FFAF45")
                .style("opacity", 1.0); // Increase opacity
          
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", d => Math.sqrt(+d['Undergrad Population']) * 0.1) // Return to original size
                .style("fill", d => colorScale(d.Control))
                .style("opacity", 0.9); // Return to original opacity
                
        })
        .append("title")
        .text(d => `${d.Name}\nUndergrad Population: ${d['Undergrad Population']}`);


    const totalPopulation = data.reduce((acc, d) => acc + parseInt(d['Undergrad Population']), 0);
    const averagePopulation = totalPopulation / data.length;
    console.log("Average Undergraduate Population:", averagePopulation);
    console.log("Number of colleges:", data.length);

});



///////////////////////////////////////////////////////////////////////////////////////////
//Bubble chart for region based universities
///////////////////////////////////////////////////////////////////////////////////////////


bubble_margin = { top: 0, right: 0, bottom: 0, left: 0 },
    bubble_width = 700 - bubble_margin.left - bubble_margin.right,
    bubble_height = 700 - bubble_margin.top - bubble_margin.bottom;

var main2 = d3.select("#plot2");

const bubbleChartSvg2 = main2.append("svg")
    .attr("width", 700)
    .attr("height", 700);

const regionText = bubbleChartSvg2.append("text")
.attr("id", "regionText")
.attr("x", 320)
.attr("y", 620) 
.attr("font-family", "sans-serif")
.style("text-anchor", "middle");

function drawBubbleChart(region, color, cx, cy) {
        d3.csv("colleges.csv").then(function (data) {
    
            // Filter data to include only colleges with specific region
            data = data.filter(d => d.Region === region);
    
            let bubbleChart = bubbleChartSvg2.append('g')
                .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
    

            const simulation = d3.forceSimulation(data)
                .force('charge', d3.forceManyBody().strength(12))
                .force('center', d3.forceCenter(cx, cy))
                .force('collision', d3.forceCollide().radius(d => Math.sqrt(+d['Undergrad Population']) * 0.1))
                .on('tick', () => {
                    bubbleChart.selectAll('circle')
                        .attr('cx', d => d.x)
                        .attr('cy', d => d.y);
                });
    
            // Draw bubbles
            bubbleChart.selectAll(".myBubbles")
                .data(data)
                .enter()
                .append("circle")
                .attr('class', 'myBubbles')
                .attr("r", d => Math.sqrt(+d['Undergrad Population']) * 0.08) // Reduced bubble size
                .style("fill", color)
                .style("opacity", 1)
                .on("mouseover", function (event, d) {
                    // Change the color of all bubbles in the same region to yellow
                    bubbleChart.selectAll(".myBubbles")
                        .filter(b => b.Region === region)
                        .style("opacity", 0.8)
                        .style("stroke", "#FFAF45")
                        .style("stroke-width", "5px")
                        .style("fill", "#FFAF45")
                        .transition()
                        .duration(200);
                        
                    
                    regionText.text(`Number of Colleges in the ${region} region : ${data.length}`);
                })
                .on("mouseout", function (event, d) {
                    bubbleChart.selectAll(".myBubbles")
                        .filter(b => b.Region === region)
                        .style("opacity", 1)
                        .style("stroke", "none")
                        .style("fill", color)
                        .transition()
                        .duration(200);
                    regionText.text("");
                })
                .append("title")
                .text(d => `${d.Name}\nUndergrad Population: ${d['Undergrad Population']}`);
    

            const totalPopulation = data.reduce((acc, d) => acc + parseInt(d['Undergrad Population']), 0);
            const averagePopulation = totalPopulation / data.length;
            console.log(`Average Undergraduate Population in ${region}:`, averagePopulation);
            console.log(`Number of colleges in ${region}:`, data.length);
        });
    }
    
   

    drawBubbleChart("Southeast", "#A70225", 200, 198);
    drawBubbleChart("Far West","#8f1865", 390,150);
    drawBubbleChart("Southwest", "#0a4794", 330,290);
    drawBubbleChart("Great Lakes", "#cf1d43",530,270);
    drawBubbleChart("Great Plains", "#00224D", 200,360);
    drawBubbleChart("Mid-Atlantic", "#bf3653", 360,470);
    drawBubbleChart("New England", "#5e0417",190, 490);
    drawBubbleChart("Outlying Areas",  "#5D0E41", 440,370);
    drawBubbleChart("Rocky Mountains","#0b356b", 530,430);




///////////////////////////////////////////////////////////////////////////////////////////
//Box plot of median expenditures
///////////////////////////////////////////////////////////////////////////////////////////




var margin = { top: 50, right: 60, bottom: 100, left: 100 }, // Increased bottom and left margins
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var boxPlotSvg = d3.select("#plot3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("colleges.csv").then(function (data) {
    // Filter out entries with Locale "Unknown"
    data = data.filter(function(d) {
        return d.Locale !== "Unknown";
    });
    var nestedData = d3.group(data, d => d.Locale);
    var boxPlotData = Array.from(nestedData, ([key, values]) => ({
        locale: key,
        values: values.map(d => +d['Average Cost']).sort(d3.ascending)
    }));

    // Compute quartiles and median for each locale
    boxPlotData.forEach(function(d) {
        var q1 = d3.quantile(d.values, 0.25);
        var median = d3.quantile(d.values, 0.5);
        var q3 = d3.quantile(d.values, 0.75);
        var iqr = q3 - q1;
        var min = q1 - 1.5 * iqr +16500;
        var max = q3 + 1.5 * iqr;
        d.quartiles = [q1, median, q3];
        d.min = min;
        d.max = max;
        console.log("Minimum Average Cost for " + d.locale + ": " + min);
    });

    // X scale
    var x = d3.scaleBand()
        .domain(boxPlotData.map(function (d) { return d.locale; }))
        .range([0, width])
        .padding(0.05);

    boxPlotSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Y scale
    var yMin = d3.min(boxPlotData, function (d) { return d.min ; }); 
    var yMax = d3.max(boxPlotData, function (d) { return d.max+5000 ; }); 
    var y = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height, 0]);

    boxPlotSvg.append("g")
        .call(d3.axisLeft(y).tickFormat(d3.format("$,d")));
    
    // Main vertical line
    boxPlotSvg.selectAll(".verticalLine")
    .data(boxPlotData)
    .enter()
    .append("line")
    .attr("class", "verticalLine")
    .attr("x1", function (d) { return x(d.locale) + x.bandwidth() / 2; })
    .attr("x2", function (d) { return x(d.locale) + x.bandwidth() / 2; })
    .attr("y1", function (d) { return y(d.min); })
    .attr("y2", function (d) { return y(d.max); })
    .attr("stroke", "#bf3653");

    // main box plot elements
    var boxPlots = boxPlotSvg.selectAll(".boxPlot")
        .data(boxPlotData)
        .enter()
        .append("g")
        .attr("class", "boxPlot")
        .attr("transform", function (d) { return "translate(" + x(d.locale) + ",0)"; });

 
    boxPlots.append("rect")
        .attr("x", x.bandwidth() / 2 - 30) 
        .attr("y", function (d) { return y(d.quartiles[2]); })
        .attr("height", function (d) { return y(d.quartiles[0]) - y(d.quartiles[2]); })
        .attr("width", 60) 
        .attr("rx", 10)
        .attr("stroke", "#bf3653")
        .style("fill", "#00224D");


    boxPlots.append("text")
        .attr("x", x.bandwidth() / 2)
        .attr("y", function (d) { return y(d.quartiles[1]); })
        .attr("dy", "-0.5em")
        .attr("text-anchor", "middle")
        .text(function (d) { return "$" + d.quartiles[1].toFixed(2); })
        .style("font-size", "12px")
        .style("fill", "#FFAF45")
        .style("opacity", 0)
        .style("font-family", "sans-serif");

    // Show text on hover
    boxPlots.on("mouseover", function () {
            d3.select(this).select("text")
            .transition()
            .duration(200)
            .style("opacity", 1);
           
        })
        .on("mouseout", function () {
            d3.select(this).select("text")
            .transition()
            .duration(200)
            .style("opacity", 0);
        });


    // Median line
    boxPlotSvg.selectAll(".medianLine")
        .data(boxPlotData)
        .enter()
        .append("line")
        .attr("class", "medianLine")
        .attr("x1", function (d) { return x(d.locale) + x.bandwidth() / 2 - 30; }) 
        .attr("x2", function (d) { return x(d.locale) + x.bandwidth() / 2 + 30; }) 
        .attr("y1", function (d) { return y(d.quartiles[1]); })
        .attr("y2", function (d) { return y(d.quartiles[1]); })
        .attr("stroke", "#bf3653")
        .style("stroke-width", 1);
 
});



///////////////////////////////////////////////////////////////////////////////////////////
//Word cloud of all universities, slider for median debt
///////////////////////////////////////////////////////////////////////////////////////////




var margin = { top: 50, right: 30, bottom: 100, left: 50 },
    wwidth = 900 - margin.left - margin.right,
    wheight = 1000 - margin.top - margin.bottom;

var cloudPlotSvg = d3.select("#plot4")
    .append("svg")
    .attr("width", wwidth + margin.left + margin.right)
    .attr("height", wheight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("colleges.csv").then(function (data) {
    var universityNames = data.map(function(d) { return d.Name; });

    // min and max values for slider
    var minValue = d3.min(data, function(d) { return +d["Median Debt"]; });
    var maxValue = d3.max(data, function(d) { return +d["Median Debt"]; });
    console.log("Max median debt = " +maxValue );
    console.log("Min median debt = " +minValue );

    var initialSliderValue = maxValue;
    var debtSlider = d3.select("#wordcloud")
        .append("input")
        .attr("type", "range")
        .attr("min", minValue)
        .attr("max", maxValue)
        .attr("value", initialSliderValue)
        .attr("id", "debtSlider");


    debtSlider.on("input", function() {
        var sliderValue = +this.value;
        document.getElementById('debt_val').innerHTML = "$" +sliderValue;
        var filteredUniversityNames = data.filter(function(d) {
            return +d["Median Debt"] <= sliderValue;
        }).map(function(d) {
            return d.Name;
        });
        document.getElementById('debt_num').innerHTML = filteredUniversityNames.length;

        updateWordCloud(filteredUniversityNames);
        
    });

    var layout = d3.layout.cloud()
        .size([wwidth, wheight])
        .words(universityNames.map(function(name) { return { text: name }; }))
        .padding(0)        
        .rotate(0)         
        .fontSize(3)      
        .on("end", draw);

    layout.start();

    function draw(words) {
        cloudPlotSvg.selectAll("text").remove(); 

        cloudPlotSvg
            .append("g")
                .attr("transform", "translate(" + wwidth / 2 + "," + wheight / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return 10+"px"; })
                .style("opacity", function(d) { return 0.7; })
                .style("fill", function() {
                    return color_scheme_colors[Math.floor(Math.random() * color_scheme_colors.length)];
                })
                .style("font-weight", function() {
                    return Math.floor(Math.random() * (800-100 + 1)) + 100;
                })
                .attr("text-anchor", "middle")
                .style("font-family", "sans-serif")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
    }

    // Function to update the word cloud with given university names
    function updateWordCloud(universityNames) {
        var layout = d3.layout.cloud()
            .size([wwidth, wheight])
            .words(universityNames.map(function(name) { return { text: name }; }))
            .padding(0)        
            .rotate(0)       
            .fontSize(3)   
            .on("end", draw);

        layout.start();
    }
});



///////////////////////////////////////////////////////////////////////////////////////////
//Scatter plot of mean income vs admission rate
///////////////////////////////////////////////////////////////////////////////////////////


margin = { top: 50, right: 60, bottom: 100, left: 100 }, // Increased bottom and left margins
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var scatterPlotSvg = d3.select("#plot5")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



d3.csv("colleges.csv").then(function(data) {
    // Filter out data points with "0" 
    data = data.filter(function(d) {
        return +d['Admission Rate'] !== 0 && +d['Mean Earnings 8 years After Entry'] !== 0;
    });

// X scale
var x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d['Mean Earnings 8 years After Entry']; }) +10000])
    .range([0, width]);

scatterPlotSvg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Y scale
var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d['Admission Rate']; })+0.05])
    .range([height, 0]);

// Append x-axis label
scatterPlotSvg.append("text")
.attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
.style("text-anchor", "middle")
.text("Mean Earnings 8 years After Entry (in USD)");

// Append y-axis label
scatterPlotSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+20)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Admission Rate");
scatterPlotSvg.append("g")
    .call(d3.axisLeft(y));

// Add dots
scatterPlotSvg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function(d) { return x(+d['Mean Earnings 8 years After Entry']); })
    .attr("cy", function(d) { return y(+d['Admission Rate']); })
    .attr("r", 4)
    .style("fill", function(d) {
        var completionRate = +d['Completion Rate 150% time'];
        if (completionRate <= 0.33) {
            return "#cf1d43";
        } else if (completionRate <= 0.66) {
            return "#5D0E41";
        } else {
            return "#00224D";
        }
    })
    .style("opacity", 0.7)
    .on("mouseover", function (event, d) {
        d3.select(this)
            .attr("r", 15)
            .transition()
            .duration(200)
            .style("opacity", 1.0)
            .style("fill","#FFAF45") ; 
      
    })
    .on("mouseout", function (d) {
        d3.select(this)
        .attr("r", 4)
        .transition()
        .duration(200)
        .style("opacity", 0.7)
        .style("fill", function(d) {
            var completionRate = +d['Completion Rate 150% time'];
            if (completionRate <= 0.33) {
                return "#cf1d43";
            } else if (completionRate <= 0.66) {
                return "#5D0E41";
            } else {
                return "#00224D";
            }
        }); 
            
    })
    .append("title")
    .text(function(d) { return d.Name; });

    
});
