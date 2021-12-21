export function dimentions(){
    let WIDTH = (parseInt(window.innerWidth/30)-2) % 2 ===0 ? (parseInt(window.innerWidth/30)-3) : (parseInt(window.innerWidth/30)-2) ;
    let HEIGHT = 31;

    this.getWidth = ()=> WIDTH
    this.getHeight = () => HEIGHT

    this.setWidth = (newWidth) =>{
        WIDTH = newWidth
        console.log(WIDTH)
    }

    this.setHeight = (newHeight) =>{
        HEIGHT = newHeight
    }
}
