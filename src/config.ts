import fs from "fs"

interface Config {
    cmd: string,
    server: {
        port: number,
        hostname: string
    }
}

const config = JSON.parse(fs.readFileSync("./config.json").toString()) as Config
console.log(config.server.port)
export default config