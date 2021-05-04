import UniversalUI from "./ui/universal"
import {zoomOnRoom, resetZoom} from './zoomUtils'
import MapRender from './render/map'
import SearchUI from './ui/search'
import Router from './router'


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

const zoom = d3.zoom()
  	.scaleExtent([0.25, 8])
  	.on("zoom", (x) => g.attr('transform', x.transform))

svg.call(zoom)

export const mapInstance = new MapRender(g)
export const uiInstance = new UniversalUI()
export const router = new Router()

window.resetZoom = resetZoom
window.UniversalUI = UniversalUI
window.SearchUI = SearchUI
window.mapInstance = mapInstance
window.g = g
window.zoom = zoom
window.svg = svg
window.router = router
