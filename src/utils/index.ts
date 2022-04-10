import { StructureList } from "../types";

export const PREVIEW_URL_PREFIX = "/preview";

export function log(...args: any[]) {
    const isDev = import.meta.env.DEV;

    if (isDev) {
        console.log(...args)
    }
}

export function getFileName(path: string = "") {
    return path.split("/").pop() ?? ""
}

export function getFileExtension(name: string = ""): string {
    return name.slice((name.lastIndexOf(".") - 1 >>> 0) + 2) || "";
}

export function isFilePath(pathname: string = ""): boolean {
    const extension = getFileExtension(pathname)

    return Boolean(extension) || false;
}

export function getLanguage(name: string) {
    const extension = getFileExtension(name);

    switch (extension) {
        case "html": return "html";
        case "css": return "css";
        case "js": return "javascript";
        default: return "html"
    }
}

export function debounce(callback: (...args: any[]) => void, delay: number = 400) {
    let timer: ReturnType<typeof setTimeout>;

    let debounced = function (...args: any[]) {
        clearTimeout(timer);

        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    }

    return debounced;
}

export function addToHeadStart(content: string, html: string) {
    const HEAD_TAG = "<head>";

    const headEndIndex = html.indexOf(HEAD_TAG) + HEAD_TAG.length;

    if (headEndIndex < 0) return "<head>" + content + "</head>" + html;

    return html.slice(0, headEndIndex) + content + html.slice(headEndIndex);
}

export function constructPath(files: StructureList, path: string = "", pathObject: { [key: string]: string } = {}) {
    files.forEach((file) => {
        if (file.type == "folder") {
            pathObject = constructPath(file.children || [], `${path}/${file.name}`, pathObject)
        } else {
            pathObject[`${path}/${file.name}`] = file.name;
        }
    });

    return pathObject;
}

export function logRequests({ path, status }: { path: string, status: number }) {
    const color = status == 200 ? "#16a34a" : "#ef4444";

    console.log(`%c${status}%c ${path}`, `color:white;background:${color};padding: 2px;border-radius: 5px`, "color: #fde047;")
}

export function onIframeReady(iframe: HTMLIFrameElement | null) {
    return new Promise<void>((resolve, reject) => {
        const timer = setInterval(() => {
            try {
                if (iframe && iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                    clearInterval(timer);
                    resolve();
                }
            } catch (err) {
                clearInterval(timer);
                console.log(err);
                reject();
            }
        }, 10);
    })
}

export function removeTrailingSlash(path = "") {
    return path.replace(/\/$/, "") || "/";
}

// https://github.com/YannickDot/console.image
export function renderImageInConsole(url: string, scale = 0.4) {
    const img = new Image();

    img.onload = () => {
        const style = `
            display: block !important;
            font-size: ${img.height * scale}px;
            padding: ${Math.floor(img.height * scale / 2)}px ${Math.floor(img.width * scale / 2)}px;
            background: url(${url});
            background-size: ${img.width * scale}px ${img.height * scale}px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
        `;

        console.log('%c ', style);
    }

    img.src = url;
}

export function getLocalStorage(key: string) {
    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) : null;
}

export function setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}