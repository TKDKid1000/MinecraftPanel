import express from "express"

export default function(app: express.Application) {
    app.get("/", (req: express.Request, res: express.Response) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        res.render("console", {
            title: "Minecraft Panel",
            active: "console"
        })
    })
}