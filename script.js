/* global d3:true */
/* eslint no-undef: "error" */

const dataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const app = (body) => {
  const { data, description, name } = body
  const chartName = `United States ${name.split(',')[0]}, Quarterly`
  const numbers = []
  data.forEach((d) => {
    return numbers.push(d[1])
  })
  const maxValue = d3.max(numbers)
  const minDate = new Date(data[0][0])
  const maxDate = new Date(data[data.length - 1][0])

  d3.select('.title')
    .append('h2')
    .text(chartName)

  d3.select('.description')
    .append('p')
    .text(description)

  const svg = d3.select('svg')
  const margin = {top: 20, right: 20, bottom: 30, left: 40}
  const width = +svg.attr('width') - margin.left - margin.right
  const height = +svg.attr('height') - margin.top - margin.bottom

  const x = d3.scaleBand().rangeRound([0, width]).padding(0.3)
  const y = d3.scaleLinear().rangeRound([height, 0])

  const g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  x.domain(data.map((d) => {
    return d[0]
  }))

  y.domain([0, d3.max(data, (d) => {
    return d[1]
  })])

  console.log(minDate, maxDate)

  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x).ticks(d3.timeYears(5)))

  g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y).ticks(10))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('Frequency')

  g.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => x(d[0]))
    .attr('y', (d) => y(d[1]))
    .attr('width', x.bandwidth())
    .attr('height', (d) => height - y(d[1]))
}

// Fetch the data
fetch(dataUrl)
  .then((response) => {
    if (response.status !== 200) {
      console.log(`Looks like there was a problem. Status code ${response.status}`)
      return
    }
    return response.json()
  })
  .then((body) => {
    app(body)
  })
  .catch((error) => {
    console.log('There was an error. Promise rejected.')
    console.log(error)
  })
