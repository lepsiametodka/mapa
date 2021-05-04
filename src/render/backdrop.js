
export default class BackdropRender {
  constructor(g) {
    this.g = g
  }

  render(data) {
    this.g.selectAll(".floorplan")
		.data(data.floorplan)
		.enter()
		.append("rect")
		.attr("x", d => d[0][0])
		.attr("y", d => d[0][1])
		.attr("width", d => d[1][0])
		.attr("height", d => d[1][1])
		.style("stroke", "hsl(0deg, 0%, 75%)")
		.style("fill", "hsl(0deg, 0%, 95%)")
		.style("stroke-width", "2px")

	this.g.selectAll('.streets')
		.data(data.streets)
		.enter()
		.append("text")
		.attr("class", "streets")
		.attr("dx", d => d.x)
		.attr("dy", d => d.y)
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "middle")
		.text(d => d.name)
		.style("font-family", "Roboto")
		.style("fill", "hsl(0, 0%, 70%)")
		.style("font-size", "48px")
  }
}
