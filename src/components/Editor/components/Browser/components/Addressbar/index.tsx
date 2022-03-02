import ExternallinkIcon from "./components/ExternallinkIcon";
import ReloadIcon from "./components/ReloadIcon";
import CrossIcon from "./components/CrossIcon";

type Props = {
    isIframeLoaded: boolean,
    openPreviewWindow: () => void;
    reloadPreview: () => void;
    stopPreviewReload: () => void;
}

export default function Addressbar({ isIframeLoaded, reloadPreview, stopPreviewReload, openPreviewWindow }: Props) {
    function handleReloadEvent() {
        isIframeLoaded ? reloadPreview() : stopPreviewReload()
    }

    return (
        <section className="bg-main text-neutral-content border-b border-gray-600 p-1 flex" style={{ height: "2.1rem" }}>
            <div className="flex">
                <span role="button" className="pl-1 flex flex-col justify-center" title="Reload" onClick={handleReloadEvent}>
                    {isIframeLoaded ? <ReloadIcon /> : <CrossIcon />}
                </span>
            </div>
            <div className="w-full px-2">
                <div className="form-control">
                    <input type="text"
                        value="http://localhost"
                        className="input bg-secondary text-white focus:ring-2 ring-blue-500 w-full"
                        style={{
                            height: "1.5rem"
                        }}
                        readOnly
                    />
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
