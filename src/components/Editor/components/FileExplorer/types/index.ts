import { Structure, File } from "../../../../../store/editor/files/types";

export type FileIconProps = {
    type: string;
}

export type FileStructureProps = {
    files: Array<Structure>;
    onFileSelect: (file: Structure) => void;
}

export type FolderProps = {
    name: string,
}

export type FileProps = {
    name: string,
    onClick: () => void,
}