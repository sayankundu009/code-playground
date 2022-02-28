import FileStructure from "./components/FileStructure";
import { useCallback } from "react";
import { getLanguage } from "../../../../utils";
import { useFileContents, useFiles } from "../../../../store/selectors/editor";
import { setCurrentSelectedFile } from "../../../../store/slices/editor";
import { useDispatch } from "react-redux";
import "./index.css";

export default function FileExplorer() {
    const { files } = useFiles();
    const fileContents = useFileContents();

    const dispatch = useDispatch();

    function getFileContent(key: string) {
        return fileContents[key] || "";
    }

    const onFileSelect = useCallback((file) => {
        dispatch(setCurrentSelectedFile({
            name: file.name,
            language: getLanguage(file.name),
            content: getFileContent(file.name),
        }));
    }, [fileContents]);

    return (
        <div className="h-full bg-main overflow-hidden" style={{ userSelect: "none" }}>
            <div className="py-4" style={{ width: "calc(100% + 200px)" }}>
                <FileStructure files={files} onFileSelect={onFileSelect} />
            </div>
        </div>
    )
}
