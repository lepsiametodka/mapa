import {map} from '../app'

export default class NavigationRender {
  constructor(manager) {
    this.manager = manager
  }

  renderPath(path, floor) {
    let lines = []

    for (let i = 0; i < path.length - 1; i++) {
      const point = this.manager.pathFinder.points[path[i]]
      const nextPoint = this.manager.pathFinder.points[path[i + 1]]

      if (point.floor !== floor || nextPoint.floor !== floor) {
        continue
      }

      lines.push([
        point.x, point.y,
        nextPoint.x, nextPoint.y
      ])
    }

    map.g.selectAll(".path").remove()
    map.g.selectAll(".path")
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
}
