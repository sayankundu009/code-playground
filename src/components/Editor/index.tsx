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

import 'react-reflex/styles.css';

import { useEffect } from "react";
import useFileStore from "../../store/editor/files"
import { Structure } from "../../store/editor/files/types"

export default function Editor() {
    const { setFiles, setFileContent, fileContents } = useFileStore(state => state);

    function setupFiles(files: Array<Structure>): Array<Structure> {
        return files.map(file => {
            if (file.type == "folder") {
                return {
                    ...file,
                    children: setupFiles(file.children || []),
                }
            } else {
                const { content, ...restFile } = file;

                setFileContent(file.name, content || "");

                return {
                    ...restFile,
                }
            }
        })
    }

    useEffect(() => {
        fetch("/project.json").then(res => res.json()).then(data => {
            const fileStructure = setupFiles(data);
            
            setFiles(fileStructure);
        });
    }, []);

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
