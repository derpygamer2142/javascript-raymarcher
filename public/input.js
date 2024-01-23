export default class Input {
    constructor() {

        this.w = false;
        this.a = false;
        this.s = false;
        this.d = false;
        this.e = false
        this.q = false
        this.initInput();
        this.ArrowUp = false
        this.ArrowDown = false
        this.ArrowRight = false
        this.ArrowLeft = false
    }

    initInput() {
        document.addEventListener("keydown", e => {
            this[e.key] = true;
        });
        
        document.addEventListener("keyup", e => {
            this[e.key] = false;
        });

        document.addEventListener("mousemove", e => {
            // console.log("mouse move")
        });


    }
}