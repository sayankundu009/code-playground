import useAppSelector from "../../../hooks/useAppSelector";

export function useFiles() {
    const files = useAppSelector(({ editor }) => {
        const { currentSelectedFile, files, isFilesLoaded, currentSelectedPath } = editor;

        return {
            files,
            isFilesLoaded,
            currentSelectedFile,
            currentSelectedPath
        }
    });

    return files;
}

export function useFileContents() {
    const fileContents = useAppSelector(({ editor }) => editor.fileContents);

    return fileContents;
}