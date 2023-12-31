import PriorityQueue from 'priorityqueuejs'

const TELOCVICNE = ['m.tv5', 'm.tv6', 'j.tv4', 'j.tv3']

export default class PathFinder {
  constructor() {
    this.data = null
    this.graph = {}   // zoznam susedov
    this.points = {}  // id -> point
    this.rooms = {}   // room -> [points]
  }

  prepare() {
    if (this.data !== null) {
      return
    }

    return new Promise((resolve) => {
      d3.json("data/paths.json")
        .then(res => {
          this.data = res
          this.loadGraph()
          resolve()
        })
        .catch(err => {
          alert("Chyba počas načítavania navigačných dát...")
          console.error(err)
        })
    })
  }

  loadGraph() {
    Object.entries(this.data).forEach(x => {
      let [floorNumber, floor] = x
      floorNumber = parseInt(floorNumber)

      floor.waypoints.forEach(point => {
        this.graph[point.id] = []
        this.points[point.id] = { ...point, "floor": floorNumber }

        if (point.type === "room") {
          if (point.room in this.rooms) {
            this.rooms[point.room].push(point.id)
          } else {
            this.rooms[point.room] = [point.id]
          }
        }
      })

      floor.paths.forEach(path => {
        this.graph[path[0]].push(path[1])
        this.graph[path[1]].push(path[0])
      })
    })

    // Teleportation data
    Object.values(this.data).forEach(floor => {
      floor.waypoints.forEach(point => {
        if (point.type === "teleport") {
          this.graph[point.id].push(point.to)
          this.graph[point.to].push(point.id)
        }
      })
    })
  }

  runFinder(from, to, avoidTv) {
    let distances = {}
    let previous = {}
    let visited = []
    let queue = new PriorityQueue(function(a, b) { return distances[b] - distances[a] })

    if (!Array.isArray(to)) {
      to = [to]
    }

    Object.keys(this.graph).forEach(k => {
      distances[k] = -1
      previous[k] = null
    })

    distances[from] = 0
    queue.enq(from)
    let foundFinish = null

    while (queue.size()) {
      let node = queue.deq()
      if (visited.indexOf(node) !== -1) {
        continue
      }
      visited.push(node)

      if (to.indexOf(node) !== -1) {
        foundFinish = node
        break
      }

      if (avoidTv && this.points[node].type === "room" && TELOCVICNE.indexOf(this.points[node].room) !== -1) {
        continue
      }

      this.graph[node].forEach(neighbor => {
        const distanceToNeigh = Math.sqrt(Math.pow(this.points[node].x - this.points[neighbor].x, 2) + Math.pow(this.points[node].y - this.points[neighbor].y, 2))
        const newDist = distances[node] + distanceToNeigh
        if (distances[neighbor] === -1 || newDist < distances[neighbor]) {
          distances[neighbor] = newDist
          previous[neighbor] = node
          queue.enq(neighbor)
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

  findPathBetween(roomFrom, roomTo, avoidTv) {
    let best = null

    this.rooms[roomFrom].forEach(point => {
      const path = this.runFinder(point, this.rooms[roomTo], avoidTv)
      if (best === null || best.distance > path.distance) {
        best = path
      }
    })

    return best || {"distance": null, "path": []}
  }
}
