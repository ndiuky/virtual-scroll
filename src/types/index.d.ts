interface Item {
  id: number
  text: string
  timestamp: Date
  height?: number
}

interface VirtualItem extends Required<Item> {
  top: number
}

interface ItemPosition {
  index: number
  top: number
  height: number
}
