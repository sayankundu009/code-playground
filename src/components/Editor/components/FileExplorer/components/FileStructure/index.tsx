import { PropsWithChildren, ReactNode } from "react";
import { FileStructureProps } from "../../types";
import { File as FileType } from "../../../../../../store/editor/files/types";
import File from "../File";
import Folder from "../Folder";

export default function FileStructure({ files = [], onFileSelect = () => { } }: PropsWithChildren<FileStructureProps>): ReactNode | any {

    function handleFileSelect(fileItem: FileType) {
        onFileSelect(fileItem)
    }

    return (
        <ul className="menu text-white">
            {files.map((file) => {
                if (file.type == "folder") {
                    return (
                        <Folder name={file.name} key={file.name}>
                            <FileStructure
                                files={file.children || []}
                                onFileSelect={onFileSelect}
                            />
                        </Folder>
                    )
                } else {
                    return <File name={file.name} key={file.name} onClick={() => handleFileSelect(file)} />
                }
            })}
        </ul>
    )
}
