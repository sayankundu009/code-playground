import Preview from "./components/Preview";
import Addressbar from "./components/Addressbar";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFileContents, useFiles } from "../../../../store/selectors/editor";
import { onIframeReady, PREVIEW_URL_PREFIX, removeTrailingSlash } from "../../../../utils";

export default function Browser() {
    const { files, isFilesLoaded } = useFiles();
    const fileContents = useFileContents();

    const channel = useRef<BroadcastChannel | null>(null)
    const previewWindow = useRef<Window | null>(null);
    const iframe = useRef<HTMLIFrameElement | null>(null);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    const [currentUrlPath, setCurrentUrlPath] = useState("/");

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
            previewWindow.current = window.open(`${PREVIEW_URL_PREFIX}${currentUrlPath}`)
        }
    }

    function setIsIframeLoadEventListener() {
        if (iframe && iframe.current) {
            iframe.current.contentWindow?.addEventListener("unload", handleIframeLoad);
        }
    }

    function handleIframeLoad() {
        if (iframe.current) {
            setIsIframeLoaded(false);

            onIframeReady(iframe.current).then(() => {
                setIsIframeLoaded(true);

                setIsIframeLoadEventListener();
            });

            setTimeout(handlePreviewUrlChange, 0);
        }
    }

    function handlePreviewUrlChange() {
        if (iframe.current) {
            const path = iframe.current.contentWindow?.location.pathname || "";

            const isPreviewPath = path.startsWith(PREVIEW_URL_PREFIX);

            if (isPreviewPath) {
                const normalizedPath = removeTrailingSlash(path.replace(PREVIEW_URL_PREFIX, "") || "/");

                setCurrentUrlPath(normalizedPath);
            }
        }
    }

    function reloadIframe() {
        if (iframe.current && iframe.current.contentWindow) {
            iframe.current.contentWindow.location.reload();
        }
    }

    function reloadPreview() {
        sendMessage("RELOAD");
        reloadIframe();
    }

    function navigateToPreview(path: string) {
        if (iframe.current && iframe.current.contentWindow) {
            iframe.current.contentWindow.location.href = `${PREVIEW_URL_PREFIX}${path}`;
        }
    }

    function handleUrlNavigation(path: string) {
        setCurrentUrlPath(path);
        navigateToPreview(path);
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
                currentUrlPath={currentUrlPath}
                navigateToPreview={handleUrlNavigation}
            />

            {isFilesLoaded && <Preview ref={onIframeMount} />}
        </div>
    )
}