import ExternallinkIcon from "./components/ExternallinkIcon";
import ReloadIcon from "./components/ReloadIcon";
import CrossIcon from "./components/CrossIcon";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

import "./index.css";

type Props = {
    isIframeLoaded: boolean,
    currentUrlPath: string,
    openPreviewWindow: () => void;
    reloadPreview: () => void;
    stopPreviewReload: () => void;
    navigateToPreview: (path: string) => void;
}

export default function Addressbar({ isIframeLoaded, currentUrlPath = "/", reloadPreview, stopPreviewReload, openPreviewWindow, navigateToPreview }: Props) {
    const [urlInput, setUrlInput] = useState(currentUrlPath);

    function handleReloadEvent() {
        isIframeLoaded ? reloadPreview() : stopPreviewReload()
    }

    function handleUrlInput(event: ChangeEvent<HTMLInputElement>) {
        setUrlInput(event.target.value);
    }

    function handleUrlInputSubmit(event: SyntheticEvent){
        event.preventDefault();
        navigateToPreview(urlInput);
    }

    useEffect(() => {
        setUrlInput(currentUrlPath);
    }, [currentUrlPath]);

    return (
        <section className="bg-main text-neutral-content border-b border-gray-600 p-1 flex" style={{ height: "2.1rem" }}>
            <div className="flex">
                <span role="button" className="pl-1 flex flex-col justify-center" title="Reload" onClick={handleReloadEvent}>
                    {isIframeLoaded ? <ReloadIcon /> : <CrossIcon />}
                </span>
            </div>
            <div className="w-full px-2">
                <div className="form-control">
                    <form onSubmit={handleUrlInputSubmit}>
                        <div className="address-bar-section input bg-secondary text-white focus:ring-2 ring-blue-500 w-full flex items-center" style={{ height: "1.5rem" }}  >
                            <span>http://localhost</span>
                            <input type="text"
                                value={urlInput}
                                className="address-bar-input bg-secondary text-white outline-none"
                                style={{ height: "1.5rem" }}
                                onChange={handleUrlInput}
                            />
                        </div>
                    </form>
                </div>
            </div>
            <div className="flex">
                <span role="button" className="flex flex-col justify-center" title="Open in new tab" onClick={openPreviewWindow}>
                    <ExternallinkIcon />
                </span>
            </div>
        </section>
    )
}
