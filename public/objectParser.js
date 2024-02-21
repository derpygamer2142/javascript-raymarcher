import Triangle from "./triangle.js"
import Misc from "./misc.js"
import Texture from "./texture.js"
import TextureParser from "./textureparser.js"

export default class objectParser {
    constructor(epsilon) {
        this.epsilon = epsilon
        this.misc = new Misc()
        this.textureParser = new TextureParser()
    }
    
    async getData(file, x, y, z, xrot, yrot, zrot, scale, texture, path) {
        let s = file.split("\n")
        let v = []
        let f = []
        let uvs = []
        let textureLibrary = {}
        let currentTexture = texture
        for (let i = 0; i < s.length; i++) {
            let l = s[i]
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
                    let t = new Triangle(newLine[0],newLine[1],newLine[2],128,128,128,0.5,175,this.epsilon,currentTexture,pUV[0],pUV[1],pUV[2])
                    f.push(t)
                    //console.log(newLine)

                    break;
                case "o":
                    break;
                case "mtllib":
                    let response = await fetch(`${path}${ls[0]}`)
                    response = await response.text()
                    let parsedMTL = await this.parseMtl(response,path)
                    textureLibrary = parsedMTL
                    //console.log(parsedMTL)
                    break;
                case "usemtl":
                    currentTexture = textureLibrary[ls[0]]
                    //console.log(currentTexture )
                    break;
                default:
                    //console.log(`ignoring line ${l}`)
                    break;
            }
        }
        return [v,f,textureLibrary]
    }

    async parseMtl(mtl,path) {
        let library = {}
        let subTextures = mtl.split("newmtl ")
        //console.log(subTextures)

        for (let i = 0; i < subTextures.length; i++) {
            // this code is disgusting and i hate it
            let splitTextureFile = subTextures[i].split("\n")
            //console.log(splitTextureFile)
            for (let e = 0; e < splitTextureFile.length; e++) {
                let line = splitTextureFile[e]
                line = line.trim()
                let args = line.split(" ")
                const mtlFunc = args[0]
                args.reverse()
                args.pop()
                args.reverse()
                switch (mtlFunc) {
                    case "map_Kd":
                        //console.log(args)
                        let response = await fetch(`${path}${args[0]}.txt`)
                        response = await response.text()
                        // fetch the texture
                        let groupedTexture = this.textureParser.parseTexture(response)
                        let newTexture = new Texture(groupedTexture,args[1],args[2]) // i don't manually edit the mtls, whatever could you mean
                        library[splitTextureFile[0]] = newTexture
                        break;

                }
            }

            
        }
        return library
    }


}