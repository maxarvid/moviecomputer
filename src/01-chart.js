import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 50
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

// Defining the div for the tooltip (check the <style> in html.index)
var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0)

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Our Scalars
const xPositionScale = d3.scaleBand().range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([0, 10])
  .range([height, 0])

d3.csv(require('./data/moviedata_cleaned.csv')).then(ready)

function ready(datapoints) {
  console.log('data is ', datapoints)

  // Giving the x position scale its domain
  const computers = datapoints.map(d => d.computer)
  xPositionScale.domain(computers)

  // Let's make some rectangles
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('width', xPositionScale.bandwidth())
    .attr('height', d => {
      return height - yPositionScale(d.appearance_count)
    })
    .attr('x', d => xPositionScale(d.computer))
    .attr('y', d => yPositionScale(d.appearance_count))
    .attr('fill', 'lightgrey')
    .on('mouseover', function(d) {
      // console.log(d.computer)
      div
        .transition()
        .duration(200)
        .style('opacity', 0.9)
      div.html(`<p>${d.computer}<br>${d.appearance_count} appearances</p>`)
        .style("left", (d3.event.pageX) + "px")    
        .style("top", (d3.event.pageY - 50) + "px")
    })
    .on('mouseout', function(d) {
      div.transition()
        .duration(500)
        .style('opacity', 0)
    })

  svg
    .append('text')
    .text('computers listed alphabetically')
    .attr('class', 'xaxis-label-text')
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('x', width * 0.5)
    .attr('y', height + 15)


  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)
    .tickFormat(d => (d === 10 ? '10 films' : d))

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()

}