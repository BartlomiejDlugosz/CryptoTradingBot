const canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d");

const width = canvas.clientWidth
const height = canvas.clientHeight

let numOfPreviousPoints = 24;
const numOfPreviousPoints2 = 50;

let timeDifference

let startTime
let xScale

let priceDifference
let yScale

let minimumPrice
let maximumPrice

let arrayOfPrices
setInterval(() => {
    axios.get("https://api.kraken.com/0/public/OHLC?pair=XBTGBP").then(data => {
        console.log("FETCHING")
        amountOfMoney = 1000
        amountOfBitcoin = 0
        arrayOfPrices = merge(data.data.result.XXBTZGBP)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        generateLine()
        drawMovingAverage()
        console.log(amountOfMoney)
    })
}, 5000);

function convertTimeToX(time) {
    return (time - startTime) * xScale
}

function convertPriceToY(price) {
    return (price - minimumPrice) * yScale
}

function drawPoint(x, y) {
    ctx.fillStyle = "#00FF00";
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

function generateLine() {
    minimumPrice = arrayOfPrices[0][1]
    maximumPrice = arrayOfPrices[0][1]
    timeDifference = arrayOfPrices[arrayOfPrices.length - 1][0] - arrayOfPrices[0][0]

    startTime = arrayOfPrices[0][0]
    xScale = width / timeDifference

    arrayOfPrices.forEach(item => {
        if (item[1] < minimumPrice) minimumPrice = item[1]
        if (item[1] > maximumPrice) maximumPrice = item[1]
    })

    priceDifference = maximumPrice - minimumPrice
    yScale = height / priceDifference

    ctx.fillStyle = "#000000";

    for (let i = 0; i < arrayOfPrices.length - 1; i++) {
        let item = arrayOfPrices[i]
        let nextItem = arrayOfPrices[i + 1]
        drawLine(convertTimeToX(item[0]), convertPriceToY(parseFloat(item[1])),
            convertTimeToX(nextItem[0]), convertPriceToY(parseFloat(nextItem[1])))
    }
}
let largestProfit = 0
let bestPoints = 0
let below = true
let amountOfMoney
let amountOfBitcoin
function drawMovingAverage() {

    let previous = null

    ctx.strokeStyle = "#FF0000";

    for (let i = numOfPreviousPoints; i < arrayOfPrices.length; i++) {
        let item = arrayOfPrices[i]
        let sum = 0
        for (let j = i - numOfPreviousPoints; j < i; j++) {
            sum += parseFloat(arrayOfPrices[j][1])
        }
        let average = sum / numOfPreviousPoints

        if (below && average > item[1]) {
            below = false
            drawPoint(convertTimeToX(item[0]), convertPriceToY(average))
            amountOfBitcoin = amountOfMoney / item[1]
            amountOfMoney = 0
        } else if (!below && average < item[1]) {
            below = true
            drawPoint(convertTimeToX(item[0]), convertPriceToY(average))
            amountOfMoney = amountOfBitcoin * item[1]
            amountOfBitcoin = 0
        }

        if (previous) drawLine(previous.x, previous.y, convertTimeToX(item[0]), convertPriceToY(average))
        previous = { x: convertTimeToX(item[0]), y: convertPriceToY(average), }
    }

    if (amountOfBitcoin) {
        amountOfMoney = amountOfBitcoin * info[info.length - 1][1]
        amountOfBitcoin = 0
    }

    if (amountOfMoney - 1000 > largestProfit) {
        largestProfit = amountOfMoney - 1000
        bestPoints = numOfPreviousPoints
    }
}


function determinePrice(price) {
    let sum = 0
    for (let i = info.length - numOfPreviousPoints; i < info.length; i++) {
        sum += parseFloat(info[i][1])
    }
    let average = sum / numOfPreviousPoints
    if (below && average < price) {
        below = false
        amountOfBitcoin = amountOfMoney / price
        amountOfMoney = 0
    } else if (!below && average > price) {
        below = true
        amountOfMoney = amountOfBitcoin * price
        amountOfBitcoin = 0
    }
    info.push([Math.floor(Date.now() / 1000), price])
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generateLine()
}


// for (let i = 1; i < 50; i++) {
//     amountOfMoney = 1000
//     amountOfBitcoin = 0
//     numOfPreviousPoints = i
//     drawMovingAverage()
// }
// console.log(largestProfit)
// console.log(bestPoints)

previous = null

ctx.strokeStyle = "#FF00FF";

// for (let i = numOfPreviousPoints2; i < arrayOfPrices.length; i++) {
//     let item = arrayOfPrices[i]
//     let sum = 0
//     for (let j = i - numOfPreviousPoints2; j < i; j++) {
//         sum += parseFloat(arrayOfPrices[j][1])
//     }
//     let average = sum / numOfPreviousPoints2
//     if (previous) drawLine(previous.x, previous.y, convertTimeToX(item[0]), convertPriceToY(average))
//     previous = {x: convertTimeToX(item[0]), y: convertPriceToY(average),}
// }