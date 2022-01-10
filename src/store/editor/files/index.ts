import create from 'zustand'
import { File, FileStore, Structure } from "./types"

const useFileStore = create<FileStore>(set => ({
    files: [],
    currentSelectedFile: null,
    fileContents: {},
    setCurrentSelectedFile: (file: File) => set(() => ({ currentSelectedFile: file })),
    setFiles: (fileList: Array<Structure>) => set(() => ({ files: [...fileList] })),
    setFileContent: (key: string, value: string) => set((state) => ({
        fileContents: {
            ...state.fileContents,
            [key]: value,
        }
    })),
}));

export default useFileStore;