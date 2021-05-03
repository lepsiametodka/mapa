let fuse = null

const setupFuse = () => {
  let FUSED_PLACES = []

  Object.entries(PLACES).forEach(entry => {
    let [key, value] = entry
    value.id = key
    FUSED_PLACES.push(value)
  })

  fuse = new Fuse(FUSED_PLACES, {
    "keys": [
      "primary_name", "other_names", "number"
    ]
  })
}

const doSearch = () => {
  const input = document.getElementById("searchbar").value
  if (input === "") {
    document.getElementById("results-empty").style.display = ""
  }

  const results = fuse.search(input)

  document.getElementById("results-empty").style.display = "none"
  document.getElementById("results").innerHTML = ""

  if (results.length === 0) {
    document.getElementById("results-empty").style.display = ""
  }

  for (let result of results.slice(0, 5)){
    result = result.item
    let prettyLoc = ''
    if (result.floor === "0") {
      prettyLoc += 'prízemie'
    } else if (result.floor === "-1") {
      prettyLoc += 'suterén'
    } else {
      prettyLoc += result.floor + '. poschodie'
    }

    prettyLoc += ", "

    if (result.side === "M") {
      prettyLoc += "Metodova"
    } else if (result.side === "J") {
      prettyLoc += "Jelačičova"
    } else if (result.side === "T") {
      prettyLoc += "Nová telocvična (na dvore)"
    }

    let other = ""
    if ("other_names" in result) {
      other = "iné názvy: " + result.other_names.join(", ")
    }

    let name = result.primary_name
    if ("number" in result) {
      name += " ("+result.number+")"
    }

    document.getElementById("results").innerHTML += `<div class="result px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md" data-id="${result.id}">
        <div class="font-bold text-lg">${name}</div>
        <div class="text-gray-500">${prettyLoc}</div>
        <div class="text-gray-500 text-sm">${other}</div>
      </div>`
  }
}

document.getElementById("searchbar").addEventListener("keyup", doSearch )

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

document.getElementById("results").addEventListener("click", (e) => {
  let target
  if (e.target.classList.contains("result")) {
    target = e.target
  } else {
    target = e.target.parentNode
  }

  document.getElementById("sidebar-md-normal").classList.add("hidden")

  showOnMap(target.dataset.id)
  window.location.hash = "room/" + target.dataset.id
  document.getElementById("searchbar").value = ""
  document.getElementById("results-empty").style.display = ""
  document.getElementById("results").innerHTML = ""
})
