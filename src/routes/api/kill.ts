import express from "express"
import minecraft from "../../minecraft"

export default function (app: express.Application, mc: minecraft) {
    app.post("/api/kill", (req: express.Request, res: express.Response) => {
        var session = req.session
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        mc.stop()
        if (mc.stopped()) {
            res.json({ success: true })
        } else {
            res.json({ success: false })
        }
    })
}
