

const renderLabelsForRooms = rooms => {
	let labelsToRender = []

	rooms.forEach(r => {
		if (r.id in PLACES) {
			labelsToRender.push({
				'primary': PLACES[r.id].primary_name,
				'number': PLACES[r.id].number,
				'points': r.points
			})
		}
	})

	console.log(labelsToRender)

	g.selectAll('.label').remove()
	g.selectAll('.label_num').remove()

	g.selectAll('.label')
		.data(labelsToRender)
		.enter()
		.append("text")
		.attr("class", "label")
		.attr("dx", d => (d.points[2] + d.points[0]) / 2)
		.attr("dy", d => (d.points[3] + d.points[1]) / 2 + 1)
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "middle")
		.text(d => d.primary)
		.style("width", "10px")
		.style("font-family", "Roboto")
		.style("font-size", d => {
			const width = Math.max(d.points[3] - d.points[1], d.points[2] - d.points[0])
			const pxPerChar = Math.min(width / d.primary.length, 7)
			return (pxPerChar / 6 * 10) + "px"
		})
		.attr("transform", d => (d.points[3] - d.points[1] > d.points[2] - d.points[0] ? "rotate(-90)" : ""))
		.attr("transform-origin", d => ((d.points[2] + d.points[0]) / 2) + " " + ((d.points[3] + d.points[1]) / 2 + 1))

	g.selectAll('.label_num')
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
