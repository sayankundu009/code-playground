export type FileStore = {
    files: Array<Structure>,
    currentSelectedFile: File | null,
    fileContents: FileContent,
    setFiles: (fileList: Array<Structure>) => void,
    setCurrentSelectedFile: (file: File) => void,
    setFileContent: (key: string, value: string) => void,
}

export type FileContent = {
    [key: string]: string
}

export type File = {
    name: string,
    content: string,
    language: string,
}

export type Structure = {
    name: string;
    type: "folder" | "file",
    children?: Array<Structure>,
    content?: string
}