import useAppSelector from "../../../hooks/useAppSelector";

export function useFiles() {
    const files = useAppSelector(({ editor }) => {
        const { currentSelectedFile, files } = editor;

        return {
            currentSelectedFile,
            files
        }
    });

    return files;
}

export function useFileContents() {
    const fileContents = useAppSelector(({ editor }) => editor.fileContents);

    return fileContents;
}