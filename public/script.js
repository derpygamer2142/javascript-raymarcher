import Misc from "./misc.js"
import Sphere from "./sphere.js"
import Input from "./input.js";

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

// most of the vector math relies on the origin being in the center of the screen

function toRad(deg) {
    return deg*(Math.PI/180)
}

function toDeg(rad) {
    return rad*(180/Math.PI)
}

let objects = [];
objects.push(new Sphere(0,0,45,35,255,0,0,0.5,175))
console.log(objects)
let camX = 0
let camY = 0
let camZ = 0
let camXDir = 0
let camYDir = 0
let fov = 135
let renderDist = 500;
let epsilon = 0.01
let resolution = 8
let focalLength = (WIDTH/2)/Math.tan(toRad(fov/2)) // convert FOV to focal length, as that's what the other formulas use. FOV is more human readable tho

let [br,bg,bb] = [7, 237, 218]

const misc = new Misc()
const input = new Input()


function raymarchPixel(x,y) {
    let rayLength = 0;
    let sdfDist = Infinity
    let rx = camX;
    let ry = camY
    let rz = camZ
    let xv = toOriginX(x)
    let yv = toOriginY(y)
    let zv = focalLength
    let [pr,pg,pb] = [br,bg,bb]

    let contactObject = null

    let heldv = misc.normalize(xv,yv,zv)
    xv = heldv[0]
    yv = heldv[1]
    zv = heldv[2]
    // the camera vector is (the pixel's x pos, pixel's y pos, focal length). This must be normalized.

    while (sdfDist > epsilon && rayLength < renderDist) {
        sdfDist = Infinity
        objects.forEach(o => {
            let heldDist = o.dist(rx,ry,rz)
            if (heldDist < sdfDist) {
                sdfDist = heldDist
                contactObject = o
            }
        }) // go through each object and find the distance to it. If the distance is less than the held distance, replace it. Also hold on to the object it hit, we need it later.
        rx += xv*sdfDist
        ry += yv*sdfDist
        rz += zv*sdfDist
        rayLength += sdfDist
    }

    if (rayLength > renderDist) {
        // didn't hit anything. Deal with this later.
        //console.log(rayLength)
    }
    else {
        // pr = contactObject.r
        // pg = contactObject.g
        // pb = contactObject.b
        let [r,g,b] = [contactObject.r,contactObject.g,contactObject.b]
        let v = contactObject.vectorTo(rx,ry,rz)
        let lightingVal = misc.dotProduct(v,misc.normalize(1,1,-1)) 
        lightingVal *= 45
        r += lightingVal
        b += lightingVal
        b += lightingVal
        //if (lightingVal > 0) {console.log(lightingVal)}
        // pr = misc.interpolate(r,br,rayLength/renderDist) // fade the pixel's color from the background color to the object's color
        // pg = misc.interpolate(g,bg,rayLength/renderDist)
        // pb = misc.interpolate(b,bb,rayLength/renderDist)
        pr = r
        pg = g
        pb = b
    }

    // return rgb values
    return [pr,pg,pb]
    
}



let rgb = []

function render() {
    let oldTime = Date.now()
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

    let renderTime = Date.now() - oldTime
    console.log(`Finished rendering in ${renderTime} milliseconds`)
}

function renderAndUpdate() {
    render()
    camX += + input.d
    camX -= + input.a
    camZ += + input.w
    camZ -= + input.s
    if (input.w) {
        console.log(camZ)
    }
}


setInterval(renderAndUpdate,85)