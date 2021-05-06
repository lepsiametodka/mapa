import MobileUI from './mobile'
import SidebarUI from './computer'
import {map, PLACES, router} from '../app'
import {constants} from '../constants'

export default class UniversalUI {
  constructor() {
    this.is_mobile = window.matchMedia('only screen and (max-width: 768px)').matches
    this.mobile = new MobileUI()
    this.computer = new SidebarUI()

    document.getElementById("floor-up").addEventListener("click", () => this.handleFloorChange(1))
    document.getElementById("floor-down").addEventListener("click", () => this.handleFloorChange(-1))
  }

  handleFloorChange(diff) {
    const newNumber = diff + map.currentFloor
    if (newNumber < -1 || newNumber > 3) {
      return
    }

    map.renderFloor(newNumber)
    router.updateFloorNumber(newNumber)
  }

  showRoom(roomId) {
    const room = PLACES[roomId]
    router.setRoomInURL(roomId)

    const context = {
      "room": room,
      "other_names": ("other_names" in room) ? room.other_names.join(", ") : "",
      "pretty_side": constants.sideNames[room.side],
      "pretty_floor": constants.floorNames[room.floor],
    }

    if (this.is_mobile) {
      this.mobile.showRoom(roomId, context)
    } else {
      this.computer.showRoomDetail(roomId, context)
    }
  }
}
