import {map} from '../app'

export default class DebugRenderer {
  constructor(manager) {
    this.manager = manager
  }

  renderDebug(floor) {
    const data = this.manager.pathFinder.data[floor + ""]
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

    map.g.selectAll(".path-waypoint-label")
      .data(data.waypoints)
      .enter()
      .append("text")
      .attr("class", "path-waypoint-label")
      .attr("dx", d => d.x - 2.5)
      .attr("dy", d => d.y - 5)
      .text(d => d.id)
      .style("font-size", "3px")
      .style("fill", "blue")

    map.g.selectAll(".path-debug")
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
}
