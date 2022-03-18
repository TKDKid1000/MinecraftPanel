import "jquery"
import { socket } from "."
function initConsole() {
    socket.on("console message", (message) => {
        const consoleElement = $("#console")
        const scrollMax = consoleElement[0].scrollHeight - consoleElement.outerHeight()
        const current = consoleElement.scrollTop()
        consoleElement.val(consoleElement.val() + "\n" + message)
        if (current >= scrollMax) {
            consoleElement.scrollTop(consoleElement[0].scrollHeight - consoleElement.outerHeight())
        }
    })
    $.getJSON("/api/console", function (data) {
        const consoleValue = (<string[]>data.console).join("\n")
        $("#console").val(consoleValue)
    })
    $(document).keyup((e) => {
        if (e.ctrlKey) {
            switch (e.keyCode) {
                case 67: {
                    e.preventDefault()
                    $.ajax({
                        url: "/api/kill",
                        type: "POST"
                    })
                }
                case 81: {
                    e.preventDefault()
                    $.ajax({
                        url: "/api/restart",
                        type: "POST"
                    })
                }
            }
        }
    })
    $("#command").keyup((e) => {
        if (e.keyCode == 13) {
            if (String($("#command").val()).length > 0) {
                socket.emit("console command", $("#command").val())
                $("#command").val("")
            }
        }
    })
}

export { initConsole }
