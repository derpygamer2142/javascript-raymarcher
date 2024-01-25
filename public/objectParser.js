import Triangle from "./triangle.js"
export default class objectParser {
    constructor(epsilon) {
        this.epsilon = epsilon
    }
    
    getData(file, x, y, z, scale) {
        let s = file.split("\n")
        let v = []
        let f = []
        s.forEach(l => {
            let ls = l.split(" ")
            let func = ls[0]
            ls.reverse()
            ls.pop()
            ls.reverse()
            switch (func) {
                case "v":
                    v.push([
                        ((+ ls[0]) * scale) + x,
                        ((+ ls[1]) * scale) + y,
                        ((+ ls[2]) * scale) + z
                    ])
                    break;
                case "f":
                    let heldArg = []
                    let newLine = []
                    ls.forEach(a => {
                        heldArg = a.split("/")
                        newLine.push(v[a[0]-1]) // currently not worrying about vertex normals or texture uvs. Just care about the coords.
                        // split each argument by / , then only keep the first part. This is the coordinate index. Add it to the new line, which will have all of the coordinates.
                    })
                    f.push(new Triangle(newLine[0],newLine[1],newLine[2],128,128,128,0.5,175,this.epsilon))

                    break;
            }
        })
        return [v,f]
    }
}