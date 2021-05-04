import {PLACES, uiInstance} from '../app'
import {constants} from '../constants'
import {showOnMap} from '../utils'
import {zoomOnRoom} from '../zoomUtils'
import Fuse from 'fuse.js'

export default class SearchUI {
  constructor() {
    document.querySelectorAll(".js-search")
      .forEach(el => el.addEventListener("keyup", evt => this.handleSearch(evt)))
  }

  // TODO: Maybe index data only after first focus of search elements to speed up startup?
  dataLoaded() {
    let FUSED_PLACES = []

    Object.entries(PLACES).forEach(entry => {
      let [key, value] = entry
      value.id = key
      FUSED_PLACES.push(value)
    })

    this.fuse = new Fuse(FUSED_PLACES, {
      "keys": [
        "primary_name", "other_names", "number"
      ]
    })
  }

  hideResults () {
    document.getElementById("results-empty").style.display = ""
    document.querySelectorAll(".js-search-results").forEach(e => {
        e.innerHTML = ""
        e.classList.add("hidden")
      })
  }

  showResults (resultsHtml) {
    document.getElementById("results-empty").style.display = "none"
    document.querySelectorAll(".js-search-results")
      .forEach(e => {
        e.innerHTML = resultsHtml
        e.classList.remove("hidden")
      })

    document.querySelectorAll(".js-search-result")
      .forEach(e => e.addEventListener("click", evt => this.handleResultClick(evt)))
  }

  handleResultClick (event) {
    document.getElementById("sidebar-md-normal").classList.add("hidden")

    showOnMap(event.target.dataset.id)
    zoomOnRoom(event.target.dataset.id)
    window.location.hash = "room/" + event.target.dataset.id
    document.getElementById("results-empty").style.display = ""

    document.querySelectorAll(".js-search").forEach(e => e.value = "")
    this.hideResults()

    uiInstance.showRoom(event.target.dataset.id)
  }

  handleSearch (event) {
    const results = this.fuse.search(event.target.value)
    this.hideResults()

    if (results.length !== 0) {
      let resultsHTML = ""
      for (let result of results.slice(0, 5)){
        result = result.item
        const prettyLoc = constants.floorNames[result.floor] + ", " + constants.sideNames[result.side]

        let other = ""
        if ("other_names" in result) {
          other = "iné názvy: " + result.other_names.join(", ")
        }

        let name = result.primary_name
        if ("number" in result) {
          name += " ("+result.number+")"
        }

        resultsHTML += `<div class="js-search-result px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md" data-id="${result.id}">
            <div class="pointer-events-none">
                <div class="font-bold text-lg">${name}</div>
                <div class="text-gray-500">${prettyLoc}</div>
                <div class="text-gray-500 text-sm">${other}</div>
            </div>
          </div>`
      }

      this.showResults(resultsHTML)
    }
  }
}
