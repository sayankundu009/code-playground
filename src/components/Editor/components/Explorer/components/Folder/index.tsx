import FileIcon from "../FileIcon";
import { useState } from "react";
import { FolderProps } from "../../types";

export default function Folder({ name, children }: React.PropsWithChildren<FolderProps>) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <li>
            <a onClick={() => setIsOpen((open) => !open)}>
                <FileIcon type="folder" />
                <span>{name}</span>
            </a>
            
            {isOpen && children}
        </li>
    );
}
