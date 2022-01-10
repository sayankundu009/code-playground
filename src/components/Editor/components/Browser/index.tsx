import { useEffect, useState } from "react";
import useFileStore from "../../../../store/editor/files"
import { Structure } from "../../../../store/editor/files/types";
import { getFileExtension } from "../../../../utils";

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
    const [previewCode, setPreviewCode] = useState("");

    function resolveResource(url: string) {
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

    function setupPreview(currentFile = "index.html") {
        if(!fileContents[currentFile]) return;

        const domParser = new DOMParser();

        const doc = domParser.parseFromString(fileContents[currentFile], "text/html")

        Array.from(doc.querySelectorAll("link[rel^='stylesheet']")).map((linkTag) => {
            const href = (linkTag as HTMLLinkElement).href;

            const dataURL = resolveResource(href);

            if (dataURL) {
                (linkTag as HTMLLinkElement).href = dataURL;
            }
        });

        Array.from(doc.querySelectorAll("script")).map((scriptTag) => {
            const src = (scriptTag as HTMLScriptElement).src;
            const dataURL = resolveResource(src);

            if (dataURL) {
                (scriptTag as HTMLScriptElement).src = dataURL;
            }
        });

        setPreviewCode(doc.documentElement.outerHTML);
    }

    useEffect(() => {
        setupPreview();
    }, [fileContents, files]);

    return (
        <div className="h-full w-full">
            <iframe className="h-full w-full" srcDoc={previewCode}></iframe>
        </div>
    )
}