import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EditorState, File, StructureList } from '../../../types';

const initialState: EditorState = {
    files: [],
    currentSelectedFile: null,
    fileContents: {},
    isFilesLoaded: false,
}

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setCurrentSelectedFile(state, action: PayloadAction<File>) {
            state.currentSelectedFile = action.payload;
        },
        setFiles(state, action: PayloadAction<StructureList>) {
            state.files = [...action.payload];
        },
        setFileContent(state, action: PayloadAction<{ name: string, content: string }>) {
            const { name, content } = action.payload;

            state.fileContents = {
                ...state.fileContents,
                [name]: content,
            }
        },
        setIsFilesLoaded(state, action: PayloadAction<boolean>){
            state.isFilesLoaded = action.payload;
        }
    },
});

export const { 
    setCurrentSelectedFile, 
    setFiles, 
    setFileContent,
    setIsFilesLoaded,
} = editorSlice.actions

export default editorSlice.reducer