(() => {
    const iframeElement = document.querySelector("iframe");

    const channel = new BroadcastChannel("code-playground");

    channel.addEventListener("message", ({data}) => {
        switch(data.action) {
            case "RENDER": {
                render(data.payload.type, data.payload.content);
                break;
            }
        }
    });

    function sendMessage(action: string, payload: any = {}) {
        channel.postMessage({
            action,
            payload,
        });
    }

    function render(type: string, html: string) {
        switch(type) {
            case "html": {
                if(iframeElement) {
                    iframeElement.srcdoc = html;
                }
                break;
            }
        }
    }

    function setup(){
        sendMessage("INIT");
    }

    setup();
})()