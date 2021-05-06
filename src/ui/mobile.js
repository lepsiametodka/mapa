import Mustache from 'mustache'
import {showOnMap} from '../utils'
import {map, router, uiInstance} from '../app'
import {resetZoom} from '../zoomUtils'

export default class MobileUI {
  constructor() {
    document.getElementById("js-bottom-room").addEventListener('click', evt => this.expandDetails())
    document.getElementById("js-mobile-nav").addEventListener('click', evt => this.showNavigation())

    document.getElementById('fullscreen-dialog-close').addEventListener('click', () => {
      document.getElementById('fullscreen-dialog').style.display = 'none'
    })
  }

  showBottom() {
    document.getElementById("js-bottom-room").style.display = ""
  }

  hideBottom() {
    document.getElementById("js-bottom-room").style.display = "none"
    if (router.mode !== "route") {
      router.setFloorURL(map.currentFloor)
    }
    // TODO: Clean map selection
  }

  showRoom(roomId, context) {
    this.room = roomId
    this.context = context
    const template = document.getElementById("templ-bottom-room").innerHTML
    document.getElementById("js-bottom-room").innerHTML = Mustache.render(template, context)
    document.getElementById("js-bottom-close").addEventListener('click', evt => {
      this.hideBottom()
      evt.stopPropagation()
    })
    this.showBottom()
  }

  expandDetails() {
    const template = document.getElementById("templ-sidebar-room").innerHTML
    document.getElementById('fullscreen-dialog-body').innerHTML = Mustache.render(template, this.context)
    document.getElementById('fullscreen-dialog').style.display = ''

    // Show on map button
    document.querySelectorAll(".js-detail-show-on-map").forEach(el => {
      el.addEventListener('click', () => {
        document.getElementById('fullscreen-dialog').style.display = 'none'
        showOnMap(this.room)
        resetZoom()
      })
    })

    // Navigate button
    document.querySelectorAll(".js-detail-navigate").forEach(el => {
      el.addEventListener('click', () => {
        if (navigationManager.currentPathPoints.indexOf(this.room) === -1) {
          navigationManager.currentPathPoints.push(this.room)
          navigationManager.reset()
        }
        this.showNavigation()
      })
    })
  }

  showNavigation() {
    document.getElementById('fullscreen-dialog').style.display = ''
    uiInstance.navigation.renderCurrentRoute('fullscreen-dialog-body')
    this.hideBottom()
  }
}
