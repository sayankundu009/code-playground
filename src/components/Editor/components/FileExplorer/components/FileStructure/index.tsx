import { PropsWithChildren, ReactNode, useMemo } from "react";
import { Structure } from "../../../../../../types";
import { FileStructureProps } from "../../types";
import File from "../File";
import Folder from "../Folder";

export default function FileStructure({ files = [], onFileSelect = () => { }, path = "" }: PropsWithChildren<FileStructureProps>): ReactNode | any {
    function handleFileSelect(file: Structure) {
        onFileSelect({
            name: file.name,
            path: `${path}/${file.name}`
        })
    }

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
                        <Folder name={file.name} key={file.name}>
                            <FileStructure files={file.children || []} onFileSelect={onFileSelect} path={`${path}/${file.name}`} />
                        </Folder>
                    )
                } else {
                    return <File name={file.name} key={file.name} onClick={() => handleFileSelect(file)} />
                }
            })}
        </ul>
    )
}
