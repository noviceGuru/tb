import { WebSocketServer } from "ws"

const port = 8000

const wsServer = new WebSocketServer({ port })
console.log('tabarnak')

wsServer.on("connection", ws => {
    ws.on("message", message => {
        console.log(JSON.parse(message.toString()))
    })
})
