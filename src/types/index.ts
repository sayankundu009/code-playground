export type Structure = {
    name: string;
    type: "folder" | "file",
    children?: StructureList,
    content?: string
}

export type StructureList = Array<Structure>

export type FileContent = {
    [key: string]: string
}

export type File = {
    name: string,
    language: string,
    path?: string
}

export type EditorState = {
    files: StructureList,
    currentSelectedFile: File | null,
    currentSelectedPath: string,
    fileContents: FileContent,
    isFilesLoaded: boolean,
}
