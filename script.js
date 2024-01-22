import Misc from "./misc.js"
import Sphere from "./sphere.js"

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
objects.push(new Sphere(0,0,45,15,255,0,0,0.5,175))
console.log(objects)
let camX = 0
let camY = 0
let camZ = 0
let camXDir = 0
let camYDir = 0
let fov = 135
let renderDist = 500;
let epsilon = 0.01
let resolution = 5
let focalLength = (WIDTH/2)/Math.tan(toRad(fov/2)) // convert FOV to focal length, as that's what the other formulas use. FOV is more human readable tho

const misc = new Misc()



function raymarchPixel(x,y) {
    let rayLength = 0;
    let sdfDist = Infinity
    let rx = camX;
    let ry = camY
    let rz = camZ
    let xv = toOriginX(x)
    let yv = toOriginY(y)
    let zv = focalLength
    let [pr,pg,pb] = [7, 237, 218]

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
        rayLength += sdfDist
    }

    if (rayLength > renderDist) {
        // didn't hit anything. Deal with this later.
        //console.log(rayLength)
    }
    else {
        pr = contactObject.r
        pg = contactObject.g
        pb = contactObject.b
        // pr = misc.interpolate(pr,contactObject.r,(renderDist-rayLength)/rayLength) // fade the pixel's color from the background color to the object's color
        // pg = misc.interpolate(pg,contactObject.g,(renderDist-rayLength)/rayLength)
        // pb = misc.interpolate(pb,contactObject.b,(renderDist-rayLength)/rayLength)
        console.log("bonk")
    }
    // draw the pixel
    ctx.fillStyle = `rgb(${pr},${pg},${pb})`
    ctx.fillRect(x,y,resolution,resolution)
}





function render() {
    ctx.fillStyle = "grey"
    ctx.fillRect(0,0,WIDTH,HEIGHT)
    for (let y = 0; y < HEIGHT; y += resolution) {
        for (let x = 0; x < WIDTH; x += resolution) {
            //console.log(x,y)
            //ctx.fillStyle = "black"
            //ctx.fillRect(x,y,5,5)
            raymarchPixel(x,y)

        }

    }
}
render()