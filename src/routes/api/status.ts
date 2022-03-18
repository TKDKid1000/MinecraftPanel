import express from "express"
import mcutil from "minecraft-server-util"
import { getMinecraftConfig } from "../../minecraft"

export default function (app: express.Application) {
    app.get("/api/status", (req: express.Request, res: express.Response) => {
        var session = req.session
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        const serverConf = getMinecraftConfig()
        mcutil
            .status(serverConf.address, {
                port: serverConf.port,
                enableSRV: true,
                timeout: 100000,
                protocolVersion: 47
            })
            .then((response) => {
                res.json({
                    status: { response }
                })
            })
            .catch((error) => {
                res.json({ error: "error: " + error.message })
            })
    })
}
