const POINTS = {
  "down": [[0, 0], [-7, -14], [0, -14], [0, -30], [0, -14], [7, -14]],
  "up": [[0, 0], [7, 14], [0, 14], [0, 30], [0, 14], [-7, 14]],
  "right": [[0, 0], [14, 7], [14, 0], [30, 0], [14, 0], [14, -7]],
  "left": [[0, 0], [-14, -7], [-14, 0], [-30, 0], [-14, 0], [-14, 7]]
}

export default class EntrancesRender {
  constructor(g) {
    this.g = g
  }

  render(floorData) {
    this.g.selectAll(".entrances").remove()
    this.g.selectAll(".entrances")
      .data(floorData.entrances || [])
      .enter()
      .append("polygon")
      .attr("class", "entrances")
      .attr("points", d => POINTS[d.direction].map(p => (p[0] + d.x) + "," + (p[1] + d.y)).join(" "))
      .style("stroke", "hsl(0deg, 0%, 60%)")
      .style("fill", "transparent")
      .style("stroke-width", "2px")
  }
}
