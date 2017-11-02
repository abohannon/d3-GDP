/* global d3:true */
/* eslint no-undef: "error" */

const dataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const app = (body) => {
  const { data, description, name } = body
  const chartName = `United States ${name.split(',')[0]}, Quarterly`

  // string to date helper
  const dateFromData = date => {
    const arr = date.split('-')
    return new Date(arr[0], arr[1], arr[2])
  }

  // dimensions for svg canvas
  const w = 900
  const h = 600
  const padding = 100

  // create svg canvas
  const svg = d3.select('svg')
    .attr('width', w)
    .attr('height', h)

  // x scale and axis
  const xScale = d3.scaleTime()
    .domain([
      d3.min(data, (d) => dateFromData(d[0])),
      d3.max(data, (d) => dateFromData(d[0]))
    ])
    .range([padding, w - padding])

  const xAxis = d3.axisBottom(xScale)

  svg.append('g')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis)

  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', w / 2)
    .attr('y', h - padding / 2 - 5)
    .text('Year')

  // y scale and axis
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([h - padding, padding])

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d => '$' + d3.format(',')(d))

  svg.append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis)

  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(${padding / 3}, ${h / 2})rotate(-90)`)
    .text('Billions')

  // plot data and add tooltip using native d3 title
  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => xScale(dateFromData(d[0])))
    .attr('y', d => yScale(d[1]))
    .attr('width', 3)
    .attr('height', d => h - padding - yScale(d[1]))
    .attr('class', 'bar')
    .append('title')
    .text((d) => d[0] + ', ' + '$' + d3.format(',')(d[1]))

  // chart title
  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', w / 2)
    .attr('y', padding / 2.5)
    .attr('class', 'title')
    .text(chartName)

  // chart description
  const desc = description.split('\n')

  svg.append('text')
    .attr('x', w / 2)
    .attr('y', h - padding / 10)
    .attr('class', 'description')
    .selectAll('tspan')
    .data(desc)
    .enter()
    .append('tspan')
    .attr('text-anchor', 'middle')
    .attr('x', w / 2)
    .attr('y', (d, i) => h - padding / 2 + i * 12 + 15)
    .text(d => d)
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
