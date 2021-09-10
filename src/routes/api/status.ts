import express from "express"
import fs from "fs"
import Properties from "@js.properties/properties";
import mcutil from "minecraft-server-util"

export default function(app: express.Application) {
    app.get("/api/status", (req: express.Request, res: express.Response) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        fs.readFile("./minecraft/server.properties", function(error, data) {
            if (error) {
                res.json({error: "error: " + error.message})
            } else {
                const serverConf = Properties.parseToEntries(data.toString(), {
                    all: false,
                })
                var serverIp
                var serverPort
                serverConf.forEach(prop => {
                    if (prop.key == "server-ip") serverIp = prop.element ? prop.element : "localhost"
                    if (prop.key == "server-port") serverPort = prop.element ? Number.parseInt(prop.element) : "25565"
                })
                mcutil.status(serverIp, {port: serverPort, enableSRV: true, timeout: 100000, protocolVersion: 47})
                .then(response => {
                    res.json({
                        status: {response}
                    })
                })
                .catch(error => {
                    res.json({error: "error: " + error.message})
                })
            }
        })
    })
}