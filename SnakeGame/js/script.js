const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")
const size = 30

const initialPosition = {x: 270, y: 270}
let snake = [initialPosition]

const randonNumber = (min, max) => {
    return Math.round(Math.random() * (max-min) + min)
}
const randonPosition = () => {
    const number = randonNumber(0, canvas.width - size)
    return Math.round(number/30) * 30

}

const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

const randonColor = () => {
    const red = randonNumber(0,255)
    const blue = randonNumber(0,255)
    const green = randonNumber(0,255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food ={
    x: randonPosition(),
    y: randonPosition(),
    color: randonColor()
}

let direction , loopId , velocitySnake = 300

const incrementVelocitySnake = () => {
   return velocitySnake = velocitySnake -= 3
}

const drawFood = () => {

    const {x , y , color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x,y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#696969"
    snake.forEach((position, index) =>{
            if(index == snake.length - 1){
            ctx.fillStyle = "#C0C0C0"
        }

        ctx.fillRect(position.x, position.y , size, size)
    })
}

const moveSnake = () => {
    if(!direction) return
    
    const head = snake.at(-1)

    
    if(direction == "right"){
        snake.push({x: head.x + size, y: head.y})
    }
    if(direction == "left"){
        snake.push({x: head.x - size, y: head.y})
    }
    if(direction == "down"){
        snake.push({x: head.x , y: head.y + size})
    }
    if(direction == "up"){
        snake.push({x: head.x, y: head.y - size})
    }
    
    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919a"

   for(let i = 30; i < canvas.width; i += 30){
    ctx.beginPath()
       ctx.lineTo(i, 0)
       ctx.lineTo(i, 600)
       ctx.stroke()
    ctx.beginPath()
       ctx.lineTo(0, i)
       ctx.lineTo(600, i)
       ctx.stroke()

   }
   
}

const chechEat = () => {
    const head = snake.at(-1)

    if(head.x == food.x && head.y == food.y){
        incrementScore()
        incrementVelocitySnake()
        snake.push(head)

        let x = randonPosition()
        let y = randonPosition()


        while (snake.find((position) => position.x == x && position.y ==y)) {
            x = randonPosition()
            y = randonPosition()
        }

        food.x = x
        food.y = y
        food.color = randonColor()
    }
}

const checkCollision = () => {
    const head = snake.at(-1)
    const neckIndex = snake.length - 2
    const canvasEdge = canvas.width - size
    const wallCollision = head.x < 0 || head.x > canvasEdge || head.y < 0 || head.y > canvasEdge
    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })
    if(wallCollision || selfCollision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(3px)"
}

const gameLoop = () => {
    clearInterval(loopId)
    
    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    chechEat()
    checkCollision()
    

  loopId = setTimeout(() =>{
        gameLoop()
    },velocitySnake)

}

gameLoop()


document.addEventListener("keydown", ({key})=>{
    if(key == "d" && direction != "left"){direction = 'right'}
    if(key == "a" && direction != "right"){direction = 'left'}
    if(key == "w" && direction != "down"){direction = 'up'}
    if(key == "s" && direction != "up"){direction = 'down'}
})

buttonPlay.addEventListener("click" , () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
    velocitySnake = 300
    
   
    
})