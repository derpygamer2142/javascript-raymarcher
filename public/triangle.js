import Misc from "./misc.js"

export default class Triangle {
    constructor(x1,y1,z1,x2,y2,z2,x3,y3,z3,r,g,b,reflectivity,brightness, epsilon) {
        // that's a lot of stuff
        this.a = [x1,y1,z1]
        this.b = [x2,y2,z2]
        this.c = [x3,y3,z3]

        this.x = (x1+x2+x3)/3
        this.y = (y1+y2+y3)/3
        this.z = (z1+z2+z3)/3

        this.r = r
        this.g = g
        this.b = b
        this.reflectivity = reflectivity
        this.brightness = brightness
        
        this.misc = new Misc()
        this.epsilon = epsilon

        // dist stuff for later use. This might be faster than calculating on the spot, but if js parses the json on each call it's a lot slower

        this.ba = this.misc.subVectors(this.b,this.a)
        this.cb = this.misc.subVectors(this.c,this.b)
        this.ac = this.misc.subVectors(this.a,this.c)
        this.nor = this.misc.cross(this.ba,this.ac)
    }

    dist(x,y,z) {
        let pa = this.misc.subVectors([x,y,z],this.a)
        let pb = this.misc.subVectors([x,y,z],this.b)
        let pc = this.misc.subVectors([x,y,z],this.c)

        return Math.sqrt(

        )
    }

    normalTo(x,y,z) {
        let nx = this.dist(x+this.epsilon,y,z) - this.dist(x-this.epsilon,y,z)
        let ny = this.dist(x,y+this.epsilon,z) - this.dist(x,y-this.epsilon,z)
        let nz = this.dist(x,y,z+this.epsilon) - this.dist(x,y,z-this.epsilon)
        return this.misc.normalize(nx,ny,nz)
    }


}