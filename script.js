//Canvas Garbage!!!
const c_main = document.createElement('canvas')
const c_hotbar = document.createElement('canvas')
const ctx_hotbar = c_hotbar.getContext('2d')
const ctx = c_main.getContext('2d')
let info = document.getElementById("info")
let gameDiv = document.getElementById("game")
let itemBox = document.getElementById("items")
let header = document.getElementById("info-h1")
game.appendChild(c_main)
game.appendChild(c_hotbar)
c_main.width = 500
c_main.height = 500
c_main.style.border = '2px solid black'
c_main.isDragging = false
c_hotbar.width = 100
c_hotbar.height = 500
c_hotbar.style.border = '2px solid black'
c_hotbar.isDragging = false
c_hotbar.placing = [false, null]
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

/* TODO
    - Fix how the info screen looks lol
    - I made a change to the code

    BUGS
 
*/

//time
let time = 0
let oldTime = 0
let gameSpeed = 2000 //ms in an ingame hour
let percentOfHour = (time % gameSpeed) / gameSpeed
let hoursPassed = 0//how many total hours have passed
let timeOfDay = 0//hour of day in military format
let daysPassed = 0//how many total days have passed
let isMorning = true

//game stats
let population
let populationTicker = 10
let money = 10

//classes
class Building {
    constructor(x, y, cost) {
        this.x = x
        this.y = y
        this.sprite

        this.cost = cost
        this.hitpoints
    }
    draw() {
        if (this.sprite == null) {
            ctx.fillStyle = this.color ? this.color : "gray"
            ctx.fillRect(origin.x + (this.x * tileScale), origin.y - (this.y * tileScale), tileScale, tileScale)
        }
        else ctx.drawImage(origin.x + (this.x * tileScale), origin.y - (this.y * tileScale), tileScale, tileScale)
    }
    detectAdjacent(range, type) {
        let data = []
        let adjacent = []
        //ry and rx: coordinates relative to target
        for (let ry = -range; ry <= range; ry++) {
            for (let rx = -range; rx <= range; rx++) {
                if (buildings[(this.x + rx).toString() + "," + (this.y + ry).toString()]) adjacent.push(buildings[(this.x + rx).toString() + "," + (this.y + ry).toString()])
            }
        }
        if (type) {
            for (i of adjacent) {
                if (i instanceof type) data.push(i)
            }
        }
        else data = adjacent
        return data
    }
}
class Factory extends Building {
    constructor(x, y) {
        super(x, y, 10)
        this.income = 1.5 // $/hour at peak
        this.size = 10 // # People that can work here
        this.workforce = [] //People that work here
        this.hours = [8, 16] //working hours (time ranges from 0 to 23, inclusive)
        this.color = "red"
    }
}
class House extends Building {
    constructor(x, y) {
        super(x, y, 10)
        this.size = 10
        this.housing = []
        this.color = "blue"
        this.range = 1
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
            ctx.fillStyle = this.color ? this.color : "#e8e8e8"
            ctx.fillRect(origin.x + (this.x * tileScale), origin.y - (this.y * tileScale), tileScale, tileScale)
        }
        else ctx.drawImage(origin.x + (this.x * tileScale), origin.y - (this.y * tileScale), tileScale, tileScale)
    }
}
class Person {
    constructor(sex, job) {
        this.sex = sex ? sex : pickRandom(["male", "female"])
        this.name = generateName(sex)
        this.job = job ? job : "unemployed"
    }
}

//buildings
let buildings = {
    "0,0": new House(0, 0)
}
let highlight
for (i = 0; i < buildings["0,0"].size; i++) {
    buildings["0,0"].housing.push(new Person())
}

//listeners
c_main.addEventListener('click', (e) => {
    //finds tile player just clicked
    //jesus christ up above in heaven have mercy on my soul
    let coords = [Math.floor((1 / tileScale) * (e.offsetX - origin.x)), Math.ceil(-(1 / tileScale) * (e.offsetY - origin.y))]
    let tile = buildings[coords[0].toString() + "," + coords[1].toString()]
    if (c_hotbar.placing[0] && !tile) {
        let build
        switch (c_hotbar.placing[1]) {
            case "house":
                build = new House(coords[0], coords[1])
                if (!e.shiftKey) c_hotbar.placing[0] = false
                break
            case "factory":
                build = new Factory(coords[0], coords[1])
                if (!e.shiftKey) c_hotbar.placing[0] = false
                break
            default:
                console.log("uh oh")
                break
        }
        if (money >= build.cost) {
            money -= build.cost
            highlight = new Highlight(coords[0], coords[1], "rgba(224, 224, 224, 0.8)")
            buildings[coords[0].toString() + "," + coords[1].toString()] = build
        }
    }
    if (tile) displayInfo(tile)
    e.preventDefault()
}, false)

c_main.addEventListener('mousedown', (e) => {
    c_main.isDragging = true
    translation.x = e.offsetX
    translation.y = e.offsetY
})

