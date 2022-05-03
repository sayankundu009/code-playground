import File from "../File";
import Folder from "../Folder";
import { PropsWithChildren, ReactNode, useMemo } from "react";
import { FileExplorerProps } from "../../types";

export default function FileExplorer({ files = [], onFileSelect = () => { }, path = "", selectedFilePath }: PropsWithChildren<FileExplorerProps>): ReactNode | any {
    function handleFileSelect(fileName: string) {
        onFileSelect({
            name: fileName,
            path: `${path}/${fileName}`,
            type: "file",
        });
    }

    function handleFolderSelect(fileName: string){
        onFileSelect({
            name: fileName,
            path: `${path}/${fileName}`,
            type: "folder",
        });
    }

    // !! Doesn't work with Mozilla !!
    const sortedFiles = useMemo(() => {
        return [...files].sort((fileOne, fileTwo) => {
            if (fileOne.type === "folder") {
                if (fileTwo.type === "folder") return fileOne.name.localeCompare(fileTwo.name);

                return 1
            } else if (fileOne.type == "file") {
                if (fileTwo.type === "file") return fileOne.name.localeCompare(fileTwo.name);

                return 1
            }

            return 0;
        })
    }, [files]);

    return (
        <ul className="menu text-white text-sm">
            {sortedFiles.map((file) => {
                if (file.type == "folder") {
                    return (
                        <Folder name={file.name} key={`${path}/${file.name}`} active={`${path}/${file.name}` === selectedFilePath} onClick={handleFolderSelect}>
                            <FileExplorer
                                files={file.children}
                                onFileSelect={onFileSelect}
                                path={`${path}/${file.name}`}
                                selectedFilePath={selectedFilePath}
                            />
                        </Folder>
                    )
                } else {
                    return (
                        <File
                            name={file.name}
                            key={`${path}/${file.name}`}
                            onFileClick={handleFileSelect}
                            active={`${path}/${file.name}` === selectedFilePath}
                        />
                    )
                }
            })}
        </ul>
    )
}
