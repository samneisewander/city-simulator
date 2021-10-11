//Canvas Garbage!!!
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
document.body.appendChild(canvas)
canvas.width = 500
canvas.height = 500
canvas.style.border = '2px solid black'

//Global Variables!!!
let mapScale = 20 //Dimemsion of map in tiles
let tileScale = canvas.width / mapScale //Width and height of tiles
let origin = {
    "x": canvas.width / 2 - tileScale / 2,
    "y": canvas.height / 2 - tileScale / 2
}
let translation = {
    "x": 0,
    "y": 0
}
let canvasIsDragging = false
let money = 100
let population = 5
let time = 0
let oldTime = 0

class Building {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.sprite

        this.cost
        this.hitpoints
    }
    draw(color) {
        if (this.sprite == null) {
            ctx.fillStyle = color
            ctx.fillRect(origin.x + (this.x * tileScale), origin.y - (this.y * tileScale), tileScale, tileScale)
        }
        else ctx.drawImage(origin.x + (this.x * tileScale), origin.y - (this.y * tileScale), tileScale, tileScale)
    }
    detectAdjacent(building, radius, type) {
        let data = []
        let adjacent = []


        for (i of adjacent) {
            if (i instanceof type) data.push(i)
        }

    }
}
class Factory extends Building {
    constructor(x, y) {
        super(x, y)
        this.income = 10// $/hour at peak
        this.size = 10// # People that can work here
        this.workforce = 0// # People here currently
    }
}
class House extends Building {
    constructor(x, y) {
        super(x, y)
        this.size = 10
        this.contains = 0
    }
}
let buildings = {
    "0,0": new House(0, 0),
    "1,0": new House(1, 0),
    "0,1": new House(0, 1),
    "10,1": new House(10, 1),
    "-2,0": new House(-2, 0)
}

canvas.addEventListener('click', (e) => {
    //finds tile player just clicked
    //jesus christ up above in heaven have mercy on my soul
    let tile = buildings[(Math.floor((1 / tileScale) * (e.offsetX - origin.x))).toString() + "," + (Math.ceil(-(1 / tileScale) * (e.offsetY - origin.y))).toString()]

}, false)

canvas.addEventListener('mousedown', (e) => {
    translation.x = e.offsetX
    translation.y = e.offsetY
})

canvas.addEventListener('mousemove', (e) => {
    if (e.buttons == 1) {
        deltaX = e.offsetX - translation.x
        deltaY = e.offsetY - translation.y
        origin.x += deltaX
        origin.y += deltaY
        translation.x = e.offsetX
        translation.y = e.offsetY
    }
})

canvas.addEventListener('wheel', (e) => {
    mapScale += e.deltaY/50
    if (mapScale == 0) mapScale += 2
    tileScale = canvas.width / mapScale
})

let loop = function (timestamp) {
    let deltaTime = timestamp - oldTime
    time += deltaTime
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (i of Object.keys(buildings)) {
        buildings[i].draw("red")
    }
    requestAnimationFrame(loop)
    oldTime = timestamp
}

requestAnimationFrame(loop)

function gridLines(style) {
    switch (style) {
        case "crosshair":
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 0)
            ctx.lineTo(canvas.width / 2, canvas.height)
            ctx.moveTo(0, canvas.height / 2)
            ctx.lineTo(canvas.width, canvas.height / 2)
            ctx.strokeStyle = "2px solid black"
            ctx.stroke()
            break
        case "grid":
            ctx.beginPath()
            for (i = 0; i < mapScale + 1; i++) {
                ctx.moveTo(tileScale * i - tileScale / 2, 0)
                ctx.lineTo(tileScale * i - tileScale / 2, canvas.height)
            }
            for (i = 0; i < mapScale + 1; i++) {
                ctx.moveTo(0, tileScale * i - tileScale / 2)
                ctx.lineTo(canvas.width, tileScale * i - tileScale / 2)
            }
            ctx.strokeStyle = "1px solid #cccccc"
            ctx.stroke()
            break
    }

}