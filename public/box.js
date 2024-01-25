import Misc from "./misc.js"

export default class Box {
    constructor(x,y,z,w,h,d,rad,r,g,b,reflectivity,brightness, epsilon) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
        this.h = h
        this.d = d
        this.rad = rad
        
        this.r = r
        this.g = g
        this.b = b
        this.reflectivity = reflectivity
        this.brightness = brightness

        this.misc = new Misc()
        this.epsilon = epsilon
        this.type = "box"
    }

    dist(x,y,z) {
        let dx = Math.abs(x-this.x) - this.w
        let dy = Math.abs(y-this.y) - this.h
        let dz = Math.abs(z-this.z) - this.d
        let heldDist = dx
        if (dy > heldDist) {heldDist = dy}
        if (dz > heldDist) {heldDist = dz}
        if (heldDist > 0) {
            heldDist = this.misc.dist(dx * (+ (dx > 0)), dy * (+ (dy > 0)), dz * (+ (dz > 0)), 0, 0, 0) - this.rad
        }
        return heldDist
    }

    normalTo(x, y, z) {
        let nx = this.dist(x+this.epsilon,y,z) - this.dist(x-this.epsilon,y,z)
        let ny = this.dist(x,y+this.epsilon,z) - this.dist(x,y-this.epsilon,z)
        let nz = this.dist(x,y,z+this.epsilon) - this.dist(x,y,z-this.epsilon)
        return this.misc.normalize(nx,ny,nz)
    }
}