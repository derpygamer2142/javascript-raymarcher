import Triangle from "./triangle.js"
import Misc from "./misc.js"

export default class objectParser {
    constructor(epsilon) {
        this.epsilon = epsilon
        this.misc = new Misc()
    }
    
    getData(file, x, y, z, xrot, yrot, zrot, scale, texture) {
        let s = file.split("\n")
        let v = []
        let f = []
        let uvs = []
        s.forEach(l => {
            let ls = l.split(" ")
            let func = ls[0]
            ls.reverse()
            ls.pop()
            ls.reverse()
            switch (func) {
                case "v":
                    let cX = + ls[0]
                    let cY = + ls[1]
                    let cZ = + ls[2]
                    let heldp = [cX, cY, cZ]
                    
                    if (!(xrot == 0 && yrot == 0 && zrot == 0)){
                        heldp = this.misc.rotatePoint(cX,cY,cZ,0,0,0,xrot,yrot,zrot)
                    }
                    // v.push([
                    //     (heldp[0] * scale) + x,
                    //     (heldp[1] * scale)*-1 + y,
                    //     (heldp[2] * scale) + z
                    // ])
                    v.push([
                        ((+ ls[0]) * scale) + x,
                        ((+ ls[1]) * scale) + y,
                        ((+ ls[2]) * scale) + z
                    ])
                    break;
                case "vt":
                    uvs.push([
                        + ls[0],
                        + ls[1]
                    ])
                    break;

                case "f":
                    let heldArg = []
                    let newLine = []
                    let pUV = []
                    ls.forEach(a => {
                        heldArg = a.split("/")
                        heldArg[0] = + heldArg[0]
                        heldArg[1] = + heldArg[1]
                        pUV.push(uvs[heldArg[1]-1])
                        newLine.push(v[heldArg[0]-1]) // currently not worrying about vertex normals or texture uvs. Just care about the coords.
                        // split each argument by / , then only keep the first part. This is the coordinate index. Add it to the new line, which will have all of the coordinates.
                    })
                    let t = new Triangle(newLine[0],newLine[1],newLine[2],128,128,128,0.5,175,this.epsilon,texture,pUV[0],pUV[1],pUV[2])
                    f.push(t)
                    //console.log(newLine)

                    break;
                case "o":
                    break;
                default:
                    //console.log(`ignoring line ${l}`)
                    break;
            }
        })
        return [v,f]
    }


}