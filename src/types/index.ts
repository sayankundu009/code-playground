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
    content: string,
    language: string,
}

export type EditorState = {
    files: StructureList,
    currentSelectedFile: File | null,
    fileContents: FileContent,
    isFilesLoaded: boolean,
}
