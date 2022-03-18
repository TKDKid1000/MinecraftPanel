import http from "http"
import { Server } from "socket.io"
import minecraft from "./minecraft"

function socketInit(server: http.Server, mc: minecraft) {
    const io = new Server(server)
    io.on("connection", (socket) => {
        mc.on("console", (message) => {
            socket.emit("console message", message)
        })
        socket.on("console command", (command) => {
            mc.sendCommand(command)
        })
    })
    return io
}

export { socketInit }
