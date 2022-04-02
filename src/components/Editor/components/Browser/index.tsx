import Preview from "./components/Preview";
import Addressbar from "./components/Addressbar";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFileContents, useFiles } from "../../../../store/selectors/editor";
import { onIframeReady, PREVIEW_URL_PREFIX, removeTrailingSlash } from "../../../../utils";
import Console from "./components/Console";

const CONSOLE_CLEAR_LOG = { method: "log", data: ["%cConsole was cleared", "font-style: italic;color: #8e8e90;"] }

export default function Browser() {
    const { files, isFilesLoaded } = useFiles();
    const fileContents = useFileContents();

    const channel = useRef<BroadcastChannel | null>(null)
    const previewWindow = useRef<Window | null>(null);
    const iframe = useRef<HTMLIFrameElement | null>(null);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    const [currentUrlPath, setCurrentUrlPath] = useState("/");
    const [consoleLogs, setConsoleLogs] = useState<any>([])

    function sendMessage(action: string, payload: any = {}) {
        channel.current?.postMessage({
            action,
            payload,
        })
    }

    function openPreviewWindow() {
        const previewPath = `${PREVIEW_URL_PREFIX}${currentUrlPath}`;

        if (previewWindow.current && !previewWindow.current?.closed) {
            previewWindow.current.focus();

            if (previewWindow.current.location) {
                const windowPathName = previewWindow.current.location.pathname;

                if (windowPathName !== previewPath) {
                    previewWindow.current.location.href = previewPath
                }
            }
        } else {
            previewWindow.current = window.open(previewPath)
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
            
            clearConsole();
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

    function clearConsole(showConsoleClearMessage: boolean = false) {
        setConsoleLogs(showConsoleClearMessage ? [CONSOLE_CLEAR_LOG] : [])
    }

    useEffect(() => {
        channel.current = new BroadcastChannel("code-playground-preview");

        channel.current.addEventListener("message", ({ data }) => {
            const { action, payload } = data;

            switch (action) {
                case "CONSOLE": {
                    if (payload.method === 'clear') {
                        return clearConsole(true);
                    }

                    setConsoleLogs((currLogs: any) => [...currLogs, payload]);
                }
            }
        });

        return () => {
            channel.current?.close();
        }
    }, []);

    useEffect(() => {
        isFilesLoaded && reloadPreview();
    }, [fileContents, files, isFilesLoaded]);

    return (
        <div className="browser-section h-full w-full">
            <Addressbar
                isIframeLoaded={isIframeLoaded}
                reloadPreview={reloadPreview}
                stopPreviewReload={stopPreviewReload}
                openPreviewWindow={openPreviewWindow}
                currentUrlPath={currentUrlPath}
                navigateToPreview={handleUrlNavigation}
            />

            {isFilesLoaded && <Preview ref={onIframeMount} />}

            <Console logs={consoleLogs} />
        </div>
    )
}