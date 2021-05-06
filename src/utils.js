import {map, PLACES} from './app'

export function showOnMap(roomId) {
  const place = PLACES[roomId]
  const newNumber = parseInt(place.floor)
  map.renderFloor(newNumber)

  const ID = roomId.replaceAll(".", "_")
  g.select("#" + ID)
    .transition()
    .duration(100)
    .delay(250)
    .style("stroke", "red")
    .attr("transform", "scale(2)")

  g.select("#" + ID)
    .transition().delay(500).duration(100)
    .attr("transform", "")
    .style("stroke-width", "2px")

  g.selectAll(".rooms").sort((a, b) => (a.id === roomId ? 1 : -1))
}
