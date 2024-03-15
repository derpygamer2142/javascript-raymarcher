export default class Misc {
    dist(x1,y1,z1,x2,y2,z2) {
        return Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1) * (y2-y1)) + ((z2-z1) * (z2-z1)))
    }

    normalize(x,y,z) {
        let magnitude = Math.sqrt((x*x) + (y*y) + (z*z))
        if (magnitude == 0) {
            return [0.0,0.0,0.0]
        }
        return [
            x/magnitude,
            y/magnitude,
            z/magnitude
        ]
        
    }

    interpolate(a, b, amount) {
        return a + ((b-a) * amount)
    }

    vectorBetween(x1,y1,z1,x2,y2,z2) {
        return [x2-x1,y2-y1,z2-z1]
    }

    dotProduct(a,b) {
        return ((a[0]*b[0]) + (a[1] * b[1]) + (a[2] * b[2]))
    }

    toRad(deg) {
        return deg*(Math.PI/180)
    }
    
    toDeg(rad) {
        return rad*(180/Math.PI)
    }

    rotateVector(v,pitch,yaw) {
        let [x,y,z] = [v[0],v[1],v[2]]
        let sa = Math.sin(this.toRad(pitch))
        let ca = Math.cos(this.toRad(pitch))
        let sb = Math.sin(this.toRad(yaw))
        let cb = Math.cos(this.toRad(yaw))
        let xv = x
        let yv = y
        let zv = z
        yv = (z * sa) + (y * ca)
        zv = (z * ca) - (y * sa)
        xv = (zv * sb) + (x * cb)
        zv = (zv * cb) - (x * sb)
        return [xv,yv,zv]
    }

    multVector(v,s) {
        return [
            v[0]*s,
            v[1]*s,
            v[2]*s
        ]
    }

    sign(v) {
        // let i = 0

        // // switch (c) {
        // //     case "x":
        // //         i = 0
            
        // //     case "y":
        // //         i = 1
            
        // //     case "z":
        // //         i = 2

        // // }

        // return (v[i] / Math.abs(v[i]))
        return (v/Math.abs(v))

    }

    cross(a,b) {
        return [
            (a[1]*b[2]) - (b[1]*a[2]),
            (a[2]*b[0]) - (b[2]*a[0]),
            (a[0]*b[1]) - (b[0]*a[1])
        ]

    }

    dot2(v) {
        return this.dotProduct(v,v)
    }

    min(a,b) {
        return Math.min(a,b) // forgot these functions exist lol
    }

    max(a,b) {
        return Math.max(a,b)
    }
    

    addVectors(a,b) {
        return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]
    }

    subVectors(a,b) {
        return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]
    }

    oneLineIf(cond,a,b) {
        if (cond) {
            return a
        }
        return b
    }

    constrain(n,a,b) {
        return Math.min(b, Math.max(a, n))
    }

    rotatePoint(px,py,pz,x2,y2,z2,pitch,yaw,roll) {
        // this code is taken from https://stackoverflow.com/questions/34050929/3d-point-rotation-algorithm
            /*
            I could probably improve this by letting the function take these trig vals prebaked, however:
            - idk if 4 trig functions is faster or slower than an if statement
            - idk if javascript calculates the default value regardless of whether it is used.
            - this function isn't used very often, and in the current implementation these optimizations would be almost useless.
            */
            var cosa = Math.cos(this.toRad(yaw));
            var sina = Math.sin(this.toRad(yaw));
        
            var cosb = Math.cos(this.toRad(pitch));
            var sinb = Math.sin(this.toRad(pitch));
        
            var cosc = Math.cos(this.toRad(roll));
            var sinc = Math.sin(this.toRad(roll));
        
            var Axx = cosa*cosb;
            var Axy = cosa*sinb*sinc - sina*cosc;
            var Axz = cosa*sinb*cosc + sina*sinc;
        
            var Ayx = sina*cosb;
            var Ayy = sina*sinb*sinc + cosa*cosc;
            var Ayz = sina*sinb*cosc - cosa*sinc;
        
            var Azx = -sinb;
            var Azy = cosb*sinc;
            var Azz = cosb*cosc; // could probably bake this into the camera for speed
        

            let a = Axx*(x2-px) + Axy*(y2-py) + Axz*(z2-pz);
            let b = Ayx*(x2-px) + Ayy*(y2-py) + Ayz*(z2-pz);
            let c = Azx*(x2-px) + Azy*(y2-py) + Azz*(z2-pz);
            return [a,b,c]
    }


    coordsToIndex(x,y,width) {
        return (y * width) - (width - x)
    }


    addVector2(a,b) {
        return [
            a[0]+b[0],
            a[1]+b[1],
        ]
    }

    subVector2(a,b) {
        return [
            a[0]-b[0],
            a[1]-b[1],
        ]
    }

    multVector2(v,s) {
        return [
            v[0]*s,
            v[1]*s,
        ]
    }



}