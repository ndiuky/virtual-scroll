interface Item {
  id: number
  text: string
  timestamp: Date
  height?: number
}

interface VirtualItem extends Item {
  top: number
  height: number
}

interface ItemPosition {
  index: number
  top: number
  height: number
}
