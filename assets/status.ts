import "jquery"

function initStatus() {
    setInterval(async () => {
        $.getJSON("/api/status", function(data) {
            try {
                if (data.error) {
                    $("#status").text("Server Offline").addClass("server-offline").removeClass("server-online")
                    $("#motd").text("N/A").addClass("server-offline")
                    $("#players").text("N/A").addClass("server-offline")
                } else {
                    $("#status").text("Server Online").removeClass("server-offline").addClass("server-online")
                    const response = data.status.response
                    $("#motd").text(response.description.descriptionText).removeClass("server-offline")
                    $("#players").text(`${response.onlinePlayers}/${response.maxPlayers}`).removeClass("server-offline")
                }
            } catch (e) {}
        })
    }, 100)
}

export {initStatus}