let PATH_DATA = {}
let CURRENT_PATH = null
let CURRENT_PATH_POINTS = []

d3.json("data/paths.json")
  .then((res) => {
    PATH_DATA = res
    preprocessGraph()
  })

const drawCurrentPath = (floor) => {
  if (CURRENT_PATH === null) { return }
  const floorPoints = CURRENT_PATH.filter(p => GRAPH_POINTS[p].floor === floor)
  let lines = []

  for (let i = 0; i < CURRENT_PATH.length - 1; i++) {
    const point = GRAPH_POINTS[CURRENT_PATH[i]]
    const nextPoint = GRAPH_POINTS[CURRENT_PATH[i + 1]]

    if (point.floor !== floor || nextPoint.floor !== floor) {
      continue
    }

    lines.push([
      point.x, point.y,
      nextPoint.x, nextPoint.y
    ])
  }

  g.selectAll(".path").remove()
  g.selectAll(".path")
    .data(lines)
    .enter()
    .append("line")
    .attr("class", "path")
    .attr("x1", d => d[0])
    .attr("y1", d => d[1])
    .attr("x2", d => d[2])
    .attr("y2", d => d[3])
		.style("stroke-width", "0.5px")
    .style("stroke", "red")
    .attr('marker-end', "url(#arrow)")
}

const drawDebugPaths = (floor) => {
  const data = PATH_DATA[floor + ""]
  const waypointsMap = data.waypoints.reduce((o, key) => ({ ...o, [key.id]: key }), {})

  g.selectAll(".path-waypoint").remove()
  g.selectAll(".path-waypoint-label").remove()
  g.selectAll(".path-debug").remove()

  g.selectAll(".path-waypoint")
    .data(data.waypoints)
    .enter()
    .append("rect")
    .attr("class", "path-waypoint")
    .attr("x", d => d.x - 2.5)
    .attr("y", d => d.y - 2.5)
    .attr("width", 5)
    .attr("height", 5)
    .style("fill", d => {
      if ("type" in d) {
        if (d.type === "room") {
          return "black"
        }
        if (d.type === "teleport") {
          return "purple"
        }
      }
      return "blue"
    })

  g.selectAll(".path-waypoint-label")
    .data(data.waypoints)
    .enter()
    .append("text")
    .attr("class", "path-waypoint-label")
    .attr("dx", d => d.x - 2.5)
    .attr("dy", d => d.y - 5)
    .text(d => d.id)
		.style("font-size", "3px")
    .style("fill", "blue")

  g.selectAll(".path-debug")
    .data(data.paths)
    .enter()
    .append("line")
    .attr("class", "path-debug")
    .attr("x1", d => waypointsMap[d[0]].x)
    .attr("y1", d => waypointsMap[d[0]].y)
    .attr("x2", d => waypointsMap[d[1]].x)
    .attr("y2", d => waypointsMap[d[1]].y)
		.style("stroke-width", "0.5px")
    .style("stroke", d => (d.length === 2 || !d[2]) ? "blue" : "red")
}

let GRAPH = {}  // zoznam susedov
let GRAPH_ROOMS = {}    // room -> [points]
let GRAPH_POINTS = {}    // id -> point

const preprocessGraph = () => {
  Object.entries(PATH_DATA).forEach(x => {
    let [floorNumber, floor] = x
    floorNumber = parseInt(floorNumber)

    floor.waypoints.forEach(point => {
      GRAPH[point.id] = []
      GRAPH_POINTS[point.id] = { ...point, "floor": floorNumber }

      if (point.type === "room") {
        if (point.room in GRAPH_ROOMS) {
          GRAPH_ROOMS[point.room].push(point.id)
        } else {
          GRAPH_ROOMS[point.room] = [point.id]
        }
      }
    })

    floor.paths.forEach(path => {
      GRAPH[path[0]].push(path[1])
      GRAPH[path[1]].push(path[0])
    })
  })

  Object.values(PATH_DATA).forEach(floor => {
    floor.waypoints.forEach(point => {
      if (point.type === "teleport") {
        GRAPH[point.id].push(point.to)
        GRAPH[point.to].push(point.id)
      }
    })
  })
}

const startDjikstra = (from, to) => {
  let distances = {}
  let previous = {}
  let visited = []
  let queue = new PriorityQueue({ comparator: function(a, b) { return distances[a] - distances[b] }})

  if (!Array.isArray(to)) {
    to = [to]
  }

  Object.keys(GRAPH).forEach(k => {
    distances[k] = -1
    previous[k] = null
  })

  distances[from] = 0
  queue.queue(from)
  let foundFinish = null

  while (queue.length) {
    let node = queue.dequeue()
    if (visited.indexOf(node) !== -1) {
      continue
    }
    visited.push(node)

    if (to.indexOf(node) !== -1) {
      foundFinish = node
      break
    }

    GRAPH[node].forEach(neighbor => {
      const distanceToNeigh = Math.sqrt(Math.pow(GRAPH_POINTS[node].x - GRAPH_POINTS[neighbor].x, 2) + Math.pow(GRAPH_POINTS[node].y - GRAPH_POINTS[neighbor].y, 2))
      const newDist = distances[node] + distanceToNeigh
      if (distances[neighbor] === -1 || newDist < distances[neighbor]) {
        distances[neighbor] = newDist
        previous[neighbor] = node
        queue.queue(neighbor)
      }
    })
  }

  if (visited.indexOf(foundFinish) === -1) {
    return {"path": [], "distance": -1}
  } else {
    let node = foundFinish
    let path = []
    while (node !== from) {
      path.push(node)
      node = previous[node]
    }
    path.push(from)
    return {"path": path.reverse(), "distance": distances[foundFinish]}
  }
}

const findPathBetween = (roomFrom, roomTo) => {
  let best = null

  GRAPH_ROOMS[roomFrom].forEach(point => {
    const path = startDjikstra(point, GRAPH_ROOMS[roomTo])
    if (best === null || best.distance > path.distance) {
      best = path
    }
  })

  return best || {"distance": null, "path": []}
}

const displayPathBetween = (roomFrom, roomTo, keepFloor) => {
  keepFloor = keepFloor || false
  const path = findPathBetween(roomFrom, roomTo)
  if (!path.path) {
    return false
  }

  CURRENT_PATH = path.path
  CURRENT_PATH_POINTS = [roomFrom, roomTo]
  if (!keepFloor) {
    showOnMap(roomFrom)
    window.location.hash = "route/" + roomFrom + ":" + roomTo
  } else {
		drawCurrentPath(FLOOR_NUMBER)
    window.location.hash = "route/" + roomFrom + ":" + roomTo + "/" + FLOOR_NUMBER
  }
}
