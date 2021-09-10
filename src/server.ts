import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import fs from "fs"
import minecraft from "./minecraft"

const app: express.Application = express()
const engine: Liquid = new Liquid()

app.engine("liquid", engine.express())
app.set("views", "./views")
app.set("view engine", "liquid")

app.use("/assets", express.static("./assets"))
app.use(session({
    name: "session",
    keys: ["7ffe99ff16650c9f4c08"],
    maxAge: 24 * 60 * 60 * 1000
}))
app.use(express.urlencoded({
    extended: true
}))

const mc = new minecraft()
mc.startMinecraft()

import _console from "./routes/console";_console(app)
import _status from "./routes/status";_status(app)
import _api_console from "./routes/api/console";_api_console(app)
import _api_sendCommand from "./routes/api/sendCommand";_api_sendCommand(app, mc)
import _api_kill from "./routes/api/kill";_api_kill(app, mc)
import _api_status from "./routes/api/status";_api_status(app)
import _api_restart from "./routes/api/restart";_api_restart(app, mc)

export default app