export default class TextureParser {
    parseTexture(texture) {
        let heldTextureList = texture.split("\n")
        let finalTextureList = []
        for (let i = 0; i < heldTextureList.length; i += 3) {
            finalTextureList.push([
                heldTextureList[i],
                heldTextureList[i+1],
                heldTextureList[i+2]
            ])
        }
        // group the texture into 3s
        return finalTextureList
    }
}