import Hook from "console-feed/lib/Hook";

function createBaseTag() {
    const base = document.createElement("base");

    base.setAttribute("href", `${window.location.origin}/preview/`);

    document.head.prepend(base);
}

function setPageTitle() {
    document.title = document.title ? `${document.title} - Preview` : "Preview";
}

function postMessage(action: string, payload: any = null) {
    channel.postMessage({
        action,
        payload,
    });
}

function setupConsole() {
    const targetConsole = window.console;

    Hook(targetConsole, (log) => {
        try {
            postMessage("CONSOLE", log);
        } catch (err) {
            console.error("Error occurred: Couldn't log this message");
        }
    }, false);
}

const channel = new BroadcastChannel("code-playground-preview");

channel.addEventListener("message", ({ data }) => {
    switch (data.action) {
        case "RELOAD": return window.location.reload();
    }
});

createBaseTag();

setupConsole();

setTimeout(() => {
    setPageTitle();
}, 0);