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
  console.log(maxValue)
  const minDate = new Date(data[0][0])
  const maxDate = new Date(data[data.length - 1][0])

  const dimensions = {
    width: 600,
    height: 400,
    margin: 40,
    innerWidth: 520,
    innerHeight: 320,
    barMargin: 5
  }

  const xScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, dimensions.innerWidth])

  const yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, dimensions.innerHeight])

  const yAxisScale = d3.scaleLinear()
    .domain([maxValue, 0])
    .range([0, dimensions.innerHeight])

  const chart = d3.select('.chart')
    .append('svg')
    .attrs({
      width: dimensions.width,
      height: dimensions.height
    })

  const yAxis = d3.axisLeft(yAxisScale)
    .tickSizeInner(-dimensions.innerWidth)
    .tickPadding(5)

  chart.append('g')
    .attrs({
      class: 'axis axis-y',
      transform: 'translate(' + dimensions.margin + ', ' + dimensions.margin + ')'
    })
    .call(yAxis)

  d3.select('.title')
    .append('h2')
    .text(chartName)

  d3.select('.description')
    .append('p')
    .text(description)
}

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
