import { Structure, StructureList } from "../../../../../types"

export type FileIconProps = {
    type: string;
}

export type FileStructureProps = {
    files:StructureList;
    onFileSelect: (file: Structure) => void;
}

export type FolderProps = {
    name: string,
}

export type FileProps = {
    name: string,
    onClick: () => void,
}