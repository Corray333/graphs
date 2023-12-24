function fromHTML(html, trim = true) {
  // Process the HTML string.
  html = trim ? html : html.trim();
  if (!html) return null;

  // Then set up a new template element.
  const template = document.createElement('template');
  template.innerHTML = html;
  const result = template.content.children;

  // Then return either an HTMLElement or HTMLCollection,
  // based on whether the input HTML had one or more roots.
  if (result.length === 1) return result[0];
  return result;
}

function printMatrix(matrix) {
  for (let i = 0; i<matrix.length; i++){
    let res = ""
    for (let j = 0; j<matrix[i].length; j++){
      res += matrix[i][j] + " "
    }
    console.log(res)
  }
}

let windowWidth = window.innerWidth / 2
let windowHeigth = window.innerHeight

class Graph {
  constructor() {
    this.nodes = []
    this.edges = []
    this.max = 0
  }
  countWays(node1, node2, paths) {
    paths.length = 0
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].name == node1) {
        return this.nodes[i].countWays([], node2, paths)
      }
    }
  }
  addEdge(node1, node2) {
    this.nodes.forEach(node => {
      if (node.name == node1) {
        this.nodes.forEach(temp => {
          if (temp.name == node2) {
            document.querySelector("#canvas").remove()
            document.querySelector(".content").append(fromHTML('<div id="canvas"></div>'))
            node.neighbors.push(temp)
            temp.neighbors.push(node)
            this.edges.push({ source: node, target: temp, color: "black" })
            this.edges.push({ source: temp, target: node, color: "black" })
            drawGraph(this)
          }
        })
      }
    })
  }

  addNode() {
    document.querySelector("#canvas").remove()
    document.querySelector(".content").append(fromHTML('<div id="canvas"></div>'))
    this.nodes.push(new Node(this.max++))
    drawGraph(this)
  }

  recolor(){
    let matrix = []
    let colors = []
    let marked = []
    for (let i = 0; i<this.nodes.length; i++){
      matrix.push([])
      for (let j = 0; j<this.nodes.length; j++){
        matrix[i].push(0)
      }
    }
    


    this.nodes.forEach(node=>{
      matrix[node.name][node.name] = 1
      node.neighbors.forEach(neighbor =>{
        matrix[node.name][neighbor.name] = 1
      })
    })
    printMatrix(matrix)
    
    for (let i = 0; i<matrix.length; i++){
      if (marked.includes(i)){
        continue
      }
      colors.push([i])
      for (let j = 0; j<matrix[i].length; j++){
        if (marked.includes(j)){
          continue
        }
        if (matrix[i][j] == 0){
          for (let k = 0; k<matrix[j].length; k++){
            matrix[i][k] |= matrix[j][k]
          }
          marked.push(j)
          colors[colors.length-1].push(j)
        }
      }
    }
    for (let i = 0; i<colors.length; i++){
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var j = 0; j < 6; j++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      this.nodes.forEach(node=>{
        if (colors[i].includes(node.name)){
          node.color = color
        }
      })
    }
  }
}
class Node {
  constructor(name) {
    this.x = Math.floor(Math.random() * (windowWidth - 30 + 1) + 30)
    this.y = Math.floor(Math.random() * (windowHeigth - 30 + 1) + 30)
    this.name = name
    this.neighbors = []
    this.color = "green"
  }
  countWays(visited, to, paths) {
    if (visited.includes(this)) {
      return 0
    }
    visited.push(this)
    if (this.name == to) {
      paths.push(visited)
      return 1
    }
    let k = 0
    this.neighbors.forEach(node => {
      k += node.countWays([...visited], to, paths)
    })
    return k
  }
}


