import NavigationRender from './render'
import PathFinder from './path-finder'
import DebugRenderer from './debug'

export default class NavigationManager {
  constructor() {
    this.currentPath = null
    this.currentPathPoints = null
    this.renderer = new NavigationRender(this)
    this.debug = new DebugRenderer(this)
    this.pathFinder = new PathFinder()
  }

  renderPathBetween(roomFrom, roomTo, keepFloor) {
    keepFloor = keepFloor || false
    const path = this.pathFinder.findPathBetween(roomFrom, roomTo)
    if (!path.path) {
      return false
    }

    this.currentPath = path.path
    this.currentPathPoints = [roomFrom, roomTo]

    this.renderer.renderPath(path.path, map.currentFloor)
    // TODO: Replace with router
    // window.location.hash = "route/" + roomFrom + ":" + roomTo + "/" + FLOOR_NUMBER
  }

  floorChanged(newFloor) {
    if (window.location.search.indexOf("debug") !== -1) {
      this.debug.renderDebug(newFloor)
    }

    if (this.currentPath !== null) {
      this.renderer.renderPath(this.currentPath, newFloor)
    }
  }
}
