import FileExplorer from "./components/FileExplorer";
import Header from "./components/Header";
import { useCallback, useEffect } from "react";
import { getLanguage } from "../../../../utils";
import { useFileContents, useFiles } from "../../../../store/selectors/editor";
import { setCurrentSelectedFile, setCurrentSelectedPath } from "../../../../store/slices/editor";
import { useDispatch } from "react-redux";
import "./index.css";

export default function Explorer() {
    const { files, currentSelectedFile, currentSelectedPath } = useFiles();

    const dispatch = useDispatch();

    const onFileSelect = useCallback((file: { name: string, path: string, type?: string }) => {
        if (!file.type) return;

        if (file.type === "file") {
            dispatch(setCurrentSelectedFile({
                name: file.name,
                language: getLanguage(file.name),
                path: file.path,
            }));
        } else if (file.type === "folder") {
            dispatch(setCurrentSelectedPath(file.path || ""));
        }
    }, []);

    useEffect(() => {
        dispatch(setCurrentSelectedPath(currentSelectedFile?.path || ""));
    }, [currentSelectedFile]);

    return (
        <section className="h-full bg-main overflow-hidden">
            <Header />

            <section className="pt-2 file-explorer" style={{ width: "calc(100% + 200px)", userSelect: "none" }}>
                <FileExplorer files={files} onFileSelect={onFileSelect} selectedFilePath={currentSelectedPath} />
            </section>
        </section>
    );
}
