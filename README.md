# minecraft-server-panel

A simple minecraft server panel for linux.

This program contains a server backend, and a client frontend. Made in a way for you to write your own frontend code.

You need your own Minecraft [jar](https://launcher.mojang.com/v1/objects/a16d67e5807f57fc4e550299cf20226194497dc2/server.jar) from any source (fabric, spigot, paper, etc).
> **Note:** the status and chat features only work under the standard Mojang based server or a fork of it.

The next step is to edit your command flags. In the config, you can set a command used to start. 

The current one *works*, but might not be for you.
> **Note:** the command always runs in the ./minecraft directory. You must create that folder then move the jar in there.

Once your command flags and the jar are specified, you are basically done. Just simply run `npm install && npm start`

The web server starts in [https://localhost:8082](https://localhost:8082) for you to use. A simple web panel will open up, or dip into `/api` for a more bare-bones rest api.

