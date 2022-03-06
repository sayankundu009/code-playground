import FileStructure from "./components/FileStructure";
import { useCallback } from "react";
import { getLanguage } from "../../../../utils";
import { useFileContents, useFiles } from "../../../../store/selectors/editor";
import { setCurrentSelectedFile } from "../../../../store/slices/editor";
import { useDispatch } from "react-redux";
import "./index.css";
import Header from "./components/Header";

export default function FileExplorer() {
    const { files, currentSelectedFile } = useFiles();
    const fileContents = useFileContents();

    const dispatch = useDispatch();

    function getFileContent(key: string) {
        return fileContents[key] || "";
    }

    const onFileSelect = useCallback((file: { name: string, path: string }) => {
        if (currentSelectedFile?.path !== file.path) {
            dispatch(setCurrentSelectedFile({
                name: file.name,
                language: getLanguage(file.name),
                content: getFileContent(file.path),
                path: file.path,
            }));
        }
    }, [fileContents, currentSelectedFile]);

    return (
        <section className="h-full bg-main overflow-hidden">
            <Header />

            <section className="pt-2" style={{ width: "calc(100% + 200px)", userSelect: "none" }}>
                <FileStructure files={files} onFileSelect={onFileSelect} />
            </section>
        </section>
    )
}
