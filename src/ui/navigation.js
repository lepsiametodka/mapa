import Mustache from "mustache"
import {navigationManager, PLACES} from '../app'
import {constants} from '../constants'
import {showOnMap} from '../utils'
import {zoomOnRoom} from '../zoomUtils'
import Sortable from 'sortablejs'
import arrayMove from 'array-move'

export default class NavigationUI {
  constructor() {
    this.avoidTv = false
  }

  renderCurrentRoute(target) {
    let waypoints = []

    for (const point of navigationManager.currentPathPoints) {
      const room = PLACES[point]
      waypoints.push({
        "id": point,
        "name": room.primary_name,
        "side": constants.sideNames[room.side],
        "floor": constants.floorNames[room.floor],
      })
    }

    const template = document.getElementById("templ-navigation").innerHTML
    document.getElementById(target).innerHTML = Mustache.render(template, {
      "waypoints": waypoints,
      "avoidTv": this.avoidTv
    })

    document.getElementById('tv-check').addEventListener('change', e => {
      this.avoidTv = e.target.checked
    })

    document.querySelectorAll(".js-nav-remove").forEach(el => {
      el.addEventListener('click', (e) => {
        navigationManager.currentPathPoints = navigationManager.currentPathPoints.filter(x => x !== e.target.dataset.id)
        navigationManager.reset()
        this.renderCurrentRoute(target)
      })
    })

    document.querySelectorAll(".js-nav-run").forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault()
        if (navigationManager.currentPathPoints.length <= 1) {
          return
        }

        const success = navigationManager.renderPath(this.avoidTv)
        if (success) {
          showOnMap(navigationManager.currentPathPoints[0])
          zoomOnRoom(navigationManager.currentPathPoints[0])
          document.getElementById('fullscreen-dialog').style.display = 'none'
        } else {
          alert("Nepodarilo sa nám nájsť žiadnu trasu.")
        }
      })
    })

    Sortable.create(document.getElementById("js-waypoints"), {
      onUpdate: (evt) => {
        console.log(evt)
        let points = navigationManager.currentPathPoints
        points = arrayMove(points, evt.oldIndex, evt.newIndex)
        navigationManager.currentPathPoints = points
        navigationManager.reset()
      }
    })
  }
}
