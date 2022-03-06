import { Structure, StructureList } from "../../../../../types"

export type FileIconProps = {
    type: string;
}

export type FileStructureProps = {
    files?: StructureList;
    path?: string;
    onFileSelect: (file: { name: string, path: string }) => void;
}

export type FolderProps = {
    name: string,
}

export type FileProps = {
    name: string,
    onFileClick: (fileName: string) => void,
}