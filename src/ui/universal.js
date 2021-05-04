import MobileUI from './mobile'
import SidebarUI from '../sidebar'

export default class UniversalUI {
  constructor() {
    this.is_mobile = window.matchMedia('only screen and (max-width: 768px)').matches
    this.mobile = new MobileUI()
    this.computer = new SidebarUI()
  }

  showRoom(roomId) {
    const room = PLACES[roomId]

    const context = {
      "room": room,
      "other_names": ("other_names" in room) ? room.other_names.join(", ") : "",
      "pretty_side": CONSTANTS.sideNames[room.side],
      "pretty_floor": CONSTANTS.floorNames[room.floor],
    }

    if (this.is_mobile) {
      this.mobile.showRoom(roomId, context)
    } else {
      this.computer.showRoomDetail(roomId, context)
    }
  }
}
