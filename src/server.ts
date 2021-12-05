import session from "cookie-session"
import express from "express"
import fs from "fs"
import { createServer } from "http"
import path from "path"
import { Liquid } from "liquidjs"
import minecraft from "./minecraft"
import { socketInit } from "./socket"

const app: express.Application = express()
const server = createServer(app)
const engine: Liquid = new Liquid()

app.engine("liquid", engine.express())
app.set("views", path.join(__dirname, "../views"))
app.set("view engine", "liquid")

app.use("/public", express.static(path.join(__dirname, "../public")))
app.use(session({
    name: "session",
    keys: ["7ffe99ff16650c9f4c08"],
    maxAge: 24 * 60 * 60 * 1000
}))
app.use(express.urlencoded({
    extended: true
}))

const mc = new minecraft()

function addRoutes(dir: string) {
    const subDirs = fs.readdirSync(dir)
    subDirs.forEach(sd => {
        const fp = path.resolve(dir, sd)
        if (fs.statSync(fp).isFile()) {
            if (fp.endsWith(".js")) {
                const route = require(fp)
                if (route.default) {
                    route.default(app, mc)
                }
            }
        } else {
            addRoutes(fp)
        }
    })
}

addRoutes(path.join(__dirname, "routes"))

socketInit(server, mc)

export {mc}
export default server