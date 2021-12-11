export function dimentions(){
    let WIDTH = 51;
    let HEIGHT = 29;

    this.getWidth = ()=> WIDTH
    this.getHeight = () => HEIGHT

    this.setWidth = (newWidth) =>{
        WIDTH = newWidth
    }

    this.setHeight = (newHeight) =>{
        HEIGHT = newHeight
    }
}
