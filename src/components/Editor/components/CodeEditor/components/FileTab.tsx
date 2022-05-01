import { SyntheticEvent, useRef } from "react";
import { getFileExtension, getFileName } from "../../../../../utils";
import CloseIcon from "../../../../UI/Icons/Close";
import FileIcon from "../../Explorer/components/FileIcon";
import { FileTab } from "../types";

export default function ({ currentPath, path, openFileIntoEditor, closeFile }: FileTab) {
    const isCurrentlySelected = currentPath === path;
    const activeClass = isCurrentlySelected ? 'active bg-main-darker' : 'bg-secondary-darker text-opacity-50';
    const fileName = getFileName(path);
    const extension = getFileExtension(fileName);
    const tabElement = useRef<HTMLDivElement>(null)

    function handleFileOpen() {
        openFileIntoEditor(path)
    }

    function handleFileClose(event: SyntheticEvent) {
        event.stopPropagation();
        closeFile(path);
    }

    function scrollTabIntoView() {
        if (tabElement.current) {
            tabElement.current.scrollIntoView();
        }
    }

    if (isCurrentlySelected) {
        setTimeout(() => {
            scrollTabIntoView();
        }, 0);
    }

    return (
        <div role="button"
            style={{ userSelect: "none" }}
            className={`text-sm text-white border-r py-2 px-3 border-main editor-header-tab ${activeClass}`}
            onClick={handleFileOpen}
            ref={tabElement}
        >
            <div className="flex">
                <div className="flex items-center">
                    <FileIcon type={extension} /> <span className="pl-1">{fileName}</span>
                </div>
                <div className="flex items-center editor-header-tab-close-button">
                    <button onClick={handleFileClose}>
                        <CloseIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}
