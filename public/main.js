const width = window.innerWidth
const height = window.innerHeight

let DATA = {}
let PLACES = {}
let FLOOR_NUMBER = parseInt(window.location.hash.substr(1)) || 0

const svg = d3.select("#map").append("svg:svg")
	.attr("width", width)
	.attr("height", height)
	.attr("style", "background: hsl(0deg, 0%, 85%)")

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

d3.json("data/places.json")
	.then((places) => {
		PLACES = places

		d3.json("data/geometry2.json")
			.then((data) => {
				DATA = data
				drawFloorPlan(data.floorplan)

				const size = Math.min(data.dimensions.width / (width), data.dimensions.height / (height))
				const t = d3.zoomIdentity.translate((width - data.dimensions.width * size) / 2, (height - data.dimensions.height * size) / 2).scale(size)
				svg.call(zoom.transform, t)

				// drawFloor(data.floors['0'])
				renderFloor(FLOOR_NUMBER)
			})
	})


const updateLocation = () => {
	window.location.hash = FLOOR_NUMBER
}


document.getElementById("floor-up").addEventListener("click", () => {
	if (FLOOR_NUMBER === 3) {
		return
	}

	FLOOR_NUMBER += 1
	renderFloor(FLOOR_NUMBER)
	updateLocation()
})

document.getElementById("floor-down").addEventListener("click", () => {
	if (FLOOR_NUMBER === -1) {
		return
	}

	FLOOR_NUMBER -= 1
	renderFloor(FLOOR_NUMBER)
	updateLocation()
})