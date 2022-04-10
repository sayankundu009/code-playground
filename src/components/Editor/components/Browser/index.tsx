import Preview from "./components/Preview";
import Addressbar from "./components/Addressbar";
import Console from "./components/Console";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFileContents, useFiles } from "../../../../store/selectors/editor";
import { getLocalStorage, onIframeReady, PREVIEW_URL_PREFIX, removeTrailingSlash, setLocalStorage } from "../../../../utils";

const CONSOLE_CLEAR_LOG = { method: "log", data: ["%cConsole was cleared", "font-style: italic;color: #8e8e90;"] }
const CLEAR_CONSOLE_ON_RELOAD_LOCAL_STORAGE_KEY = "clear-console-on-reload";

export default function Browser() {
    const { files, isFilesLoaded } = useFiles();
    const fileContents = useFileContents();

    const channel = useRef<BroadcastChannel | null>(null)
    const previewWindow = useRef<Window | null>(null);
    const iframe = useRef<HTMLIFrameElement | null>(null);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    const [currentUrlPath, setCurrentUrlPath] = useState("/");
    const [consoleLogs, setConsoleLogs] = useState<any>([]);
    const [clearConsoleOnReload, setClearConsoleOnReload] = useState<boolean>(true);
    const clearConsoleOnReloadRef = useRef<boolean>(true);

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

            if (clearConsoleOnReloadRef.current) {
                clearConsole();
            }
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

    function setupClearConsoleOnReload() {
        const shouldClearOnReload = getLocalStorage(CLEAR_CONSOLE_ON_RELOAD_LOCAL_STORAGE_KEY);

        if(shouldClearOnReload !== null){
            setClearConsoleOnReloadValues(Boolean(shouldClearOnReload));
        }
    }

    function setClearConsoleOnReloadValues(shouldClearOnReload: boolean) {
        setClearConsoleOnReload(shouldClearOnReload);
        clearConsoleOnReloadRef.current = shouldClearOnReload;
    }

    const clearConsole = useCallback((showConsoleClearMessage: boolean = false) => {
        setConsoleLogs(showConsoleClearMessage ? [CONSOLE_CLEAR_LOG] : [])
    }, []);

    const onIframeMount = useCallback((iframeElement: HTMLIFrameElement) => {
        iframe.current = iframeElement;

        setIsIframeLoadEventListener();
    }, []);

    const handleClearConsoleOnReloadInput = useCallback((shouldClearOnReload: boolean) => {
        setClearConsoleOnReloadValues(shouldClearOnReload);
        setLocalStorage(CLEAR_CONSOLE_ON_RELOAD_LOCAL_STORAGE_KEY, shouldClearOnReload);
    }, []);

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

        setupClearConsoleOnReload();

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

            <Console
                logs={consoleLogs}
                clearConsole={clearConsole}
                clearConsoleOnReload={clearConsoleOnReload}
                clearConsoleOnReloadInput={handleClearConsoleOnReloadInput}
            />
        </div>
    )
}