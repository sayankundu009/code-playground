import Preview from "./components/Preview";
import Addressbar from "./components/Addressbar";
import { useEffect, useRef } from "react";
import { useFileContents, useFiles } from "../../../../store/selectors/editor";

export default function Browser() {
    const { files, isFilesLoaded } = useFiles();
    const fileContents = useFileContents();

    const channel = useRef<BroadcastChannel | null>(null)
    const previewWindow = useRef<Window | null>(null);

    function sendMessage(action: string, payload: any = {}) {
        channel.current?.postMessage({
            action,
            payload,
        })
    }

    function openPreviewWindow() {
        if (previewWindow.current && !previewWindow.current?.closed) {
            previewWindow.current.focus()
        } else {
            previewWindow.current = window.open("/preview/")
        }
    }

    function reloadPreview() {
        sendMessage("RELOAD")
    }

    useEffect(() => {
        channel.current = new BroadcastChannel("code-playground-preview");

        return () => {
            channel.current?.close();
        }
    }, []);

    useEffect(() => {
        isFilesLoaded && reloadPreview();
    }, [fileContents, files, isFilesLoaded]);

    return (
        <div className="h-full w-full">
            <Addressbar reloadPreview={reloadPreview} openPreviewWindow={openPreviewWindow} />
            {isFilesLoaded && <Preview />}
        </div>
    )
}