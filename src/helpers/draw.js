
const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";

export const draw = (NodeCell, type) => {
    NodeCell.className = NodeCell.className === target ? target : type
}
export const writeIn = (NodeCell, content) => {
    NodeCell.innerHTML = content
}
export const forceDraw = (NodeCell, type) => {
    NodeCell.className = type
}