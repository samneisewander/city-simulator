//Canvas Garbage!!!
const c_main = document.createElement('canvas')
const c_hotbar = document.createElement('canvas')
const ctx_hotbar = c_hotbar.getContext('2d')
const ctx = c_main.getContext('2d')
document.body.appendChild(c_main)
document.body.appendChild(c_hotbar)
c_main.width = 500
c_main.height = 500
c_main.style.border = '2px solid black'
c_main.isDragging = false
c_hotbar.width = 100
c_hotbar.height = 500
c_hotbar.style.border = '2px solid black'
c_hotbar.isDragging = false
c_hotbar.placing = [false, null]

/* TODO
 - Add building tiles to hotbar
 - Fix dragging main from offscreen
 - Add drag and drop logic to main
 - Add gridlines to map
 - Add money and population counters to main
 - Add money and population production and consumption logic
 - Add random fires that destroy buildings.

    Im an uncle haha lol
*/

//Global Variables!!!
let mapScale = 20 //Dimemsion of map in tiles
let tileScale = c_main.width / mapScale //Width and height of tiles
let origin = {
    "x": c_main.width / 2 - tileScale / 2,
    "y": c_main.height / 2 - tileScale / 2
}
let translation = {
    "x": 0,
    "y": 0
}
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
    draw() {
        if (this.sprite == null) {
            ctx.fillStyle = this.color ? this.color : "gray"
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
        this.color = "red"
    }
}
class House extends Building {
    constructor(x, y) {
        super(x, y)
        this.size = 10
        this.contains = 0
        this.color = "blue"
    }
}
class Highlight {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.color = color
    }
    draw() {
        if (this.sprite == null) {
            ctx.fillStyle = this.color ? this.color : "gray"
            ctx.fillRect(origin.x + (this.x * tileScale), origin.y - (this.y * tileScale), tileScale, tileScale)
        }
        else ctx.drawImage(origin.x + (this.x * tileScale), origin.y - (this.y * tileScale), tileScale, tileScale)
    }
}
let buildings = {
    "0,0": new House(0, 0),
    "1,0": new House(1, 0),
    "0,1": new Factory(0, 1),
    "10,1": new Factory(10, 1),
    "-2,0": new House(-2, 0)
}
let highlight

c_main.addEventListener('click', (e) => {
    //finds tile player just clicked
    //jesus christ up above in heaven have mercy on my soul
    let coords = [Math.floor((1 / tileScale) * (e.offsetX - origin.x)),Math.ceil(-(1 / tileScale) * (e.offsetY - origin.y))]
    let tile = buildings[coords[0].toString() + "," + coords[1].toString()]

    if(c_hotbar.placing[0]) {
        switch(c_hotbar.placing[1]){
            case "house":
                buildings[coords[0].toString() + "," + coords[1].toString()] = new House(coords[0], coords[1])
                if (!e.shiftKey) c_hotbar.placing[0] = false
                break
            case "factory":
                buildings[coords[0].toString() + "," + coords[1].toString()] = new Factory(coords[0], coords[1])
                if (!e.shiftKey) c_hotbar.placing[0] = false
                break
            default:
                console.log("uh oh")
                break
        }
    }
}, false)

c_main.addEventListener('mousedown', (e) => {
    c_main.isDragging = true
    translation.x = e.offsetX
    translation.y = e.offsetY
})

c_main.addEventListener('mousemove', (e) => {
    let tile = buildings[(Math.floor((1 / tileScale) * (e.offsetX - origin.x))).toString() + "," + (Math.ceil(-(1 / tileScale) * (e.offsetY - origin.y))).toString()]

    tile ? highlight = new Highlight(tile.x, tile.y, "rgba(224, 224, 224, 0.8)") : highlight = new Highlight(Math.floor((1 / tileScale) * (e.offsetX - origin.x)), Math.ceil(-(1 / tileScale) * (e.offsetY - origin.y)), "gray")

    if (e.buttons == 1 && c_main.isDragging) {
        deltaX = e.offsetX - translation.x
        deltaY = e.offsetY - translation.y
        origin.x += deltaX
        origin.y += deltaY
        translation.x = e.offsetX
        translation.y = e.offsetY
    }
})

c_main.addEventListener('mouseleave', (e) => {
    c_main.isDragging = false
    highlight = null
})

c_main.addEventListener('mouseup', (e) => {
    c_main.isDragging = false
})

c_main.addEventListener('wheel', (e) => {
    mapScale += e.deltaY/50
    if (mapScale <= 0) mapScale = 2
    tileScale = c_main.width / mapScale
})

ctx_hotbar.beginPath()
ctx_hotbar.fillStyle = "blue"
ctx_hotbar.fillRect(0,0,100,100)
ctx_hotbar.fillStyle = "red"
ctx_hotbar.fillRect(0,100,100,100)

c_hotbar.addEventListener('click', (e) => {
    if (e.offsetY > 0 && e.offsetY < 100) c_hotbar.placing = [!c_hotbar.placing[0], "house"]
    else if (e.offsetY > 100 && e.offsetY < 200) c_hotbar.placing = [!c_hotbar.placing[0], "factory"]
})

let loop = function (timestamp) {
    let deltaTime = timestamp - oldTime
    time += deltaTime
    ctx.clearRect(0, 0, c_main.width, c_main.height)


    if (c_hotbar.placing[0]) gridLines("grid")
    for (i of Object.keys(buildings)) {
        buildings[i].draw()
    }
    if (highlight) highlight.draw()
    requestAnimationFrame(loop)
    oldTime = timestamp
}

requestAnimationFrame(loop)

function gridLines(style) {
    switch (style) {
        case "crosshair":
            ctx.beginPath()
            ctx.moveTo(c_main.width / 2, 0)
            ctx.lineTo(c_main.width / 2, c_main.height)
            ctx.moveTo(0, c_main.height / 2)
            ctx.lineTo(c_main.width, c_main.height / 2)
            ctx.strokeStyle = "2px solid black"
            ctx.stroke()
            break
        case "grid":
            ctx.beginPath()
            for (i = -250; i < 250; i++) {
                ctx.moveTo(tileScale * i + origin.x, 0)
                ctx.lineTo(tileScale * i + origin.x, c_main.height)
            }
            for (i = -250; i < 250; i++) {
                ctx.moveTo(0, tileScale * i + origin.y)
                ctx.lineTo(c_main.width, tileScale * i + origin.y)
            }
            ctx.strokeStyle = "1px solid #cccccc"
            ctx.stroke()
            break
    }
}