import {spawn, ChildProcessWithoutNullStreams} from "child_process"
import fs from "fs"
import path from "path"
import Properties from "@js.properties/properties"
import { EventEmitter } from "events"

class Minecraft extends EventEmitter {
    
    private minecraft: ChildProcessWithoutNullStreams
    private minecraftLog: string[]
    private command: string

    constructor(command?: string) {
        super()
        this.command = command
        process.on("exit", event => {
            if (!this.stopped()) {
                this.minecraft.kill()
            }
        })
    }
    
    startMinecraft(command?: string): void {
        if (command) this.command = command
        const cmdArray = this.command.split(" ")
        const cmdName = cmdArray[0]
        this.minecraftLog = []
        cmdArray.shift()
        this.minecraft = spawn(cmdName, cmdArray, {cwd: "minecraft"})
        this.minecraft.stdout.on("data", data => {
            console.log(data.toString())
            this.minecraftLog.push(data.toString())
            this.emit("console", data.toString())
        })
        this.minecraft.stderr.on("data", data => {
            console.log(data.toString())
            this.minecraftLog.push(data.toString())
            this.emit("console", data.toString())
        })
        this.minecraft.stdin.setDefaultEncoding("utf-8")
        this.minecraft.on("close", code => {
            this.minecraftLog.push(`Process ended with exit code: ${code}`)
        })
    }

    getConsole(): string[] {
        return this.minecraftLog
    }

    sendCommand(command: string) {
        this.minecraft.stdin.write(command+"\n")
    }

    stopped(): boolean {
        return this.minecraft.killed
    }

    stop() {
        this.minecraft.kill()
    }
}

function getMinecraftConfig(): MinecaftConfig {
    const data = fs.readFileSync("./minecraft/server.properties")
    const properties = Properties.parseToEntries(data.toString(), {
        all: false,
    })
    const config: MinecaftConfig = {
        address: null,
        port: null
    }
    properties.forEach(prop => {
        if (prop.key == "server-ip") config.address = prop.element ? prop.element : "localhost"
        if (prop.key == "server-port") config.port = prop.element ? Number.parseInt(prop.element) : 25565
    })
    return config
}

interface MinecaftConfig {
    address: string,
    port: number
}

export default Minecraft
export {getMinecraftConfig, MinecaftConfig}