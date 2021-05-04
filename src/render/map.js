import BackdropRender from './backdrop'
import LabelRender from './labels'
import RoomRender from './rooms'
import StairsRender from './stairs'
import ShapesRender from './shapes'
import EntrancesRender from './entrances'

export default class MapRender {
  constructor(g) {
    this.backdrop = new BackdropRender(g)
    this.labels = new LabelRender(g)
    this.rooms = new RoomRender(g)
    this.stairs = new StairsRender(g)
    this.shapes = new ShapesRender(g)
    this.entrances = new EntrancesRender(g)
  }

  dataLoaded(data) {
    this.data = data
    this.backdrop.render(data)
  }

  renderFloor(number) {
    const floorData = this.data.floors[number + ""]
    this.entrances.render(floorData)
    this.shapes.render(floorData)
    this.stairs.render(floorData)
    this.rooms.render(floorData)
    this.labels.renderLabels(floorData)

	  document.getElementById("floor-number").innerText = number
  }
}
