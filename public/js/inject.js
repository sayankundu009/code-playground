document.write(`<base href="${window.location.origin}/preview/">`);

const channel = new BroadcastChannel("code-playground-preview");

channel.addEventListener("message", ({ data }) => {
    switch (data.action) {
        case "RELOAD": return window.location.reload();
    }
});

setTimeout(() => {
    document.title = document.title ? `${document.title} - Preview` : "Preview";
}, 0);