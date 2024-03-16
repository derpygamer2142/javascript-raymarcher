import Misc from "./misc.js"
import Sphere from "./sphere.js"
import Box from "./box.js"
import Triangle from "./triangle.js";
import Input from "./input.js";
import objectParser from "./objectParser.js";
import Texture from "./texture.js";
import TextureParser from "./textureparser.js";

const canv = document.getElementById("screen");
const ctx = canv.getContext("2d");

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
canv.width = WIDTH
canv.height = HEIGHT
console.log(WIDTH, HEIGHT)


function toOriginX(x) {
    return x - (WIDTH/2);
}

function toOriginY(y) {
    return y - (HEIGHT/2);
}


function clamp(n,a,b) {
    return Math.min(b, Math.max(a, n))
}

function printLines(text,x,y,size) {
    text.reverse()
    ctx.font = `${size}px Comic Sans MS`
    ctx.fillStyle = "white"
    for (let i = 0;i < text.length; i++) {
        ctx.fillText(text[i],x,y-(i*(size*1.03)))
    }
}

function coolerTonemapper(a,c) {
    // thanks spong
    return Math.min(Math.max(0,((c)/(((c)+1)))*255*a),255)
}

function toneMapRGB(r,g,b) {
    let [q,w,e] = [r/765,g/765,b/765] // microoptimization
    return [
        coolerTonemapper(1.85,q),
        coolerTonemapper(1.85,w),
        coolerTonemapper(1.85,e)
    ] // the 1.85 is an arbitrary value that i think looks nice
}

// most of the vector math relies on the origin being in the center of the screen

async function fetchTextureFromPath(path,width,height) {
    let heldTextureFile = await fetch(`./textures/${path}.txt`)
    heldTextureFile = await heldTextureFile.text()
    const textureParser = new TextureParser()
    let heldTexture = new Texture(textureParser.parseTexture(heldTextureFile),width,height)
    return heldTexture
}



// settings
let fov = 135
let renderDist = 4500;
let epsilon = 0.01
let resolution = 8 // works best with a power of 2, or just 1
let speed = 25
let [br,bg,bb] = [7, 237, 218]
let lx = 0
let ly = 105
let lz = -100
let lr = 15
let bfc = false // bfc is broken af
const maxReflections = 3
const samples = 25

const textureLibrary = {
    "duck": await fetchTextureFromPath("duck",250,250),
    "missing": await fetchTextureFromPath("missing texture",125,125),
    "overweight_duck": await fetchTextureFromPath("overweight duck",250,250),
    "missing2": await fetchTextureFromPath("missing2",750,750),
    "magestic_duck": await fetchTextureFromPath("magestic duck",250,250),
    "angry_duck": await fetchTextureFromPath("angary duck 2",905,905),
    "deer": await fetchTextureFromPath("deer",250,250),
    
}


const misc = new Misc()
const input = new Input()
const objReader = new objectParser(epsilon)
let e = await fetch("./models/crazy.obj")
let model = await e.text()

let output = await objReader.getData(model,0,0,0,0,0,0,10,128,128,128,null,"./models/", true, {
    "ns": 0.015
})
console.log(output)


let objects = []//output[1];
const SIZE = 15 // debug
const DIM = 0.5
objects.push(new Box(0,SIZE+DIM,0,SIZE,DIM,SIZE,0,255,255,255,0.25,128,epsilon)) // floor
objects.push(new Box(SIZE-DIM,0,0,DIM,SIZE,SIZE,0,0,255,0,0.05,128,epsilon)) // right
objects.push(new Box(DIM-SIZE,0,0,DIM,SIZE,SIZE,0,255,0,0,0.05,128,epsilon)) // left?
objects.push(new Box(0,0,SIZE-DIM,SIZE-DIM,SIZE,DIM,0,255,255,255,0.25,128,epsilon)) // front
objects.push(new Box(0,0,DIM-SIZE,SIZE-DIM,SIZE,DIM,0,255,255,255,0.25,128,epsilon)) // back
objects.push(new Box(0,DIM-SIZE,0,SIZE,DIM,SIZE,0,255,255,255,0.35,128,epsilon)) // ceiling
objects.push(new Box(0,-(SIZE+DIM),0,7,2,2,2,255,255,255,0.005,300,epsilon)) // light

objects.push(new Sphere(0,-(SIZE-5),5,5,255,255,255,0.3,128,null))
objects.push(new Sphere(-8,-(SIZE-5),12,5,79,60,8,0.015,128,null))
objects.push(new Sphere(8,-(SIZE-5),12,5,255,0,0,0.2,128,null))
objects.push(new Triangle([-3,-3,0],[0,3,0],[3,-3,0],128,128,128,0.1,128,epsilon,null,[0,0],[0.5,1],[1,0]))


