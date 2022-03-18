import "./sass/main"
import { initConsole } from "./console"
import { initStatus } from "./status"
import { io } from "socket.io-client"

const socket = io()

export { initConsole, initStatus, socket }
