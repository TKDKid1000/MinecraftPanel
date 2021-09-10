import {spawn, ChildProcessWithoutNullStreams} from "child_process"
import config from "./config.json"
import fs from "fs"

class minecraft {
    
    private _minecraft: ChildProcessWithoutNullStreams
    public get minecraft(): ChildProcessWithoutNullStreams {
        return this._minecraft
    }
    public set minecraft(v: ChildProcessWithoutNullStreams) {
        this._minecraft = v
    }
    private writeStream: fs.WriteStream
    
    startMinecraft(): void {
        fs.writeFileSync("./minecraft.log", "")
        this.writeStream = fs.createWriteStream("./minecraft.log")
        const cmdArray = config.cmd.split(" ")
        const cmdName = cmdArray[0]
        cmdArray.shift()
        const mc = spawn(cmdName, cmdArray, {cwd: "./minecraft"})
        mc.stdout.on("data", data => {
            console.log(data.toString())
            this.writeStream.write(data)
            // fs.readFile("./minecraft.log", function(error, log) {
            //     if (error) {
            //         console.error(error.message)
            //     } else {
            //         fs.writeFile("./minecraft.log", data = data.toString() + log.toString(), function(error) {
            //             if (error) console.error(error.message)
            //         })
            //     }
            // })
        })
        mc.stdin.setDefaultEncoding("utf-8")
        mc.on("close", code => {
            fs.writeFile("./minecraft.log", `Process ended with exit code: ${code}`, function(error) {
                if (error) console.error(error.message)
            })
            this.writeStream.close()
        })
        this._minecraft = mc
    }
}
export default minecraft