// objects.push(new Sphere(0,0,85,65,0,0,0,0.5,175,heldTexture))
// objects.push(new Sphere(0,-35,120,75,255,255,255,0.5,175,null))
// objects.push(new Sphere(0,25,120,60,255,255,255,0.5,175,null))
// objects.push(new Sphere(-35,25,100,55,255,255,255,0.5,175,textureLibrary.duck))

// objects.push(new Sphere(35,25,100,55,255,255,255,0.5,175,textureLibrary.overweight_duck)) // :trol:
// objects.push(new Box(0,0,185,75,75,75,25,128,127,128,0.5,175,epsilon))
// objects.push(new Triangle([-45,45,35],[45,-45,35],[-45,-45,35],128,128,128,0.5,175,epsilon,textureLibrary.duck,[0,1],[1,0],[0,0]))
// objects.push(new Triangle([45,45,35],[45,-45,35],[-45,45,35],128,128,128,0.5,175,epsilon,textureLibrary.duck,[1,1],[1,0],[0,1]))
// objects.push(new Triangle([0,20,45],[45,-45,15],[-45,-45,15],128,128,128,0.5,175,epsilon))

let toRender = []


// let camX = 65 // it breaks when camX is 0. No clue why, not fixing it either.
// let camY = -88
// let camZ = 140
// let camXDir = 20
// let camYDir = -75
let camX = 0 // it breaks when camX is 0. No clue why, not fixing it either.
let camY = 0
let camZ = -8
let camXDir = 15
let camYDir = 0

let focalLength = (WIDTH/2)/Math.tan(misc.toRad(fov/2)) // convert FOV to focal length, as that's what the other formulas use. FOV is more human readable tho
let deltaTime = 0
let heldTime = Date.now()







function raymarchPixel(x,y) {
    let rayLength = 0.0;
    let sdfDist = Infinity
    let rx = camX;
    let ry = camY;
    let rz = camZ;
    let [ox, oy, oz] = [camX, camY, camZ] // ray origin, used by the triangle texture mapper
    let xv = toOriginX(x)
    let yv = toOriginY(y)
    let zv = focalLength
    let [pr,pg,pb] = [0,0,0]

    let contactObject = null

    let heldv = misc.rotateVector(misc.normalize(xv,yv,zv),camXDir,camYDir)
    xv = heldv[0]
    yv = heldv[1]
    zv = heldv[2]
    // the camera vector is (the pixel's x pos, pixel's y pos, focal length). This must be normalized.
    //let numSteps = 0
    let numReflections = 0
    let heldReflectionWeight = 1
    while (numReflections < maxReflections && heldReflectionWeight > epsilon) {
        sdfDist = Infinity
        while (sdfDist > epsilon && rayLength < renderDist) {
            sdfDist = Infinity
            toRender.forEach(o => {
                let heldDist = o.dist(rx,ry,rz)
                //console.log(heldDist)
                if (heldDist < sdfDist) {
                    sdfDist = heldDist
                    contactObject = o
                }
            }) // go through each object and find the distance to it. If the distance is less than the held distance, replace it. Also hold on to the object it hit, we need it later.
            rx += xv*sdfDist
            ry += yv*sdfDist
            rz += zv*sdfDist
            rayLength += sdfDist
            //numSteps += 1
            //console.log("step")
        }
        //console.log(numSteps)
        if (rayLength > renderDist) {
            numReflections = maxReflections + 1

        }
        else {
            //console.log(xv,yv,zv)
            // pr = contactObject.r
            // pg = contactObject.g
            // pb = contactObject.b
            let objRGB = contactObject.colorAt(rx,ry,rz,[xv,yv,zv],[ox, oy, oz])

            ox = rx
            oy = ry
            oz = rz
            //console.log(contactObject)
            //console.log(objRGB)
            let [r,g,b] = [0,0,0]
            //console.log(typeof objRGB)
            r = objRGB[0]
            g = objRGB[1]
            b = objRGB[2]

            let contactNormal = contactObject.normalTo(rx,ry,rz)

            if (maxReflections == 1) {
                let lv = misc.vectorBetween(lx,ly,lz,contactObject.x,contactObject.y,contactObject.z) // get the normal from the object's center to the light
                let lightingVal = misc.dotProduct(contactNormal,misc.normalize(lv[0],lv[1],lv[2]))
                // let ld = misc.dist(rx,ry,rz,lx,ly,lz)
                // // ld -= lr
                // lightingVal /= (ld * ld)
                
                lightingVal *= 45


                r += lightingVal
                g += lightingVal
                b += lightingVal
            }
            
            pr += r*heldReflectionWeight*(contactObject.brightness/128)
            pg += g*heldReflectionWeight*(contactObject.brightness/128)
            pb += b*heldReflectionWeight*(contactObject.brightness/128)
            heldReflectionWeight *= contactObject.reflectivity
            numReflections += 1
            // if (numReflections != 0) {console.log("awdasd " + r*heldReflectionWeight*(contactObject.brightness/128))}
            // else { console.log("aaaaaaa: " + r*heldReflectionWeight*(contactObject.brightness/128))}
            //console.log(pr,pg,pb)
            

            /*
            1 -> 1
            2 -> 1/5 ?
            */

            // calculate new reflection vector
            let heldReflected = misc.subVectors([xv,yv,zv], misc.multVector(contactNormal,2*misc.dotProduct(contactNormal,[xv,yv,zv])))
            xv = heldReflected[0]
            yv = heldReflected[1]
            zv = heldReflected[2]
            rx += xv*epsilon*2
            ry += yv*epsilon*2
            rz += zv*epsilon*2
            //console.log(contactObject.dist(rx,ry,rz) < epsilon)
            //console.log(heldReflectionWeight)
            //console.log(contactObject.reflectiveness)
        }
    }

    // pr = misc.interpolate(r,br,rayLength/renderDist) // fade the pixel's color from the background color to the object's color
    // pg = misc.interpolate(g,bg,rayLength/renderDist)
    // pb = misc.interpolate(b,bb,rayLength/renderDist)
    // return rgb values
    if ((rayLength > renderDist) && (misc.dist(camX,camY,camZ,rx,ry,rz) > (renderDist/2))) {
        pr += br*heldReflectionWeight
        pg += bg*heldReflectionWeight
        pb += bb*heldReflectionWeight
    }
    //console.log(`${x},${y} terminated with `,numReflections, " reflections and ", heldReflectionWeight, " reflection" + `rgb ${pr}, ${pg}, ${pb}`)
    return toneMapRGB(pr,pg,pb)
    
}