c_main.addEventListener('mousemove', (e) => {
    let tile = buildings[(Math.floor((1 / tileScale) * (e.offsetX - origin.x))).toString() + "," + (Math.ceil(-(1 / tileScale) * (e.offsetY - origin.y))).toString()]

    tile ? highlight = new Highlight(tile.x, tile.y, "rgba(224, 224, 224, 0.8)") : highlight = new Highlight(Math.floor((1 / tileScale) * (e.offsetX - origin.x)), Math.ceil(-(1 / tileScale) * (e.offsetY - origin.y)), "#dbdbdb")

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
    mapScale += e.deltaY / 50
    if (mapScale <= 0) mapScale = 2
    tileScale = c_main.width / mapScale
})

document.body.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "Escape":
            if (c_hotbar.placing[0]) c_hotbar.placing[0] = false
            break
    }
})

//the fucking hotbar.
ctx_hotbar.beginPath()
ctx_hotbar.fillStyle = "blue"
ctx_hotbar.fillRect(0, 0, 100, 100)
ctx_hotbar.fillStyle = "red"
ctx_hotbar.fillRect(0, 100, 100, 100)

//hotbar listeners
c_hotbar.addEventListener('click', (e) => {
    if (e.offsetY > 0 && e.offsetY < 100) c_hotbar.placing = [!c_hotbar.placing[0], "house"]
    else if (e.offsetY > 100 && e.offsetY < 200) c_hotbar.placing = [!c_hotbar.placing[0], "factory"]
})

//functions
let loop = function (timestamp) {
    let deltaTime = timestamp - oldTime
    time += deltaTime
    percentOfHour = (time % gameSpeed) / gameSpeed
    hoursPassed = Math.floor(time / gameSpeed) //how many total hours have passed
    timeOfDay = hoursPassed % 24 //hour of day in military format
    isMorning = timeOfDay < 12 ? true : false
    daysPassed = Math.floor(hoursPassed / 24) //how many total days have passed

    let addPerson = Math.floor(populationTicker) - population > 0 ? true : false
    let populationUp = [false, false] //flag to check if there is empty housing and empty employment

    population = Math.floor(populationTicker) //pop rounded to a whole #
    ctx.clearRect(0, 0, c_main.width, c_main.height)

    if (c_hotbar.placing[0]) gridLines("grid")
    for (i of Object.keys(buildings)) {
        let target = buildings[i]
        switch (target.constructor.name) {
            case "House":
                let adjacentFactories = target.detectAdjacent(target.range, Factory)
                //checks if there are idle people that can be employed at nearby Factories. If so, it employs them.
                let unemployed = []
                for (let element of target.housing) {
                    if (element.job == "unemployed") unemployed.push(element)
                }
                if (unemployed.length > 0) {
                    for (factory of adjacentFactories) {
                        if (factory.workforce.length < factory.size) {
                            let toEmploy = unemployed.splice(0, factory.size - factory.workforce.length)
                            for (let worker of toEmploy) {
                                factory.workforce.push(worker)
                                worker.job = factory
                            }
                        }
                    }
                }
                if (target.housing.length < target.size) {
                    populationUp[0] = true
                    if (addPerson) {
                        target.housing.push(new Person())
                        addPerson = false
                    }
                }
                break
            case "Factory":
                if (timeOfDay >= target.hours[0] && timeOfDay < target.hours[1]) {
                    money += ((deltaTime % gameSpeed) / gameSpeed) * (target.workforce.length / target.size) * target.income
                }
                if (target.workforce.length < target.size) populationUp[1] = true
        }
        target.draw()
    }
    if (populationUp[0] == true && populationUp[1] == true) populationTicker += ((deltaTime % gameSpeed) / gameSpeed)
    if (highlight) highlight.draw()

    ctx.fillStyle = "black"
    ctx.font = "15px 'Roboto Mono', monospace"
    ctx.fillText("Population: " + population.toString() + "   Pizza: $" + money.toFixed(2), c_main.width - 270, 30)
    ctx.fillText("Time: " + (isMorning ? (timeOfDay + 1).toString() + " AM" : (timeOfDay - 11).toString() + " PM"), 10, 30)
    requestAnimationFrame(loop)
    oldTime = timestamp
}

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

function displayInfo(tile) {
    //this implementation is very non-specific and isnt based on a per-value basis. a better implementation would be value specific formatting which would take some constant management to uphold, especially as the number of buildings increases. this is a polish thing that isnt really a todo if its just developers using it as a debug tool.

    let type = tile.constructor.name
    let keys = Object.keys(tile)

    header.innerHTML = type

    removeAllChildNodes(itemBox)
    for (let key of keys) {
        let valid = ["size", "housing", "range", "hours", "income", "workforce"]
        if (valid.includes(key)) {
            let value = tile[key]
            let element = document.createElement('div')
            if (typeof value !== "object") element.innerHTML = capitalize(key) + ": " + value
            else {
                element.innerHTML = capitalize(key) + ":"
                for (i of value) {
                    let constructor
                    try {
                        constructor = i.constructor.name
                    } catch (error) {
                        constructor = null
                    }
                    switch (constructor) {
                        case 'Person':
                            element.innerHTML += " " + i.name + ","
                            break
                        case 'Number':
                            element.innerHTML += " " + i + ","
                            break
                    }
                }
                element.innerHTML = element.innerHTML.substring(0, element.innerHTML.length - 1)
            }
            itemBox.appendChild(element)
        }
    }
}

function capitalize(s){
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

requestAnimationFrame(loop)