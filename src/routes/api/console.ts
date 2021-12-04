import express from "express"
import fs from "fs"
import minecraft from "../../minecraft";

export default function(app: express.Application, mc: minecraft) {
    app.get("/api/console", (req: express.Request, res: express.Response) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        res.json({console: mc.getConsole()})
    })
}