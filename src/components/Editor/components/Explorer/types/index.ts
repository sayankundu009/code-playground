import { StructureList } from "../../../../../types"

export type FileIconProps = {
    type: string;
}

export type FileExplorerProps = {
    files?: StructureList;
    path?: string;
    selectedFilePath: string | null; 
    onFileSelect: (file: { name: string, path: string, type?: string}) => void;
}

export type FolderProps = {
    name: string,
    active: boolean,
    onClick: (fileName: string) => void,
}

export type FileProps = {
    name: string,
    onFileClick: (fileName: string) => void,
    active: boolean,
}