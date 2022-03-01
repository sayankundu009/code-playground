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
import { setFileContent, setFiles, setIsFilesLoaded } from "../../store/slices/editor";
import { FileContent, StructureList } from "../../types";
import { useFileContents, useFiles } from "../../store/selectors/editor";
import { addToHeadStart, constructPath, getFileExtension, isFilePath, logRequests } from "../../utils";

import 'react-reflex/styles.css';

export default function Editor() {
    const dispatch = useDispatch();
    const fileContentsRef = useRef<FileContent>({});
    const filePaths = useRef<{ [key: string]: string }>({});
    const { files } = useFiles();
    const fileContents = useFileContents();

    function setupProjectFiles() {
        fetch("/projects/get-started.json").then(res => res.json()).then(data => {
            const fileStructure = setupFiles(data);

            dispatch(setFiles(fileStructure))

            dispatch(setIsFilesLoaded(true));
        });
    }

    function setupFiles(files: StructureList): StructureList {
        return files.map(file => {
            if (file.type == "folder") {
                return {
                    ...file,
                    children: setupFiles(file.children || []),
                }
            } else {
                const { content = "", ...restFile } = file;

                dispatch(setFileContent({ name: file.name, content }));

                return {
                    ...restFile,
                }
            }
        })
    }

    function getFileNameFromPath(path: string = "") {
        const isFile = isFilePath(path);

        if (!isFile) path = (new URL("/" + "index.html", "https://test")).pathname;

        return filePaths.current[path] || "";
    }

    function getFileContent(name: string = "") {
        return fileContentsRef.current[name] || null;
    }

    function setupServiceWorkerBroadcastChannel() {
        const serviceWorkerChannel = new BroadcastChannel("service-worker-channel");

        serviceWorkerChannel.addEventListener("message", (event) => {
            const { id, type, payload } = event.data;

            switch (type) {
                case "GET_FILE_CONTENT": {
                    const { path = "/" } = payload;

                    const fileName = getFileNameFromPath(path);

                    let content = getFileContent(fileName);

                    const status = content == null ? 404 : 200;

                    if (content !== null) {
                        const extension = getFileExtension(fileName);

                        switch (extension) {
                            case "html": {
                                content = addToHeadStart(`<script src="/js/inject.js"></script>`, content);
                            }
                        }
                    }

                    logRequests({ path, status });

                    serviceWorkerChannel.postMessage({
                        id,
                        payload: {
                            status,
                            content,
                        }
                    });
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

    useEffect(() => {
        filePaths.current = constructPath(files);
    }, [files]);

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
                        <ReflexElement className="middle-pane" minSize={350}>
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
