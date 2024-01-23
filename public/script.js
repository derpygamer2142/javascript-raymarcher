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


function constrain(n,a,b) {
    return Math.min(b, Math.max(a, n))
}


function toneMapRGB(r,g,b) {
    let [q,w,e] = [r/255,g/255,b/255] // microoptimization
    return [
        constrain((q/(q+1))*255*1.85,0,255),
        constrain((w/(w+1))*255*1.85,0,255),
        constrain((e/(e+1))*255*1.85,0,255)
    ] // the 1.85 is an arbitrary value that i think looks nice
}

// most of the vector math relies on the origin being in the center of the screen

const misc = new Misc()
const input = new Input()

let objects = [];
objects.push(new Sphere(0,0,85,65,128,128,128,0.5,175))
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
let focalLength = (WIDTH/2)/Math.tan(misc.toRad(fov/2)) // convert FOV to focal length, as that's what the other formulas use. FOV is more human readable tho
let deltaTime = 0
let heldTime = Date.now()
let speed = 25

let [br,bg,bb] = [7, 237, 218]


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

    let heldv = misc.rotateVector(misc.normalize(xv,yv,zv),camXDir,camYDir)
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
        lightingVal *= 25
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
    deltaTime = (Date.now() - heldTime)/1000
    heldTime = Date.now()
    let oldTime = Date.now()
    render()
    let heldv = misc.normalize((+ input.d) - (+ input.a),(+ input.q) - (+ input.e),(+ input.w) - (+ input.s))
    heldv = misc.rotateVector([heldv[0],heldv[1],heldv[2]],camXDir,camYDir) // convert the wasd input into a vector so it can be easily rotated
    heldv = misc.multVector(heldv[0],heldv[1],heldv[2],deltaTime*speed) // multiply the vector by deltatime
    camX += heldv[0]
    camY += heldv[1]
    camZ += heldv[2] // apply movement
    camXDir -= (+ input.ArrowUp) * deltaTime*speed*2 // for some stupid reason the x and y rotation axises(axices?) are flipped
    camXDir += (+ input.ArrowDown) * deltaTime*speed*2
    camYDir += (+ input.ArrowRight) * deltaTime*speed*2
    camYDir -= (+ input.ArrowLeft) * deltaTime*speed*2
    camXDir = constrain(camXDir,-100,80)

    let fps = 1/deltaTime
    let renderTime = Date.now() - oldTime
    ctx.fillStyle = "black"
    ctx.font = "30px Comic Sans MS"
    ctx.fillText(`Rendered in ${renderTime} milliseconds`,0,HEIGHT*0.9)
    ctx.fillText(`FPS: ${fps.toFixed(3)}`,0,HEIGHT*0.94)
    ctx.fillText(`DeltaTime: ${deltaTime}`,0,HEIGHT*0.98)

}


setInterval(renderAndUpdate,45)