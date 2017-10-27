/* global d3:true */
/* eslint no-undef: "error" */

const dataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const createChart = (body) => {
  const { data, description, name } = body

  const minDate = new Date(data[0][0])
  const maxDate = new Date(data[data.length - 1][0])

  d3.select('.chart').selectAll('div')
    .data(data)
    .enter()
    .append('div')
    .attr('class', 'bar')
    .style('height', (d) => d[1] / 30 + 'px')

  d3.select('.title')
    .append('div')
    .append('h2')
    .text(name)

  d3.select('.description')
    .append('div')
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
    createChart(body)
  })
  .catch((error) => {
    console.log('There was an error. Promise rejected.')
    console.log(error)
  })
