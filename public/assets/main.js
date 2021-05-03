const width = window.innerWidth
const height = window.innerHeight

let DATA = {}
let PLACES = {}
let FLOOR_NUMBER = parseInt(window.location.hash.substr(1)) || 0

const svg = d3.select("#map").append("svg:svg")
	.attr("width", width)
	.attr("height", height)
	.attr("style", "background: hsl(0deg, 0%, 85%)")

svg.append("svg:defs").append("svg:marker")
    .attr("id", "arrow")
    .attr('refX', 2)//so that it comes towards the center.
    .attr('refY', 3)//so that it comes towards the center.
    .attr("markerWidth", 4)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
	.append("svg:path")
    .attr("d", "M0,0 V6 L4,3 Z")
		.attr("fill", "red")

const g = svg.append("g")

function zoomed({transform}) {
	g.attr("transform", transform)
}

const zoom = d3.zoom()
  	.scaleExtent([0.25, 8])
  	.on("zoom", zoomed)

svg.call(zoom)


const drawFloorPlan = (data) => {
	g.selectAll(".floorplan")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", d => d[0][0])
		.attr("y", d => d[0][1])
		.attr("width", d => d[1][0])
		.attr("height", d => d[1][1])
		.style("stroke", "hsl(0deg, 0%, 75%)")
		.style("fill", "hsl(0deg, 0%, 95%)")
		.style("stroke-width", "2px")

	g.selectAll('.streets')
		.data(DATA.streets)
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

const fillForType = type => {
	if (type === "class") {
		return "#d5b8ff"
	}
	if (type === "office") {
		return "hsl(112, 50%, 66%)"
	}
	if (type === "unknown") {
		return "#aaa"
	}
	if (type === "services") {
		return "#ffff7e"
	}
	if (type === "wcm") {
		return "hsl(191, 61%, 69%)"
	}
	if (type === "wcw") {
		return "#ec644b"
	}
	if (type === "gym") {
		return "#a2ded0"
	}
	return "white"
}

const resetZoom = () => {
	let size
	if (width < height) {
		size = (width - 100) / DATA.dimensions.width
	} else {
		size = (height - 200) / (DATA.dimensions.height + 160)
	}

	const t = d3.zoomIdentity.translate((width - DATA.dimensions.width * size) / 2, (height - DATA.dimensions.height * size) / 2).scale(size)
	svg.call(zoom.transform, t)
}

d3.json("data/places.json")
	.then((places) => {
		PLACES = places
		setupFuse()

		d3.json("data/geometry.json")
			.then((data) => {
				DATA = data
				drawFloorPlan(data.floorplan)
				resetZoom()
				initialRender()
			})
	})

const initialRender = () => {
	if (window.location.hash.indexOf("/") === -1) {
		renderFloor(0)
		return
	}

	const parts = window.location.hash.substr(1).split("/")
	switch (parts[0]) {
		case "map":
			FLOOR_NUMBER = parseInt(parts[1])
			renderFloor(FLOOR_NUMBER)
			break
		case "room":
			showOnMap(parts[1])
			break
		case "route":
			if (parts.length === 3) {
				FLOOR_NUMBER = parseInt(parts[2])
				renderFloor(FLOOR_NUMBER)
			}
			let pathPoints = parts[1].split(":")
			displayPathBetween(pathPoints[0], pathPoints[1], parts.length === 3)
			break
		default:
			renderFloor(0)
	}
}

const setPathAfterFloorChange = () => {
	if (CURRENT_PATH_POINTS.length !== 0) {
		window.location.hash = "route/" + CURRENT_PATH_POINTS.join(":") + "/" + FLOOR_NUMBER
	} else {
		window.location.hash = "map/" + FLOOR_NUMBER
	}
}


document.getElementById("floor-up").addEventListener("click", () => {
	if (FLOOR_NUMBER === 3) {
		return
	}

	FLOOR_NUMBER += 1
	renderFloor(FLOOR_NUMBER)
	setPathAfterFloorChange()
})

document.getElementById("floor-down").addEventListener("click", () => {
	if (FLOOR_NUMBER === -1) {
		return
	}

	FLOOR_NUMBER -= 1
	renderFloor(FLOOR_NUMBER)
	setPathAfterFloorChange()
})
