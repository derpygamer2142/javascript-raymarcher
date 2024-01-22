export default class Misc {
    dist(x1,y1,z1,x2,y2,z2) {
        return Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1) * (y2-y1)) + ((z2-z1) * (z2-z1)))
    }

    normalize(x,y,z) {
        let magnitude = ((x*x) + (y*y) + (z*z))
        return [
            x/magnitude,
            y/magnitude,
            z/magnitude
        ]
    }

    interpolate(a, b, amount) {
        return a + ((b-a) * amount)
    }


}