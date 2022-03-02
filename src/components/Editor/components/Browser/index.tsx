import Preview from "./components/Preview";
import Addressbar from "./components/Addressbar";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFileContents, useFiles } from "../../../../store/selectors/editor";
import { onIframeReady } from "../../../../utils";

export default function Browser() {
    const { files, isFilesLoaded } = useFiles();
    const fileContents = useFileContents();

    const channel = useRef<BroadcastChannel | null>(null)
    const previewWindow = useRef<Window | null>(null);
    const iframe = useRef<HTMLIFrameElement | null>(null);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);

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

    function setIsIframeLoadEventListener(){
        if (iframe && iframe.current) {
            iframe.current.contentWindow?.addEventListener("unload", handleIframeLoad);
        }
    }

    function handleIframeLoad() {
        if(iframe.current){
            setIsIframeLoaded(false);

            onIframeReady(iframe.current).then(() => {
                setIsIframeLoaded(true);

                setIsIframeLoadEventListener();
            });
        }
    }

    function reloadPreview() {
        sendMessage("RELOAD");
    }

    function stopPreviewReload() {
        if (iframe && iframe.current) {
            iframe.current.contentWindow?.stop();
            setIsIframeLoaded(true);
        }
    }

    const onIframeMount = useCallback((iframeElement: HTMLIFrameElement) => {
        iframe.current = iframeElement;

        setIsIframeLoadEventListener();
    }, []);

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
            <Addressbar
                isIframeLoaded={isIframeLoaded}
                reloadPreview={reloadPreview}
                stopPreviewReload={stopPreviewReload}
                openPreviewWindow={openPreviewWindow}
            />

            {isFilesLoaded && <Preview ref={onIframeMount}/>}
        </div>
    )
}