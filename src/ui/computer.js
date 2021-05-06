import Mustache from 'mustache'
import {showOnMap} from '../utils'
import {map, router, uiInstance} from '../app'
import {resetZoom} from '../zoomUtils'
import {navigationManager} from '../app'

export default class SidebarUI {
  constructor() {
    this.state = null
    this.data = null
    this.sidebarDetail = document.getElementById('sidebar-md-detail')
    this.sidebarNormal = document.getElementById('sidebar-md-normal')

    document.getElementById('js-sidebar-detail-close')
      .addEventListener('click', evt => this.closeSidebar())

    document.getElementById('js-sidebar-tab-nav')
      .addEventListener('click', evt => this.showNavigation())

    document.getElementById('js-sidebar-tab-search')
      .addEventListener('click', evt => this.showSearch())
  }

  // Closes sidebar and cleans map selection.
  closeSidebar() {
    if (this.state === "room") {
      g.select("#" + this.data.replaceAll(".", "_"))
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .attr("transform", "")
    }

    this.showNormal()
    if (router.mode !== "route") {
      router.setFloorURL(map.currentFloor)
    }
    this.state = null
    this.data = null
  }

  showNormal() {
    this.sidebarDetail.style.display = 'none'
    this.sidebarNormal.style.display = ''
  }

  showDetail() {
    this.sidebarDetail.style.display = ''
    this.sidebarNormal.style.display = 'none'
  }

  setSidebarTitle(title) {
    document.getElementById("sidebar-detail-title").innerText = title
  }

  setSidebarBody(html) {
    document.getElementById("sidebar-detail-body").innerHTML = html
  }

  showRoomDetail(roomId, context) {
    this.showDetail()
    this.state = "room"
    this.data = roomId
    this.setSidebarTitle("Detail miestnosti")

    const template = document.getElementById("templ-sidebar-room").innerHTML
    this.setSidebarBody(Mustache.render(template, context))

    document.querySelectorAll(".js-detail-show-on-map").forEach(el => {
      el.addEventListener('click', () => {
        showOnMap(roomId)
        resetZoom()
      })
    })

    document.querySelectorAll(".js-detail-navigate").forEach(el => {
      el.addEventListener('click', () => {
        if (navigationManager.currentPathPoints.indexOf(roomId) === -1) {
          navigationManager.currentPathPoints.push(roomId)
          navigationManager.reset()
        }
        uiInstance.showNavigation()
      })
    })
  }

  showNavigation() {
    document.getElementById("sidebar-panel-search").style.display = "none"
    document.getElementById("sidebar-panel-navigation").style.display = ""
    document.getElementById("js-sidebar-tab-search").classList.remove("text-white", "bg-red-600")
    document.getElementById("js-sidebar-tab-nav").classList.add("text-white", "bg-red-600")
    uiInstance.navigation.renderCurrentRoute("sidebar-panel-navigation")
    this.closeSidebar()
  }

  showSearch() {
    document.getElementById("sidebar-panel-search").style.display = ""
    document.getElementById("sidebar-panel-navigation").style.display = "none"
    document.getElementById("js-sidebar-tab-search").classList.add("text-white", "bg-red-600")
    document.getElementById("js-sidebar-tab-nav").classList.remove("text-white", "bg-red-600")
  }
}
