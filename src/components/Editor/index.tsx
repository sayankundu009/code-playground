import FileExplorer from "./components/FileExplorer";
import CodeEditor from "./components/CodeEditor";
import Activitybar from "./components/Activitybar";
import Navbar from "./components/Navbar";
import Browser from "./components/Browser";

import {
    ReflexContainer,
    ReflexSplitter,
    ReflexElement
} from 'react-reflex';

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setFileContents, setFiles, setIsFilesLoaded } from "../../store/slices/editor";
import { FileContent, StructureList } from "../../types";
import { useFileContents } from "../../store/selectors/editor";
import { addToHeadStart, getFileExtension, isFilePath, logRequests } from "../../utils";

import 'react-reflex/styles.css';

function setupFiles(files: StructureList): { fileStructure: StructureList, fileContentStructure: FileContent } {
    const fileContentStructure: FileContent = {};

    function constructFolderStructure(files: StructureList, path: string = ""): StructureList {
        return files.map(file => {
            if (file.type == "folder") {
                return {
                    ...file,
                    children: constructFolderStructure(file.children || [], `${path}/${file.name}`),
                }
            } else {
                const { content = "", ...restFile } = file;

                fileContentStructure[`${path}/${file.name}`] = content

                return {
                    ...restFile,
                }
            }
        });
    }

    const fileStructure: any = constructFolderStructure(files);

    return { fileStructure, fileContentStructure };
}

export default function Editor() {
    const dispatch = useDispatch();
    const fileContentsRef = useRef<FileContent>({});
    const fileContents = useFileContents();

    function setupProjectFiles() {
        fetch("/projects/get-started.json").then(res => res.json()).then(data => {
            const { fileStructure, fileContentStructure } = setupFiles(data);

            dispatch(setFiles(fileStructure));

            dispatch(setFileContents(fileContentStructure));

            dispatch(setIsFilesLoaded(true));
        });
    }

    function getResourcePath(path: string = "") {
        const isFile = isFilePath(path);

        if (!isFile) path = (new URL(path + "index.html", "https://example.com")).pathname;

        return path;
    }

    function getFileContent(path: string = "") {
        return fileContentsRef.current[path] || null;
    }

    function getFileDetails(path: string = ""): { content: string | null, extension: string } {
        const resourcePath = getResourcePath(path);

        let content = getFileContent(resourcePath);

        const extension = getFileExtension(resourcePath);

        return { content, extension }
    }

    function setupServiceWorkerBroadcastChannel() {
        const serviceWorkerChannel = new BroadcastChannel("service-worker-channel");

        serviceWorkerChannel.addEventListener("message", (event) => {
            const { id, type, payload } = event.data;

            switch (type) {
                case "GET_FILE_CONTENT": {
                    const { path = "/" } = payload;

                    let { content, extension } = getFileDetails(path);

                    const status = content == null ? 404 : 200;

                    if (content !== null) {
                        switch (extension) {
                            case "html": {
                                content = addToHeadStart(`<script src="/js/inject.js"></script>`, content);
                            }
                        }
                    }

                    serviceWorkerChannel.postMessage({
                        id,
                        payload: {
                            status,
                            content,
                        }
                    });

                    logRequests({ path, status });
                }
            }
        });

        return () => {
            serviceWorkerChannel.close();
        }
    }

    useEffect(() => {
        setupProjectFiles();

        const serviceWorkerChannelCleanup = setupServiceWorkerBroadcastChannel();

        return () => {
            serviceWorkerChannelCleanup();
        }
    }, []);

    useEffect(() => {
        fileContentsRef.current = fileContents;
    }, [fileContents]);

    return (
        <section className="flex flex-row">
            <Activitybar />
            <section className="h-screen w-full">
                <Navbar />
                <section style={{ height: "calc(100% - 3rem)" }}>
                    <ReflexContainer orientation="vertical">
                        <ReflexElement className="left-pane" maxSize={250}>
                            <FileExplorer />
                        </ReflexElement>
                        <ReflexSplitter />
                        <ReflexElement className="middle-pane" size={0} minSize={0}>
                            <CodeEditor />
                        </ReflexElement>
                        <ReflexSplitter />
                        <ReflexElement className="right-pane">
                            <Browser />
                        </ReflexElement>
                    </ReflexContainer>
                </section>
            </section>
        </section>
    );
}
