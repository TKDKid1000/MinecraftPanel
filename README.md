# MinecraftPanel

A simple minecraft server panel for linux.

## Setup

MinecraftPanel runs in, and is configured in, javascript. You create a `minecraftpanel.js` file containing at minimum a specific javascript function. There are several ways to setup a server.

### Cli

The easiest way to setup a MinecraftPanel project is by using the cli. It only has a couple commands, but they can make creating and running Minecraft servers incredibly easy.

The root command of the cli is simply titled `minecraft`, nothing complex. It can be installed with `npm i -g minecraftpanel`<br>
Here are the 2 commands:

`minecraft init <name>` - Creates a new MinecraftPanel server<br>
This command will ask you several questions including the following:

Server Jar - Paper, Spigot, Vanilla<br>
Server Ram - number<br>
Panel Port - number<br>
Panel Hostname - number<br>

After this, your jar will be auto downloaded, npm dependencies installed, and eula accepted! All you have to do is `minecraft start`

`minecraft start [path]` - Starts a MinecraftPanel server.<br>
This command starts the server in either the current directory, or `path`. You can pass --hide if you want console output.

Reason for using this over npm start? It has just more customization, and is more optimized for the server.

### Manual

The more _difficult_ way is manually setting up the server (it's still not hard though). You just need very basic node.js knowledge.

The advantage of the manual version is that you can add this to an existing project. If you already have a project, ignore the first 2 steps.

1. Create a new directory, name it whatever you want. `cd` into this directory
2. Run `npm init -y` to create a new npm project
3. **Make sure** to set `type: "module"` in package.json
4. Install MinecraftPanel with `npm i --save minecraftpanel`, it is bundled with Typescript types.
5. Import the package with `import minecraftpanel from "minecraftpanel"`
6. Initialize a server with `minecraftpanel.startServer(command, port, hostname)`. Command is run in the `./minecraft/` folder of your project, and should be used to start the Minecraft server.
7. Create a folder (in the root of your project) called `./minecraft/`, put your server jar in there.

## Usage

I have ignored the entire idea of this project until now, but here is the actual usage of the panel.

When you first enter the panel, you will see a screen with a command prompt, a textarea, and a navbar. This is the main area for interacting with the server. This is the place to enter commands, look at chat, op people, ban people, the whole drill.

Clicking on "Status" in the navbar will let you look at a few basic pieces of server info; the server's online status, motd, and player count.
