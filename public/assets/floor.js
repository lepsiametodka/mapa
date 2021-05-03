const renderFloor = (number) => {
	const floor = DATA.floors["" + number]

	renderPolygons(floor.polygons)
	renderLines(floor.lines)
	renderStairs(floor.stairs)

	renderRooms(floor.rooms)
	renderLabelsForRooms(floor.rooms)
	renderEntrances(floor.entrances || [])

	document.getElementById("floor-number").innerText = number
}

const renderStairs = (stairs) => {
	const stairsPos = stairs.map(s => {
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


	g.selectAll(".stairs").remove()

	g.selectAll(".stairs")
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

const renderPolygons = (polys) => {
	g.selectAll(".polys").remove()
	g.selectAll(".polys")
		.data(polys)
		.enter()
		.append("polygon")
		.attr("class", "polys")
		.attr("points", d => d.map(x => x[0]+","+x[1]).join(" "))
		.style("fill", "white")
		.style("stroke", "black")
		.style("stroke-width", "1px")
}

const renderLines = (lines) => {
	g.selectAll(".lines").remove()
	g.selectAll(".lines")
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

const renderRooms = rooms => {
	g.selectAll(".rooms").remove()
	g.selectAll(".door").remove()
	g.selectAll(".rooms")
		.data(rooms)
		.enter()
		.append("rect")
		.attr("class", "rooms")
		.attr("x", d => d.points[0])
		.attr("y", d => d.points[1])
		.attr("width", d => d.points[2] - d.points[0])
		.attr("height", d => d.points[3] - d.points[1])
		.attr("id", d => (d.hasOwnProperty("id") ? d.id.replace(".", "_") : ""))
		.style("fill", d => fillForType(d.type))
		.style("stroke", "black")
		.attr("transform-origin", d => ((d.points[2] + d.points[0]) / 2) + "px " + ((d.points[3] + d.points[1]) / 2) + "px")
		.style("stroke-width", "1px")

	g.selectAll(".door")
		.data(rooms.map(x => x.doors || []).flat())
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

const renderEntrances = entrances => {
	const POINTS = {
		"down": [[0, 0], [-7, -14], [0, -14], [0, -30], [0, -14], [7, -14]],
		"up": [[0, 0], [7, 14], [0, 14], [0, 30], [0, 14], [-7, 14]],
		"right": [[0, 0], [14, 7], [14, 0], [30, 0], [14, 0], [14, -7]],
		"left": [[0, 0], [-14, -7], [-14, 0], [-30, 0], [-14, 0], [-14, 7]]
	}

	g.selectAll(".entrances").remove()
	g.selectAll(".entrances")
		.data(entrances)
		.enter()
		.append("polygon")
		.attr("class", "entrances")
		.attr("points", d => POINTS[d.direction].map(p => (p[0] + d.x) + "," + (p[1] + d.y)).join(" "))
		.style("stroke", "hsl(0deg, 0%, 60%)")
		.style("fill", "transparent")
		.style("stroke-width", "2px")
}
