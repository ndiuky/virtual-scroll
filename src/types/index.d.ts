interface Item {
  id: number
  text: string
  timestamp: Date
}

interface VirtualItem extends Item {
  top: number
}
