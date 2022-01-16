import { useEffect, useRef, useState } from "react";
import useFileStore from "../../../../store/editor/files"
import { FileContent, Structure } from "../../../../store/editor/files/types";
import { getFileExtension } from "../../../../utils";
import Addressbar from "./components/Addressbar";
import Preview from "./components/Preview";

function constructPath(files: Array<Structure>, path: string = "", pathObject: { [key: string]: string } = {}) {
    files.forEach((file) => {
        if (file.type == "folder") {
            pathObject = constructPath(file.children || [], `${path}/${file.name}`, pathObject)
        } else {
            pathObject[`${path}/${file.name}`] = file.name;
        }
    });

    return pathObject;
}

function constructDataURL({ content = "", extension = "plain" }: { content: string, extension: string }) {
    return `data:text/${extension};base64,${btoa(content)}`
}

export default function Browser() {
    const { files, fileContents } = useFileStore(({ files, fileContents }) => ({ files, fileContents }));
    const channel = useRef<BroadcastChannel | null>(null)
    const previewWindow = useRef<Window | null>(null);

    function sendMessage(action: string, payload: any = {}) {
        channel.current?.postMessage({
            action,
            payload,
        })
    }

    function resolveResource(url: string, files: Array<Structure>, fileContents: FileContent) {
        const pathName = new URL(url).pathname;

        const filePathStructure = constructPath(files);

        const fileName = filePathStructure[pathName];

        if (fileName) {
            const content = fileContents[fileName];
            const extension = getFileExtension(fileName)

            const dataURL = constructDataURL({
                content: content || "",
                extension,
            });

            return dataURL;
        }

        return null;
    }

    function getContent(currentFile = "index.html") {
        const { files, fileContents } = useFileStore.getState();

        if (!fileContents[currentFile]) return;

        const domParser = new DOMParser();

        const doc = domParser.parseFromString(fileContents[currentFile], "text/html");

        Array.from(doc.querySelectorAll("link[rel^='stylesheet']")).map((linkTag) => {
            const href = (linkTag as HTMLLinkElement).href;

            const dataURL = resolveResource(href, files, fileContents);

            if (dataURL) {
                (linkTag as HTMLLinkElement).href = dataURL;
            }
        });

        Array.from(doc.querySelectorAll("script")).map((scriptTag) => {
            const src = (scriptTag as HTMLScriptElement).src;
            const dataURL = resolveResource(src, files, fileContents);

            if (dataURL) {
                (scriptTag as HTMLScriptElement).src = dataURL;
            }
        });

        return doc.documentElement.outerHTML
    }

    function openPreviewWindow() {
        if (previewWindow.current && !previewWindow.current?.closed) {
            previewWindow.current.focus()
        } else {
            previewWindow.current = window.open("/preview/")
        }
    }

    function setupPreview() {
        reloadPreview();
    }

    function reloadPreview() {
        const content = getContent();

        sendMessage("RENDER", {
            type: "html",
            content,
        });
    }

    useEffect(() => {
        channel.current = new BroadcastChannel("code-playground");

        channel.current.addEventListener("message", ({ data }) => {
            switch (data.action) {
                case "INIT": {
                    setupPreview();
                    break;
                }
            }
        });

        return () => {
            channel.current?.close();
        }
    }, []);

    useEffect(() => {
        reloadPreview();
    }, [fileContents, files]);

    return (
        <div className="h-full w-full">
            <Addressbar reloadPreview={reloadPreview} openPreviewWindow={openPreviewWindow} />
            <Preview />
        </div>
    )
}