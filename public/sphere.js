import Misc from "./misc.js"

export default class Sphere {
    constructor(x,y,z,rad,r,g,b,reflectivity,brightness,texture=null) {
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

        this.texture = texture
    }

    dist(x,y,z) {
        return (this.misc.dist(x,y,z,this.x,this.y,this.z) - this.rad) // the distance between a point and a given sphere is the distance from the point to the center, minus the radius
    }

    normalTo(x,y,z) {
        let v = this.misc.vectorBetween(this.x,this.y,this.z,x,y,z)
        return this.misc.normalize(v[0],v[1],v[2])
    }

    colorAt(x,y,z) {
        if (this.texture == null) {
            return [r,g,b]
        }

        // the following code is stolen from https://gamedev.stackexchange.com/questions/114412/how-to-get-uv-coordinates-for-sphere-cylindrical-projection
        let n = this.misc.normalize(x-this.x,y-this.y,z-this.z)
        let u = Math.atan2(n[0], n[1]) / (2*Math.PI) + 0.5
        let v = n[1] * 0.5 + 0.5
        return this.texture.colorAt(u,v)
    }
}