// graph.nodes.push(new Node())
// graph.nodes.push(new Node())
// graph.nodes.push(new Node())
// graph.nodes.push(new Node())
// graph.nodes.push(new Node())
// graph.nodes.push(new Node())
// graph.nodes.push(new Node())
// graph.addEdge(0,1)
// graph.addEdge(0,2)
// graph.addEdge(0,6)
// graph.addEdge(1, 3)
// graph.addEdge(1, 2)
// graph.addEdge(2, 3)
// graph.addEdge(2, 5)
// graph.addEdge(2, 6)
// graph.addEdge(3, 6)
// graph.addEdge(3, 4)
// graph.addEdge(4, 5)



let graph = new Graph()
let paths = []

function addNode() {
  graph.addNode()
}

function addEdge() {
  let node1 = document.getElementById("node1").value
  let node2 = document.getElementById("node2").value
  graph.addEdge(node1, node2)
}

function recolor(){
  graph.recolor()
}

function countPaths() {
  if (document.querySelector(".result") != null) {
    document.querySelector(".result").remove()
  }
  let node1 = document.getElementById("start").value
  let node2 = document.getElementById("target").value
  let node3 = document.getElementById("through").value
  let result = graph.countWays(node1, node2, paths)
  const menuBlock = document.querySelector(".menu")
  const resBlock = document.createElement("div")
  resBlock.classList.add("result")
  menuBlock.appendChild(resBlock)
  const resultText = document.createElement("p")
  resultText.innerHTML = "Количество путей из " + node1 + " в " + node2 + " = " + result
  resBlock.appendChild(resultText)
  paths.forEach(path => {
    const pathText = document.createElement("p")
    f = false
    path.forEach(node => {
      if (node.name == node3) {
        f = true
      }
      pathText.innerHTML = pathText.innerHTML + node.name + " -> "
    })
    if (f) {
      pathText.innerHTML = pathText.innerHTML.substring(0, pathText.innerHTML.length - 6)
      resBlock.appendChild(pathText)
    } else {
      result--
    }
  })
  resultText.innerHTML = "Количество путей из " + node1 + " в " + node2 + " = " + result
}


// let graph = new Graph()


function drawGraph(graph) {
  var force = d3.forceSimulation()
    .velocityDecay(0.8)
    .alphaDecay(0)
    .force('collision', d3.forceCollide(50).strength(1))
    .force("link", d3.forceLink(graph.links))
    .force("center", d3.forceCenter(windowWidth / 2, windowHeigth / 2))

  var svg = d3.select("#canvas")
    .append("svg")
    .attr("width", "auto")
    .attr("height", "auto")
  // .call(d3.zoom().on("zoom", function () {
  //   svg.attr("transform", d3.event.transform)
  // }))


  svg.transition().duration(10000)


  let lines = svg.selectAll('.line').data(graph.edges); //<-- notice array

  // you have lines entering, .merge this back to the update selection
  lines = lines.enter()
    .append('line')
    .attr('class', 'line')
    .attr('stroke', d => d.color)
    .style("stroke-width", 2)
  


  var cont = svg.selectAll(".circle")
    .data(graph.nodes)
    .enter()
    .append('svg').classed(".circle", true)


  cont.append('circle')
    .attr('cx', data => data.x)
    .attr('cy', data => data.y)
    .attr('r', 30)
    .attr('fill', 'green')

  cont.append('text')
    .text(data => data.name)
    .style("font", "24px Ubuntu")
    .attr("fill", "white")
    .attr('x', data => data.x - 7)
    .attr('y', data => data.y + 7)


  force.on('tick', function () {
    lines
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", d => d.color)
    svg.selectAll('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('fill', d => d.color)
      
    svg.selectAll('text')
      .attr('x', d => d.x - 7)
      .attr('y', d => d.y + 7)
  })

  force.nodes(graph.nodes)

  let dragHandler = d3.drag()
    .on("drag", function () {
      d3.select(this)
        .attr("cx", data => data.x = d3.event.x)
        .attr("cy", data => data.y = d3.event.y);
    });
  dragHandler(cont);
}

