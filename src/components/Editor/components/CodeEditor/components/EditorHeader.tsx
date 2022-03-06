import { EditorHeader } from "../types";
import FileTab from "./FileTab";

export default function ({ files = [], currentPath, openFileIntoEditor, closeFile }: EditorHeader) {
    return (
        <section className="editor-header bg-main">
            <div className="editor-header-tabs-section">
                {files.map((path) => (
                    <FileTab
                        key={path}
                        path={path}
                        currentPath={currentPath}
                        openFileIntoEditor={openFileIntoEditor}
                        closeFile={closeFile}
                    />
                ))}
            </div>
        </section>
    )
}
