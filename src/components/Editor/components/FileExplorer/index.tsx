import FileStructure from "./components/FileStructure";
import useFileStore from "../../../../store/editor/files"
import { useCallback } from "react";
import { getLanguage } from "../../../../utils";
import "./index.css";

export default function FileExplorer() {
    const { files, fileContents, setCurrentSelectedFile } = useFileStore(state => state);

    function getFileContent(key: string) {
        return fileContents[key] || "";
    }

    const onFileSelect = useCallback((file) => {
        setCurrentSelectedFile({
            name: file.name,
            language: getLanguage(file.name),
            content: getFileContent(file.name),
        });
    }, [fileContents]);

    return (
        <div className="h-full bg-main overflow-hidden" style={{ userSelect: "none" }}>
            <div className="py-4" style={{ width: "calc(100% + 200px)" }}>
                <FileStructure
                    files={files}
                    onFileSelect={onFileSelect}
                />
            </div>
        </div>
    )
}
