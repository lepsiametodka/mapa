export default class ShapesRender {
  constructor(g) {
    this.g = g
  }

  render(floorData) {
    this.renderPolys(floorData.polygons)
    this.renderLines(floorData.lines)
  }

  renderPolys(polys) {
    this.g.selectAll(".polys").remove()
    this.g.selectAll(".polys")
      .data(polys)
      .enter()
      .append("polygon")
      .attr("class", "polys")
      .attr("points", d => d.map(x => x[0]+","+x[1]).join(" "))
      .style("fill", "white")
      .style("stroke", "black")
      .style("stroke-width", "1px")
  }

  renderLines(lines) {
    this.g.selectAll(".lines").remove()
    this.g.selectAll(".lines")
      .data(lines)
      .enter()
      .append("line")
      .attr("class", "lines")
      .attr("x1", d => d[0])
      .attr("y1", d => d[1])
      .attr("x2", d => d[2])
      .attr("y2", d => d[3])
      .style("stroke", "black")
      .style("stroke-width", "1px")
  }
}
