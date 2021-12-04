import config from "./config"
import server from "./server"

server.listen(config.server.port, config.server.hostname, () => {
    console.log(`Server listening on http://${config.server.hostname}:${config.server.port}`)
})