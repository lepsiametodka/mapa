export default class StairsRender {
  constructor(g) {
    this.g = g
  }

  render(floorData) {
    const stairsPos = floorData.stairs.map(s => {
      let pos = []
      const w = s.points[2] - s.points[0]
      const h = s.points[3] - s.points[1]


      for (var x = 0; x < s.divisions[0]; x++) {
        for (var y = 0; y < s.divisions[1]; y++) {
          pos.push([s.points[0] + x * w / s.divisions[0], s.points[1] + y * h / s.divisions[1], w / s.divisions[0], h / s.divisions[1]])
        }
      }

      return pos
    })

    this.g.selectAll(".stairs").remove()
    this.g.selectAll(".stairs")
      .data(stairsPos.flat())
      .enter()
      .append("rect")
      .attr("class", "stairs")
      .attr("x", d => d[0])
      .attr("y", d => d[1])
      .attr("width", d => d[2])
      .attr("height", d => d[3])
      .style("fill", "transparent")
      .style("stroke", "black")
      .style("stroke-width", "1px")
  }
}
