const renderFloor = (number) => {
	if (window.location.search.indexOf("debug") !== -1) {
		drawDebugPaths(number)
	}
	if (CURRENT_PATH !== null) {
		drawCurrentPath(number)
	}

	mapInstance.renderFloor(number)
}
