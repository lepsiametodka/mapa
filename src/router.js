import {map, uiInstance} from './app'
import {showOnMap} from './utils'

export default class Router {
  constructor() {
    this.mode = 'map'
  }

  loadStateFromURL() {
    if (window.location.hash.indexOf("/") === -1) {
      map.renderFloor(0)
      return
    }

    const parts = window.location.hash.substr(1).split("/")
    this.raw_data = parts
    switch (parts[0]) {
      case "map":
        this.mode = 'map'
        map.renderFloor(parseInt(parts[1]))
        break
      case "room":
        this.mode = 'room'
        showOnMap(parts[1])
        uiInstance.showRoom(parts[1])
        break
      case "route":
        this.mode = 'route'
        map.renderFloor(parseInt(parts[2]))

        let pathPoints = parts[1].split(":")
        navigationManager.currentPathPoints = pathPoints
        navigationManager.renderPath(false)
        uiInstance.showNavigation()
        break
      default:
        map.renderFloor(0)
    }
  }

  setRoomInURL(roomId) {
    window.location.hash = 'room/' + roomId
    this.mode = 'room'
  }

  setFloorURL(floorNumber) {
    window.location.hash = 'map/' + floorNumber
    this.mode = 'map'
  }

  setRouteUrl(points, floor) {
    this.mode = 'route'
    window.location.hash = 'route/' + points.join(':') + '/' + floor
  }

  updateFloorNumber(floorNumber) {
    if (this.mode === 'map') {
      this.setFloorURL(floorNumber)
    } else if (this.mode === 'route') {
      window.location.hash = 'route/' + navigationManager.currentPathPoints.join(':') + '/' + floorNumber
    }
  }


}
