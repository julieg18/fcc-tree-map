let JSONlink = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json'
// 910 - 2950
// 500
let width = 1000
let height = 700
let treeMapSvg = d3.select('#tree-map')
  .attr('width', width)
  .attr('height', height)
let treemap = d3.treemap()
  .size([width, height])
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
}
