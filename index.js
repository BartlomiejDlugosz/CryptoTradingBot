const canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d");

const width = canvas.clientWidth
const height = canvas.clientHeight

const numOfPreviousPoints = 10;

const timeDifference = info[info.length - 1][0] - info[0][0]

const startTime = info[0][0]
const xScale = width/timeDifference

let minimumPrice = info[0][1]
let maximumPrice = info[0][1]

info.forEach(item => {
    if (item[1] < minimumPrice) minimumPrice = item[1]
    if (item[1] > maximumPrice) maximumPrice = item[1]
})

const priceDifference = maximumPrice - minimumPrice
const yScale = height/priceDifference

function convertTimeToX(time) {
    return (time - startTime) * xScale
}

function convertPriceToY(price) {
    return (price - minimumPrice) * yScale
}

function drawPoint(x, y) {
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill()
}

function drawLine(x, y, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

ctx.fillStyle = "#000000";

for (let i = 0; i < info.length - 1; i++) {
    let item = info[i]
    let nextItem = info[i + 1]
    // drawPoint(convertTimeToX(item[0]), convertPriceToY(parseFloat(item[1])))
    drawLine(convertTimeToX(item[0]), convertPriceToY(parseFloat(item[1])), 
    convertTimeToX(nextItem[0]), convertPriceToY(parseFloat(nextItem[1])))
}

let previous = null

ctx.strokeStyle = "#FF0000";

for (let i = numOfPreviousPoints; i < info.length; i++) {
    let item = info[i]
    let sum = 0
    for (let j = i - numOfPreviousPoints; j < i; j++) {
        sum += parseFloat(info[j][1])
    }
    let average = sum / numOfPreviousPoints
    if (previous) drawLine(previous.x, previous.y, convertTimeToX(item[0]), convertPriceToY(average))
    previous = {x: convertTimeToX(item[0]), y: convertPriceToY(average),}
}