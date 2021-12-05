import axios from "axios"
import { execSync, spawn } from "child_process"
import cliProgress from "cli-progress"
import {stripIndent} from "common-tags"
import fs, { ReadStream } from "fs"
import inquirer from "inquirer"
import path from "path"
import yargs from "yargs/yargs"

const command = yargs()
    .command(["start [directory]", "run"], "Launches a MinecraftPanel server", yargs => {
        return yargs
            .positional("directory", {
                describe: "Directory of MinceraftPanel server",
                type: "string"
            })
            .option("hide", {
                describe: "Hide Minecraft console output",
                type: "boolean",
                alias: "h",
                default: false
            })
    }, argv => {
        const directory = path.resolve(argv.directory ? argv.directory : process.cwd())
        if (fs.existsSync(path.join(directory))) {
            if (fs.statSync(path.join(directory)).isDirectory()) {
                if (fs.existsSync(path.join(directory, "package.json"))) {
                    const packageJson = JSON.parse(fs.readFileSync(path.join(directory, "package.json")).toString())
                    if (packageJson.main) {
                        console.log("Starting Minecraft server...")
                        const server = spawn("node", [path.join(directory, packageJson.main)], {
                            cwd: directory
                        })
                        process.on("beforeExit", code => {
                            console.log("Ending Minecraft server...")
                            server.kill()
                        })
                        if (!argv.hide) {
                            server.stdout.on("data", data => console.log(data.toString()))
                            server.stderr.on("data", data => console.log(data.toString()))
                        }
                    } else {
                        console.error("There is no main file in package.json!")
                    }
                } else {
                    console.error("The specified directory is not a MinecraftPanel server!")
                }
            } else {
                console.error("The specified path is not a directory!")
            }
        } else {
            console.error("The specified path does not exist!")
        }
    })
    .command(["init <name>", "new"], "Launches a MinecraftPanel server", yargs => {
        return yargs
            .positional("name", {
                describe: "Name of MinecraftPanel server",
                type: "string"
            })
    }, async (argv) => {
        const dir = path.resolve(path.join(process.cwd(), argv.name.replace(" ", "-").toLowerCase()))
        if (fs.existsSync(dir)) {
            console.error("The server directroy already exists!")
            return
        }
        fs.mkdirSync(dir)
        const serverJars = {
            paper: "https://papermc.io/api/v2/projects/paper/versions/1.17.1/builds/391/downloads/paper-1.17.1-391.jar",
            spigot: "https://download.getbukkit.org/spigot/spigot-1.17.1.jar",
            vanilla: "https://launcher.mojang.com/v1/objects/a16d67e5807f57fc4e550299cf20226194497dc2/server.jar"
        }
        try {
            const answers = await inquirer.prompt([
                {
                    type: "checkbox",
                    message: "Select server jar",
                    name: "jar",
                    validate(answer) {
                        if (answer.length === 1) {
                            return true
                        } else {
                            return "You must select only 1 server jar."
                        }
                    },
                    choices: [
                        {
                            name: "Paper - https://papermc.io",
                            short: "Paper",
                            value: "paper"
                        },
                        {
                            name: "Spigot - https://spigotmc.org",
                            short: "Spigot",
                            value: "spigot"
                        },
                        {
                            name: "Vanilla - https://minecraft.net",
                            short: "Vanilla",
                            value: "vanilla"
                        }
                    ]
                },
                {
                    type: "number",
                    message: "Enter server ram",
                    name: "ram",
                    validate(answer) {
                        if (answer % 1 === 0) {
                            return true
                        } else {
                            return "You have to specify a whole number!"
                        }
                    }
                },
                {
                    type: "number",
                    message: "Enter web panel port",
                    name: "port",
                    validate(answer) {
                        if (answer >= 80 && answer <= 65535) {
                            return true
                        } else {
                            return "The specified port is not valid!"
                        }
                    }
                },
                {
                    type: "input",
                    message: "Enter web panel hostname",
                    name: "hostname",
                    validate(answer) {
                        if (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(answer) || answer.toLowerCase() === "localhost") {
                            return true
                        } else {
                            return "The specified hostname is not valid!"
                        }
                    }
                },
                {
                    type: "confirm",
                    message: "By typing 'y' you agree to Mojang's eula - https://account.mojang.com/documents/minecraft_eula",
                    name: "eula"
                }
            ])
            if (!answers.eula) {
                console.log("You need to accept Mojang's eula in order to use MinecraftPanel!")
                return
            }
            const packageJson = {
                name: argv.name.toLowerCase().replace(/[^0-9a-z]/gi, ""),
                version: "0.0.1",
                description: "Minecraft Server made with MinecraftPanel",
                main: "minecraftpanel.js",
                scripts: {
                    start: "node minecraftpanel.js"
                },
                type: "module",
                author: "TKDKid1000",
                license: "MIT",
                dependencies: {
                    minecraftpanel: "latest"
                }
            }
            fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(packageJson, null, 2))
            const mainJsFile = stripIndent`
            import minecraftpanel from "minecraftpanel"
            minecraftpanel.startServer("java -Xmx${answers.ram}G -Xmx${answers.ram}G -jar server.jar nogui", ${answers.port}, "${answers.hostname}")`
            fs.writeFileSync(path.join(dir, "minecraftpanel.js"), mainJsFile)
            fs.mkdirSync(path.join(dir, "minecraft"))
            
            fs.writeFileSync(path.join(dir, "minecraft", "eula.txt"), "eula=true")
            
            console.log(`Downloading ${answers.jar} jar...`)
            const res = await axios(serverJars[answers.jar], {
                responseType: "stream"
            })
            const data = res.data as ReadStream
            
            const jarProgress = new cliProgress.SingleBar({
                format: "{bar} | {percentage}%",
                barCompleteChar: "\u2588",
                barIncompleteChar: "\u2591",
                hideCursor: false
            })
            const jarWriteStream = fs.createWriteStream(path.join(dir, "minecraft", "server.jar"))

            jarProgress.start(100, 0, {
                percentage: 0
            })

            data.pipe(jarWriteStream)

            data.on("data", () => {
                jarProgress.update(Math.ceil((jarWriteStream.bytesWritten/parseInt(res.headers["content-length"]))*100))
            })

            data.on("end", () => {
                jarProgress.stop()
                console.log("Installing npm dependencies...")
                    execSync("npm install", {
                        cwd: dir
                    })
                console.log("You server's files have been created!")
            })

        } catch (err) {
            console.error(err)
        }
    })

export {command}