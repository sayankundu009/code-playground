import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EditorState, File, FileContent, StructureList } from '../../../types';

const initialState: EditorState = {
    files: [],
    currentSelectedFile: null,
    currentSelectedPath: "",
    fileContents: {},
    isFilesLoaded: false,
}

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setCurrentSelectedFile(state, action: PayloadAction<File | null>) {
            state.currentSelectedFile = action.payload;
        },
        setCurrentSelectedPath(state, action: PayloadAction<string>) {
            state.currentSelectedPath = action.payload || "";
        },
        setFiles(state, action: PayloadAction<StructureList>) {
            state.files = [...action.payload];
        },
        setFileContent(state, action: PayloadAction<{ path: string, content: string }>) {
            const { path, content } = action.payload;

            state.fileContents = {
                ...state.fileContents,
                [path]: content,
            }
        },
        setFileContents(state, action: PayloadAction<FileContent>) {
            state.fileContents = { ...action.payload }
        },
        setIsFilesLoaded(state, action: PayloadAction<boolean>) {
            state.isFilesLoaded = action.payload;
        }
    },
});

export const {
    setFiles,
    setFileContent,
    setFileContents,
    setIsFilesLoaded,
    setCurrentSelectedFile,
    setCurrentSelectedPath,
} = editorSlice.actions

export default editorSlice.reducer