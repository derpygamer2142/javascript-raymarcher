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
    }

    dist(x,y,z) {
        return (this.misc.dist(x,y,z,this.x,this.y,this.z) - this.rad) // the distance between a point and a given sphere is the distance from the point to the center, minus the radius
    }

    vectorTo(x,y,z) {
        return this.misc.vectorBetween(x,y,z,this.x,this.y,this.z)
    }
}