let rgb = []

function render() {
    ctx.fillStyle = `rgb(${br},${bg},${bb})`
    ctx.fillRect(0,0,WIDTH,HEIGHT)
    for (let y = 0; y < HEIGHT; y += resolution) {
        for (let x = 0; x < WIDTH; x += resolution) {
            //console.log(x,y)
            //ctx.fillStyle = "black"
            //ctx.fillRect(x,y,5,5)
            const prgb = raymarchPixel(x,y)
            //rgb.push(prgb)
        
            ctx.fillStyle = `rgb(${prgb[0]},${prgb[1]},${prgb[2]})`
            ctx.fillRect(x,y,resolution,resolution)
            
        }

    }

}

async function renderAndUpdate() {
    if (bfc) {
        toRender = []
        for (let i = 0; i < objects.length; i++) {
            let o = objects[i]
            if (o.type == "tri") {
                let e = misc.vectorBetween(o.x,o.y,o.z,camX,camY,camZ)
                if (!(misc.dotProduct(o.normal,misc.normalize(e[0],e[1],e[2])) < 0)) {
                    toRender.push(o)
                }
            }
            else {
                toRender.push(o)
            }
        } // back face culling in a raymarcher?! :scream:
    }
    else {
        toRender = objects
    }



    deltaTime = (Date.now() - heldTime)/1000
    heldTime = Date.now()
    let oldTime = Date.now()

    let heldv = misc.normalize((+ input.d) - (+ input.a),0,(+ input.w) - (+ input.s))
    heldv = misc.rotateVector([heldv[0],heldv[1],heldv[2]],camXDir,camYDir) // convert the wasd input into a vector so it can be easily rotated
    heldv = misc.normalize(heldv[0],heldv[1],heldv[2])
    heldv = misc.multVector(heldv,deltaTime*speed) // multiply the vector by deltatime
    camX += heldv[0]
    camY += ((+ input.q) - (+ input.e)) * deltaTime*speed
    camZ += heldv[2] // apply movement
    camXDir -= (+ input.ArrowUp) * deltaTime*speed*2 // for some stupid reason the x and y rotation axises(axices? axes?) are flipped
    camXDir += (+ input.ArrowDown) * deltaTime*speed*2
    camYDir += (+ input.ArrowRight) * deltaTime*speed*2
    camYDir -= (+ input.ArrowLeft) * deltaTime*speed*2
    camXDir = clamp(camXDir,-80,100)


    render()

    let fps = 1/deltaTime
    let renderTime = Date.now() - oldTime
    //printLines([`Render load: ${toRender.length} shapes`,`Resolution: ${resolution}`,`Render time: ${renderTime} milliseconds`,`FPS: ${fps.toFixed(3)}`,`DeltaTime: ${deltaTime}`,`Pos: ${camX.toFixed(3)},${camY.toFixed(3)},${camZ.toFixed(3)}`,`Rot: ${camYDir}, ${camXDir}`],0,HEIGHT*0.98,30)
    // ctx.fillText(`Rendered in ${renderTime} milliseconds`,0,HEIGHT*0.9)
    // ctx.fillText(`FPS: ${fps.toFixed(3)}`,0,HEIGHT*0.94)
    // ctx.fillText(`DeltaTime: ${deltaTime}`,0,HEIGHT*0.98)

}


setInterval(renderAndUpdate,(1/60)*1000)
//await renderAndUpdate()