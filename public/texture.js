import Misc from "./misc.js"
export default class Texture {
    constructor(textureList, width, height) {
        this.texture = textureList
        this.width = width
        this.height = height
        // if (width != height) {
        //     console.warn("Texture warning: Non square textures may cause stretching or unintended effects")
        // }

        this.misc = new Misc()
    }

    colorAt(u,v) {
        // (y * width) - (width - x)? (+ 1 if not zero-indexed)
        // 3,5
        // (5 * 5) - (5 - 3)
        /*
        26 27 28 29 30 < 4,4 normal coords or 1,1 uv coords
        21 22 23 24 25
        16 17 18 19 20
        11 12 13 14 15
        6  7  8  9  10
        1  2  3  4  5
        ^
        1,1 normal coords or 0,0 uv coords

        offset coords by 1,1
        */
        u *= (this.width - 1)
        v *= (this.height - 1)
        u += 1
        v += 1
        // make the uv coords on a scale from 1 to width or height

        // todo: make it interpolate colors. Not doing that right now because I don't feel like it.

        u = Math.round(u)
        v = Math.round(v)

        let textureCoords = this.misc.coordsToIndex(u,v,this.width);
        return this.texture[textureCoords]

    }
}