import MonacoEditor, { Monaco } from "@monaco-editor/react";
import { useCallback, useEffect, useRef, useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import { useFileContents, useFiles } from "../../../../store/selectors/editor";
import { useDispatch } from "react-redux";
import { setCurrentSelectedFile, setFileContent } from "../../../../store/slices/editor";
import { File } from "../../../../types";
import EditorHeader from "./components/EditorHeader";

import "./index.css";
import { getFileName, getLanguage } from "../../../../utils";

function DefaultPreview() {
    return (
        <div className="h-full bg-main-darker flex justify-center items-center editor-default-preview">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="150" height="150"><path fill="none" d="M0 0h24v24H0z" /><path className="default-icon-path" d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z" fill="rgba(142,142,142,1)" /></svg>
        </div>
    );
}

export default function CodeEditor() {
    const editorRef = useRef<any | null>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const [isEditorMounted, setIsEditorMounted] = useState(false);
    const [openFiles, setOpenFiles] = useState<Array<string>>([]);
    const { currentSelectedFile } = useFiles();
    const fileContents = useFileContents();
    const dispatch = useDispatch();

    function getFileContent(key: string) {
        return fileContents[key] || "";
    }

    const handleUpdateFileContent = useDebounce((path, content) => {
        dispatch(setFileContent({ path, content }))
    }, 500);

    const editorOnMount = useCallback((editor: any, monaco: Monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        editor.onDidChangeModelContent(() => {
            const content = editor.getValue();
            const path = editor.getModel().uri.path;

            handleUpdateFileContent(path, content);
        });

        monacoRef.current.editor.getModels().forEach(model => model.dispose());

        setIsEditorMounted(true);
    }, []);

    function createEditorModel(file: File) {
        const monaco = monacoRef.current;

        if (monaco && file.path) {
            const model = monaco.Uri.file(file.path);

            monaco.editor.createModel(
                getFileContent(file.path),
                file.language,
                model
            );

            return model;
        }

        return null;
    }

    const openFileIntoEditor = useCallback((path: string, shouldUpdateCurrentSelectedFile: boolean = true) => {
        const monaco = monacoRef.current;

        if (monaco) {
            const modelUri = monaco.Uri.file(path);
            editorRef.current.setModel(monaco.editor.getModel(modelUri));

            // TODO: Refactor currentSelectedFile state update 
            shouldUpdateCurrentSelectedFile && dispatch(setCurrentSelectedFile({
                name: getFileName(modelUri.path),
                language: getLanguage(modelUri.path),
                path: modelUri.path,
            }));
        }
    }, [monacoRef, editorRef, currentSelectedFile]);

    const closeFile = useCallback((path: string) => {
        const monaco = monacoRef.current;

        if (monaco) {
            const models = monaco.editor.getModels();
            const length = models.length;
            const currentlyOpenFilePath = currentSelectedFile?.path

            for (let index = 0; index < length; index++) {
                const model = models[index];

                if (model.uri.path === path) {
                    model.dispose();

                    setOpenFiles(openFiles => openFiles.filter(filePath => filePath !== path));

                    if (currentlyOpenFilePath === path) {
                        dispatch(setCurrentSelectedFile(null));
                    }

                    if (length > 1 && currentlyOpenFilePath === path) {
                        const modelIndex = index == 0 ? index + 1 : index - 1;
                        const modelToOpen = models[modelIndex];

                        if (modelToOpen) {
                            openFileIntoEditor(modelToOpen.uri.path);
                        }
                    }

                    break;
                }
            }
        }
    }, [monacoRef, editorRef, currentSelectedFile]);

    useEffect(() => {
        const monaco = monacoRef.current;

        if (isEditorMounted && monaco && currentSelectedFile) {
            const isModelAlreadyExists = monaco.editor.getModels().find(modelItem => modelItem.uri.path === currentSelectedFile.path)

            if (!isModelAlreadyExists) {
                const modelUri = createEditorModel(currentSelectedFile);

                if (modelUri) {
                    editorRef.current.setModel(monaco.editor.getModel(modelUri));
                    setOpenFiles(monaco.editor.getModels().map((modelItem) => modelItem.uri.path));
                }
            } else {
                if (currentSelectedFile.path) {
                    openFileIntoEditor(currentSelectedFile.path, false);
                }
            }
        }
    }, [currentSelectedFile]);

    const shouldShowEditor = isEditorMounted && openFiles.length;

    return (
        <div className="h-full overflow-hidden">
            {!shouldShowEditor && <DefaultPreview />}

            <div className="h-full" style={{ display: shouldShowEditor ? "block" : "none" }}>
                <EditorHeader
                    files={openFiles}
                    currentPath={currentSelectedFile?.path || ""}
                    openFileIntoEditor={openFileIntoEditor}
                    closeFile={closeFile}
                />

                <MonacoEditor
                    options={{ "fontSize": 14 }}
                    height="100%"
                    theme="vs-dark"
                    onMount={editorOnMount}
                />
            </div>
        </div>
    )
}
