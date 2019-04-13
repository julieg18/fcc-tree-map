let JSONlink = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json'

let treeMapWidth = 1000
let treeMapHeight = 600
let treeMapSvg = d3.select('#tree-map')
  .attr('width', treeMapWidth)
  .attr('height', treeMapHeight)
let treemap = d3.treemap()
  .size([treeMapWidth, treeMapHeight])
  .paddingInner(1)
let colors = {
  'Action': 'red',
  'Drama': 'blue',
  'Adventure': 'orange',
  'Family': 'yellow',
  'Animation': 'lightblue',
  'Comedy': 'green',
  'Biography': 'gray'
}

function makeGenreArray (obj) {
  let arr = []
  for (let prop in obj) {
    arr.push(prop)
  }
  return arr
}

let req = new XMLHttpRequest()
req.open('GET', JSONlink, true)
req.send()
req.onload = function () {
  let JSONdata = JSON.parse(req.responseText)

  let root = d3.hierarchy(JSONdata)
    .sum((d) => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value)
  treemap(root)

  let tiles = treeMapSvg.selectAll('g')
    .data(root.leaves())
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(${d.x0},${d.y0})`)

  tiles
    .append('rect')
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .attr('data-name', (d) => d.data.name)
    .attr('data-category', (d) => d.data.category)
    .attr('data-value', (d) => d.data.value)
    .attr('class', 'tile')
    .attr('fill', (d) => colors[d.data.category])
    .on('mousemove', (d) => {
      d3.select('#tooltip')
        .style('visibility', 'visible')
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 20}px`)
        .attr('data-value', d.data.value)
        .html(`
          Name: ${d.data.name}
          </br>
          Category: ${d.data.category}
          </br>
          Value: ${d.data.value}
        `)
    })
    .on('mouseout', (d) => {
      d3.select('#tooltip')
        .style('visibility', 'hidden')
    })

  let legendHeight = 20
  let legendWidth = 800
  let legendSvg = d3.select('#legend')
    .attr('height', legendHeight)
    .attr('width', legendWidth)
  let genreArray = makeGenreArray(colors)

  legendSvg
    .selectAll('rect')
    .data(genreArray)
    .enter()
    .append('rect')
    .attr('height', 20)
    .attr('width', 20)
    .attr('x', (d, i) => i * (legendWidth / 7))
    .attr('y', 0)
    .attr('fill', (d) => colors[d])

  legendSvg
    .selectAll('text')
    .data(genreArray)
    .enter()
    .append('text')
    .text((d) => d)
    .attr('x', (d, i) => i * (legendWidth / 7) + 25)
    .attr('y', legendHeight - 5)
}
