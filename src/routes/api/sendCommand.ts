import express from "express"
import minecraft from "../../minecraft"

export default function (app: express.Application, mc: minecraft) {
    app.post("/api/sendCommand", (req: express.Request, res: express.Response) => {
        var session = req.session
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        if (req.body["command"]) {
            mc.sendCommand(req.body["command"])
            res.json({ success: true, error: null })
        } else {
            res.json({ success: false, error: "No command provided" })
        }
    })
}
