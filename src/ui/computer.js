var Mustache = require('mustache');

export default class SidebarUI {
  constructor() {
    this.state = null
    this.data = null
    this.sidebarDetail = document.getElementById('sidebar-md-detail')
    this.sidebarNormal = document.getElementById('sidebar-md-normal')

    document.getElementById('js-sidebar-detail-close')
      .addEventListener('click', evt => this.closeSidebar())
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
      })
    })
  }
}
