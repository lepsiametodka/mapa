import NavigationRender from './render'
import PathFinder from './path-finder'
import DebugRenderer from './debug'
import {router} from '../app'

export default class NavigationManager {
  constructor() {
    this.currentPath = []
    this.currentPathPoints = []
    this.renderer = new NavigationRender(this)
    this.debug = new DebugRenderer(this)
    this.pathFinder = new PathFinder()
  }

  // TODO: Remove
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

  renderPath(avoidTv) {
    const path = this.pathFinder.findPathBetween(this.currentPathPoints[0], this.currentPathPoints[1], avoidTv)
    if (path.path.length === 0) {
      return false
    }

    this.currentPath = path.path

    let remainingPoints = this.currentPathPoints.slice(2)
    while (remainingPoints.length !== 0) {
      const point = remainingPoints.shift()
      const path2 = this.pathFinder.runFinder(this.currentPath[this.currentPath.length - 1], this.pathFinder.rooms[point], avoidTv)

      if (path2.path.length === 0) {
        return false
      }

      for (let i = 1; i < path2.path.length; i++) {
        this.currentPath.push(path2.path[i])
      }
    }

    this.renderer.renderPath(path.path, map.currentFloor)
    router.setRouteUrl(this.currentPathPoints, map.currentFloor)
    return true
  }

  floorChanged(newFloor) {
    if (window.location.search.indexOf("debug") !== -1) {
      this.debug.renderDebug(newFloor)
    }

    if (this.currentPath !== null) {
      this.renderer.renderPath(this.currentPath, newFloor)
    }
  }

  reset() {
    map.g.selectAll(".path").remove()
  }
}
