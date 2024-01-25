import Misc from "./misc.js"

export default class Sphere {
    constructor(x,y,z,rad,r,g,b,reflectivity,brightness) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.rad = rad;

        this.r = r;
        this.g = g;
        this.b = b;

        this.reflectivity = reflectivity;
        this.brightness = brightness;
        this.misc = new Misc()
        this.type = "sphere"
    }

    dist(x,y,z) {
        return (this.misc.dist(x,y,z,this.x,this.y,this.z) - this.rad) // the distance between a point and a given sphere is the distance from the point to the center, minus the radius
    }

    normalTo(x,y,z) {
        let v = this.misc.vectorBetween(this.x,this.y,this.z,x,y,z)
        return this.misc.normalize(v[0],v[1],v[2])
    }
}