import MonacoEditor from "@monaco-editor/react";
import useFileStore from "../../../../store/editor/files"
import { useRef } from "react";
import useDebounce from "../../../../hooks/useDebounce";

export default function CodeEditor() {
    const { currentSelectedFile, setFileContent } = useFileStore(state => ({
        currentSelectedFile: state.currentSelectedFile,
        setFileContent: state.setFileContent,
    }));

    const handleUpdateFileContent = useDebounce((name, value) => {
        setFileContent(name, value)
    }, 500)

    const editorRef = useRef<any | null>(null);

    function editorOnMount(editor: any) {
        editorRef.current = editor;
    }

    function editorOnChange(value: string = "") {
        if (currentSelectedFile) {
            handleUpdateFileContent(currentSelectedFile.name, value)
        }
    }

    return (
        <div className="h-full overflow-hidden">
            {!currentSelectedFile && <>
                <div className="h-full bg-main-darker flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="150" height="150"><path fill="none" d="M0 0h24v24H0z" /><path d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z" fill="rgba(142,142,142,1)" /></svg>
                </div>
            </>}
            <div className="h-full" style={{ display: currentSelectedFile ? "block" : "none" }}>
                <MonacoEditor
                    height="100%"
                    theme="vs-dark"
                    path={currentSelectedFile?.name}
                    language={currentSelectedFile?.language || "html"}
                    value={currentSelectedFile?.content || ""}
                    onMount={editorOnMount}
                    onChange={editorOnChange}
                />
            </div>
        </div>
    )
}
