export function zoomOnRoom(roomId) {
	const mapBBox = document.getElementById("map").getBoundingClientRect()
  const elementOnMap = g.select("#" + roomId.replaceAll(".", "_"))

  const roomWidth = parseInt(elementOnMap.attr("width"))
  const roomHeight = parseInt(elementOnMap.attr("height"))
	const roomX = parseInt(elementOnMap.attr("x"))
  const roomY = parseInt(elementOnMap.attr("y"))

	const roomCenterX = roomX + roomWidth / 2
	const roomCenterY = roomY + roomHeight / 2

  // Budeme zoomovat tak, aby sa miestnost zmestila cela na obrazovku.
  let scale
  if (roomWidth < roomHeight) {
    scale = (mapBBox.width) / roomWidth
  } else {
  	scale = (mapBBox.height) / roomHeight
	}
  scale *= 0.5

  const t = d3.zoomIdentity.scale(scale).translate(-roomCenterX + mapBBox.width / scale / 2, -roomCenterY + mapBBox.height / scale / 2)
	svg.call(zoom.transform, t)
}

export function resetZoom() {
	let size
	const mapBBox = document.getElementById("map").getBoundingClientRect()
	if (mapBBox.width < mapBBox.height) {
		size = (mapBBox.width - 100) / DATA.dimensions.width
	} else {
		size = (mapBBox.height - 200) / (DATA.dimensions.height + 160)
	}

	const t = d3.zoomIdentity.translate((mapBBox.width - DATA.dimensions.width * size) / 2, (mapBBox.height - DATA.dimensions.height * size) / 2).scale(size)
	svg.call(zoom.transform, t)
}
