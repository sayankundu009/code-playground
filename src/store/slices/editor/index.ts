import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EditorState, File, StructureList } from '../../../types';

const initialState: EditorState = {
    files: [],
    currentSelectedFile: null,
    fileContents: {},
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
        }
    },
});

export const { 
    setCurrentSelectedFile, 
    setFiles, 
    setFileContent 
} = editorSlice.actions

export default editorSlice.reducer