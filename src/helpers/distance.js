import { dimentions as DM } from '../utils/config.js'

const dimentions = new DM

export const distance = (node1, node2) => {
  const WIDTH = dimentions.getWidth()
  const HEIGHT = dimentions.getHeight()
  if (!node1 || !node2) return null

  const DX = Math.abs((parseInt(node1.id) % WIDTH) - (parseInt(node2.id) % WIDTH));
  const DY = Math.abs((Math.floor(parseInt(node1.id) / WIDTH)) - (Math.floor(parseInt(node2.id) / WIDTH)))

  //console.log(Math.floor( Math.sqrt(DX**2 + DY**2) ))
  return Math.ceil(Math.sqrt(DX ** 2 + DY ** 2))
}