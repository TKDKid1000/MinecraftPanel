import express from "express"
import minecraft, { getMinecraftConfig } from "../../minecraft"

export default function (app: express.Application, mc: minecraft) {
    app.get("/api/chat", (req: express.Request, res: express.Response) => {
        var session = req.session
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        const mcConsole = mc.getConsole()
        for (var line in mcConsole) {
            var regex: RegExp = new RegExp("[dd:dd:dd]s[Server thread/INFO]:s<\bw{3,16}\b>s")
            if (regex.test(line)) {
                console.log(line.replace(new RegExp("[dd:dd:dd]s[Server thread/INFO]:s"), "$1"))
            }
        }
    })

    app.post("/api/chat", (req: express.Request, res: express.Response) => {
        var session = req.session
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        if (req.body["message"]) {
            mc.sendCommand("say " + req.body["message"] + "\n")
            res.json({ success: true, error: null })
        } else {
            res.json({ success: false, error: "No command provided" })
        }
    })
}
