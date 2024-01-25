import Triangle from "./triangle.js"
export default class objectParser {
    getData(file) {
        let s = file.split("\n")
        let v = []
        let f = []
        s.forEach(l => {
            let ls = l.split(" ")
            let f = ls[0]
            ls.reverse()
            ls.pop()
            ls.reverse()
            switch (f) {
                case "v":
                    v.push(ls)
                case "f":
                    let heldArg = []
                    let newLine = []
                    ls.forEach(a => {
                        heldArg = a.split("/")
                        newLine.append(v[a[0]]) // currently not worrying about vertex normals or texture uvs. Just care about the coords.
                        // split each argument by / , then only keep the first part. This is the coordinate index. Add it to the new line, which will have all of the coordinates.
                    })
            }
        })
    }
}