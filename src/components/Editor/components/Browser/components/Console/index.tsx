import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import Console from 'console-feed/lib/Component'
import { useEffect, useRef } from "react";
import ClearIcon from "./components/ClearIcon";
import "./index.css";

const CONSOLE_MIN_SIZE = 28;
const CONSOLE_MAX_SIZE = 500;

export default function ({ logs }: { logs: any }) {
    const consolePreviewRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (consolePreviewRef.current) {
            consolePreviewRef.current.scrollTop = consolePreviewRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <ReflexContainer orientation="horizontal" style={{
            position: "absolute",
            top: 0,
            background: "transparent",
            pointerEvents: "none",
        }}>
            <ReflexElement className="browser-pane"></ReflexElement>
            <ReflexSplitter style={{
                pointerEvents: "all",
                position: "relative",
                height: "25px",
                bottom: "-25px",
                background: "transparent",
                border: "none",
            }} />
            <ReflexElement className="console-pane"
                minSize={CONSOLE_MIN_SIZE}
                maxSize={CONSOLE_MAX_SIZE}
                size={CONSOLE_MIN_SIZE}
                style={{
                    pointerEvents: "all"
                }}
            >
                <section className="h-full overflow-hidden editor-console">
                    <header className="bg-main" style={{ height: CONSOLE_MIN_SIZE }}>
                        <h6 className="text-sm text-white p-1 pl-3">Console</h6>
                    </header>
                    <div className="bg-main flex border-t border-main p-1 hidden">
                        <div className="pl-1">
                            <span role="button" className="pl-1 flex flex-col justify-center">
                                <ClearIcon />
                            </span>
                        </div>
                    </div>
                    <main className="editor-console-preview bg-main-darker h-full overflow-auto" ref={consolePreviewRef}>
                        <Console logs={logs} variant="dark" />
                    </main>
                </section>
            </ReflexElement>
        </ReflexContainer>
    )
}
