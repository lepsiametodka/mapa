const renderFloor = (number) => {
	const floor = DATA.floors["" + number]

	if (window.location.search.indexOf("debug") !== -1) {
		drawDebugPaths(number)
	}
	if (CURRENT_PATH !== null) {
		drawCurrentPath(number)
	}

	mapRender.renderFloor(number)
}
