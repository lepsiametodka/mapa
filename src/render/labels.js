
export default class LabelRender {
  constructor(g) {
    this.g = g
  }

  renderLabels(floorData) {
    let labelsToRender = []

    floorData.rooms.forEach(r => {
      if (r.id in PLACES) {
        labelsToRender.push({
          'primary': PLACES[r.id].primary_name,
          'number': PLACES[r.id].number,
          'points': r.points
        })
      }
    })

    this.g.selectAll('.label').remove()
    this.g.selectAll('.label_num').remove()

    this.g.selectAll('.label')
      .data(labelsToRender)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("dx", d => (d.points[2] + d.points[0]) / 2)
      .attr("dy", d => (d.points[3] + d.points[1]) / 2 + 1)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text(d => d.primary)
      .style("font-family", "Roboto")
      .style("font-size", d => {
        const width = Math.max(d.points[3] - d.points[1], d.points[2] - d.points[0])
        const pxPerChar = Math.min(width / d.primary.length, 7)
        return (pxPerChar / 6 * 10) + "px"
      })
      .style("transform", d => {
        let w	= d.points[2] - d.points[0]
        let h = d.points[3] - d.points[1]

        if (w <= h) {
          let cX = (d.points[2] + d.points[0]) / 2
          let cY = (d.points[3] + d.points[1]) / 2
          return "translate(" + cX + "px, " + cY + "px) rotate(-90deg) translate(" + cX * -1 + "px, " + cY * -1 + "px)"
        } else {
          return ""
        }
      })

    this.g.selectAll('.label_num')
      .data(labelsToRender)
      .enter()
      .append("text")
      .attr("class", "label_num")
      .attr("dx", d => d.points[0] + 2)
      .attr("dy", d => d.points[1] + 7)
      .text(d => d.number)
      .style("font-family", "Roboto")
      .style("font-weight", "300")
      .style("font-size", "6px")
      .style("opacity", ".8")
  }
}
