const showOnMap = (id) => {
  const place = PLACES[id]
  FLOOR_NUMBER = parseInt(place.floor)
  renderFloor(FLOOR_NUMBER)
  resetZoom()

  const ID = id.replace(".", "_")
  g.select("#" + ID)
    .transition()
    .duration(100)
    .delay(250)
    .style("stroke", "red")
    .attr("transform", "scale(2)")

  g.select("#" + ID)
    .transition().delay(500).duration(100)
    .attr("transform", "")
    .style("stroke-width", "2px")

  g.selectAll(".rooms").sort((a, b) => (a.id === id ? 1 : -1))
}

const CONSTANTS = {
  "sideNames": {
    "M": "Metodova",
    "J": "Jelačičova",
    "T": "telocvična na dvore"
  },
  "floorNames": {
    "-1": "suterén",
    "0": "prízemie",
    "1": "1. poschodie",
    "2": "2. poschodie",
    "3": "3. poschodie"
  }
}

class SearchUI {
  constructor() {
    document.querySelectorAll(".js-search")
      .forEach(el => el.addEventListener("keyup", evt => this.handleSearch(evt)))

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
        const prettyLoc = CONSTANTS.floorNames[result.floor] + ", " + CONSTANTS.sideNames[result.side]

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
