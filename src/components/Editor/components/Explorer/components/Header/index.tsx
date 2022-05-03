import DownloadIcon from "../../../../../UI/Icons/Download";
import NewFileIcon from "../../../../../UI/Icons/NewFile";
import NewFolderIcon from "../../../../../UI/Icons/NewFolder";

export default function () {
    return (
        <header className="w-100 text-neutral-content bg-main border-b border-main h-7 flex items-center justify-between">
            <div className="flex-1">
                <h6 className="ml-4 text-white text-sm">Files</h6>
            </div>
            <div className="pr-2 flex-1 flex justify-end">
                <a href="#" className="mx-2" title="New file">
                    <NewFileIcon width="12" height="12"/>
                </a>
                <a href="#" className="mx-2" title="New folder">
                    <NewFolderIcon width="12" height="12"/>
                </a>
                <a href="#" className="mx-2" title="Download project">
                    <DownloadIcon width="12" height="12"/>
                </a>
            </div>
        </header>
    )
}
