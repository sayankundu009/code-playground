import { useState } from "react";
import { FolderProps } from "../../types";
import FileIcon from "../FileIcon";

export default function Folder({ name, children }: React.PropsWithChildren<FolderProps>) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <li>
            <a onClick={() => setIsOpen((open) => !open)}>
                <FileIcon type="folder" />
                <span className="ml-1">
                    {name}
                </span>
            </a>
            {isOpen && children}
        </li>
    )
}
