const serviceWorkerChannel = new BroadcastChannel("service-worker-channel");

const PREVIEW_URL_PREFIX = "/preview";

function request(type, payload) {
    const id = `${Date.now()}-${Math.random()}`;

    return new Promise(resolve => {
        serviceWorkerChannel.postMessage({ id, type, payload })

        const timer = setTimeout(() => resolve(null), 3000);

        function handler(event) {
            if (event.data.id == id) {
                const { payload } = event.data;
                serviceWorkerChannel.removeEventListener("message", handler);
                clearTimeout(timer);
                resolve(payload);
            }
        }

        serviceWorkerChannel.addEventListener("message", handler);
    });
}

function getFileExtension(filename = "") {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2) || "";
}

function getMimeType(extension) {
    switch (extension) {
        case "css": return "text/css"
        case "js": return "text/javascript"
        default: return "text/html"
    }
}

function getFileMimeType(path = "") {
    return getMimeType(getFileExtension(path));
}

function removeTrailingSlash(path = ""){
    return path.replace(/\/$/, "") || "/";
}

self.addEventListener('install', event => {
    console.log("Installed");
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log("Activate")
});

self.addEventListener('fetch', event => {
    const requestURL = new URL(event.request.url);
    const path = requestURL.pathname;
    const isPreviewPath = path.startsWith(PREVIEW_URL_PREFIX);

    if (isPreviewPath) {
        const normalizedPath = removeTrailingSlash(path.replace(PREVIEW_URL_PREFIX, "") || "/");

        const respond = request("GET_FILE_CONTENT", { path: normalizedPath }).then(data => {
            const content = data ? data.content : null;

            if (!content) {
                return fetch("/static/offline/index.html").then(res => res.text()).then(html => {
                    return new Response(html, {
                        status: 404,
                        headers: { 'Content-Type': "text/html" },
                    });
                })
            }

            return new Response(content, {
                status: 200,
                headers: { 'Content-Type': getFileMimeType(path) },
            })
        });

        event.respondWith(respond);
    } else {
        event.respondWith(fetch(event.request));
    }
});