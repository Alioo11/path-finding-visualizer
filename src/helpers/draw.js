
const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";

const animeConfig = {
    animationDuration : 1000,
    default : true
}

export const draw = (NodeCell, type , anime = animeConfig) => {
    NodeCell.style.animationDuration = anime.default ? "" : `${anime.animationDuration}ms`
    NodeCell.className = NodeCell.className === target ? target : type
}
export const writeIn = (NodeCell, content) => {
    //const width = localStorage.getItem('WIDTH')
    // NodeCell.innerHTML = content
}
export const forceDraw = (NodeCell, type, anime = animeConfig) => {
    NodeCell.style.animationDuration = anime.default ? "" : `${anime.animationDuration}ms`
    NodeCell.className = type
}