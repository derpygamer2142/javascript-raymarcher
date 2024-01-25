import Misc from "./misc.js"

export default class Triangle {
    constructor(x1,y1,z1,x2,y2,z2,x3,y3,z3,r,g,b,reflectivity,brightness, epsilon) {
        // that's a lot of stuff
        this.a = [x1,y1,z1]
        this.b2 = [x2,y2,z2]
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

        this.ba = this.misc.subVectors(this.b2,this.a)
        this.cb = this.misc.subVectors(this.c,this.b2)
        this.ac = this.misc.subVectors(this.a,this.c)
        this.nor = this.misc.cross(this.ba,this.ac)
    }

    dist(x,y,z) {
        y *= -1
        let pa = this.misc.subVectors([x,y,z],this.a)
        let pb = this.misc.subVectors([x,y,z],this.b2)
        let pc = this.misc.subVectors([x,y,z],this.c)
        //console.log()
        //return this.misc.dist(x,y,z,this.x,this.y,this.z)
        let d = Math.sqrt(
            
            (this.misc.sign(this.misc.dotProduct(this.misc.cross(this.ba,this.nor),pa)) +
            this.misc.sign(this.misc.dotProduct(this.misc.cross(this.cb,this.nor),pb)) +
            this.misc.sign(this.misc.dotProduct(this.misc.cross(this.ac,this.nor),pc))  <2)
            ?
            this.misc.min( this.misc.min(
            this.misc.dot2(this.misc.subVectors(this.misc.multVector(this.ba,this.misc.constrain(this.misc.dotProduct(this.ba,pa)/this.misc.dot2(this.ba),0,1)),pa)),
            this.misc.dot2(this.misc.subVectors(this.misc.multVector(this.cb,this.misc.constrain(this.misc.dotProduct(this.cb,pb)/this.misc.dot2(this.cb),0,1)),pb)) ),
            this.misc.dot2(this.misc.subVectors(this.misc.multVector(this.ac,this.misc.constrain(this.misc.dotProduct(this.ac,pc)/this.misc.dot2(this.ac),0,1)),pc)) )
            :
            this.misc.dotProduct(this.nor,pa)*this.misc.dotProduct(this.nor,pa)/this.misc.dot2(this.nor)
            
        )
        //console.log(d)
        return d
    }

    normalTo(x,y,z) {
        let nx = this.dist(x+this.epsilon,y,z) - this.dist(x-this.epsilon,y,z)
        let ny = this.dist(x,y+this.epsilon,z) - this.dist(x,y-this.epsilon,z)
        let nz = this.dist(x,y,z+this.epsilon) - this.dist(x,y,z-this.epsilon)
        return this.misc.normalize(nx,ny,nz)
    }


}