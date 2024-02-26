import Misc from "./misc.js"

export default class Triangle {
    constructor(c1,c2,c3,r,g,b,reflectivity,brightness, epsilon, texture, uv0,uv1,uv2, normal=null,) {
        // that's a lot of stuff
        this.a = c1
        this.b2 = c2
        this.c = c3
        this.x = (c1[0]+c2[0]+c3[0])/3.0
        this.y = (c1[1]+c2[1]+c3[1])/3.0
        this.z = (c1[2]+c2[2]+c3[2])/3.0
        this.uv0 = uv0
        this.uv1 = uv1
        this.uv2 = uv2

        this.r = r
        this.g = g
        this.b = b
        this.reflectivity = reflectivity
        this.brightness = brightness
        
        this.misc = new Misc()
        this.epsilon = epsilon

        this.type = "tri"
        this.texture = texture

        // normal calculations. This is slightly faster than calculating when culling afaik. https://www.khronos.org/opengl/wiki/Calculating_a_Surface_Normal
        if (normal == null) {
            let u = this.misc.subVectors(this.b2,this.a)
            let v = this.misc.subVectors(this.c,this.a)
            let e = this.misc.cross(u,v)
            this.normal = this.misc.normalize(e[0],e[1],e[2])
        }
        else {
            this.normal = normal
        }


        // dist stuff for later use. This might be faster than calculating on the spot, but if js parses the json on each call it's a lot slower

        this.ba = this.misc.subVectors(this.b2,this.a)
        this.cb = this.misc.subVectors(this.c,this.b2)
        this.ac = this.misc.subVectors(this.a,this.c)
        this.nor = this.misc.cross(this.ba,this.ac)

        this.acdt = this.misc.dot2(this.ac)
        this.cbdt = this.misc.dot2(this.cb)
        this.badt = this.misc.dot2(this.ba)
        this.nordt = this.misc.dot2(this.nor)

        this.cbanor = this.misc.cross(this.ba,this.nor)
        this.ccbnor = this.misc.cross(this.cb,this.nor)
        this.cacnor = this.misc.cross(this.ac,this.nor) // these look like total gibberish, but basically it stands for cross product ac nor
    }

    dist(x,y,z) {
        y *= -1
        let pa = this.misc.subVectors([x,y,z],this.a)
        let pb = this.misc.subVectors([x,y,z],this.b2)
        let pc = this.misc.subVectors([x,y,z],this.c)
        //return this.misc.dist(x,y,z,this.x,this.y,this.z)
        let d = Math.sqrt(
            
            (this.misc.sign(this.misc.dotProduct(this.cbanor,pa)) +
            this.misc.sign(this.misc.dotProduct(this.ccbnor,pb)) +
            this.misc.sign(this.misc.dotProduct(this.cacnor,pc))  <2)
            ?
            this.misc.min( this.misc.min(
            this.misc.dot2(this.misc.subVectors(this.misc.multVector(this.ba,this.misc.constrain(this.misc.dotProduct(this.ba,pa)/this.badt,0,1)),pa)),
            this.misc.dot2(this.misc.subVectors(this.misc.multVector(this.cb,this.misc.constrain(this.misc.dotProduct(this.cb,pb)/this.cbdt,0,1)),pb)) ),
            this.misc.dot2(this.misc.subVectors(this.misc.multVector(this.ac,this.misc.constrain(this.misc.dotProduct(this.ac,pc)/this.acdt,0,1)),pc)) )
            :
            this.misc.dotProduct(this.nor,pa)*this.misc.dotProduct(this.nor,pa)/this.nordt
        )
        
        return d
    }

    normalTo(x,y,z) {
        let nx = this.dist(x+this.epsilon,y,z) - this.dist(x-this.epsilon,y,z)
        let ny = this.dist(x,y+this.epsilon,z) - this.dist(x,y-this.epsilon,z)
        let nz = this.dist(x,y,z+this.epsilon) - this.dist(x,y,z-this.epsilon)
        return this.misc.normalize(nx,ny,nz)
    }

    colorAt(x,y,z,rayDir,rayOrigin) {
        //yikkity yoinked from spong, thanks, very cool
        /*
        float d = -1/dot(ray_dir,cross(v1-v0,v2-v0));
        vec3 n = cross(ray_origin-v0,ray_dir);
        float u = d*dot(v2-v0,n);
        float v = -d*dot(v1-v0,n);
        if (u>0.0||v>0.0&&u+v<=0.0)
        {
        vec2 uv = v0uv+u*(v1uv-v0uv)+v*(v2uv-v0uv);
        }
        */
       if (this.texture == null) {
            return [this.r,this.g,this.b]
       }
       rayDir[1] *= -1
       rayOrigin[1] *= -1

        let d = -1/(this.misc.dotProduct(rayDir,this.misc.cross(this.misc.subVectors(this.b2,this.a),this.misc.subVectors(this.c,this.a))))
        let n = this.misc.cross(this.misc.subVectors(rayOrigin,this.a),rayDir)
        let u = d*(this.misc.dotProduct(this.misc.subVectors(this.c,this.a),n))
        let v = (d*-1)*(this.misc.dotProduct(this.misc.subVectors(this.b2,this.a),n))
        //console.log(rayDir,this.misc.cross(this.misc.subVectors(this.b2,this.a),this.misc.subVectors(this.c,this.a)))
        if ((u > 0)||(v > 0)&&(u+v <= 0)) {
            let uv = this.misc.addVector2(
                this.misc.addVector2(
                    this.uv0,
                    this.misc.multVector2(
                        this.misc.subVector2(
                            this.uv1,
                            this.uv0
                        ),
                        u
                    )
                ),
                this.misc.multVector2(
                    this.misc.subVector2(
                        this.uv2,
                        this.uv0
                    ),
                    v
                )
            )
            uv[0] = this.misc.constrain(uv[0],0,1)
            uv[1] = this.misc.constrain(uv[1],0,1) // quick fix, hopefully temporary
            return this.texture.colorAt(uv[0],1-uv[1])

        }
        return [0,0,0]

        
    }


}