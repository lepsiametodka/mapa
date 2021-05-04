const COLORMAP = {
	"class": "#d5b8ff",
	"office": "hsl(112, 50%, 66%)",
	"unknown": "#aaa",
	"services": "#ffff7e",
	"wcm": "hsl(191, 61%, 69%)",
	"wcw": "#ec644b",
	"gym": "#a2ded0",
	"default": "white"
}

export default class RoomRender {
  constructor(g) {
    this.g = g
  }

  render(floorData) {
    this.g.selectAll(".rooms").remove()
    this.g.selectAll(".door").remove()

    this.g.selectAll(".rooms")
      .data(floorData.rooms)
      .enter()
      .append("rect")
      .attr("class", "rooms")
      .attr("x", d => d.points[0])
      .attr("y", d => d.points[1])
      .attr("width", d => d.points[2] - d.points[0])
      .attr("height", d => d.points[3] - d.points[1])
      .attr("id", d => (d.hasOwnProperty("id") ? d.id.replace(".", "_") : ""))
      .style("fill", d => d.type in COLORMAP ? COLORMAP[d.type] : COLORMAP.default)
      .style("stroke", "black")
      .attr("transform-origin", d => ((d.points[2] + d.points[0]) / 2) + "px " + ((d.points[3] + d.points[1]) / 2) + "px")
      .style("stroke-width", "1px")

    this.g.selectAll(".door")
      .data(floorData.rooms.map(x => x.doors || []).flat())
      .enter()
      .append("line")
      .attr("class", "door")
      .attr("x1", d => d[0])
      .attr("y1", d => d[1])
      .attr("x2", d => d[2])
      .attr("y2", d => d[3])
      .style("stroke", "red")
      .style("stroke-width", "1px")
  }
}
