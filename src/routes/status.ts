import express from "express"

export default function(app: express.Application) {
    app.get("/status", (req: express.Request, res: express.Response) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        res.render("status", {
            title: "Minecraft Panel",
            active: "status"
        })
    })
}