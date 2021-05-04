let DATA = {}
let PLACES = {}
let FLOOR_NUMBER = 0

let searchInstance

d3.json("data/places.json")
	.then((places) => {
		PLACES = places
		searchInstance = new SearchUI()

		d3.json("data/geometry.json")
			.then((data) => {
				DATA = data
				mapInstance.dataLoaded(data)

				resetZoom()
				router.loadStateFromURL()
			})
	})
