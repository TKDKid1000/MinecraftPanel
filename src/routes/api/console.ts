import express from "express"
import fs from "fs"

export default function(app: express.Application) {
    app.get("/api/console", (req: express.Request, res: express.Response) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        fs.readFile("./minecraft.log", function(error, log) {
            if (error) {
                console.error(error.message)
                res.json({console: "error: " + error.message})
            } else {
                res.json({console: log.toString()})
            }
        })
    })
}