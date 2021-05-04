let DATA = {}
let PLACES = {}
let FLOOR_NUMBER = parseInt(window.location.hash.substr(1)) || 0
const IS_MOBILE = window.matchMedia("only screen and (max-width: 768px)").matches

const svg = d3.select("#map")
	.attr("style", "background: hsl(0deg, 0%, 85%)")

svg.append("svg:defs").append("svg:marker")
    .attr("id", "arrow")
    .attr('refX', 2)
    .attr('refY', 3)
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

let searchInstance
const uiInstance = new UniversalUI()
const mapRender = new MapRender(g)

d3.json("data/places.json")
	.then((places) => {
		PLACES = places
		searchInstance = new SearchUI()

		d3.json("data/geometry.json")
			.then((data) => {
				DATA = data
				mapRender.dataLoaded(data)

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
			uiInstance.showRoom(parts[1])
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
