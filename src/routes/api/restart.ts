import express from "express"
import minecraft from "../../minecraft"

export default function (app: express.Application, mc: minecraft) {
    app.post("/api/restart", (req: express.Request, res: express.Response) => {
        var session = req.session
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        if (mc.stopped()) {
            mc.startMinecraft()
            res.json({ success: true })
        } else {
            mc.stop()
            if (mc.stopped()) {
                mc.startMinecraft()
                res.json({ success: true })
            } else {
                res.json({ success: false })
            }
        }
    })
}
