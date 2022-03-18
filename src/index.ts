import server, { mc } from "./server"

export function startServer(command: string, port: number, hostname?: string) {
    mc.startMinecraft(command)
    server.listen(port, hostname, () => {
        console.log(`Server listening on http://${hostname || "localhost"}:${port}`)
    })
}
export { mc }
