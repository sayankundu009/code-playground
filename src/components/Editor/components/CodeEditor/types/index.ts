export type EditorHeader = {
    files?: Array<string>;
    currentPath: string;
    openFileIntoEditor: (path: string) => void;
    closeFile: (path: string) => void;
}

export type FileTab = {
    currentPath: string;
    path: string;
    openFileIntoEditor: (path: string) => void;
    closeFile: (path: string) => void;
}