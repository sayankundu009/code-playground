import FileIcon from "../FileIcon";
import { useState } from "react";
import { FolderProps } from "../../types";

export default function Folder({ name, children, active, onClick }: React.PropsWithChildren<FolderProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const activeClassName = active ? "selected" : "";
    const foldericonType = isOpen ? "folder-open" : "folder";

    function handleClick() {
        setIsOpen(!isOpen)
        onClick(name)
    }

    return (
        <li>
            <a onClick={handleClick} className={activeClassName}>
                <FileIcon type={foldericonType} />
                <span className="pl-1">{name}</span>
            </a>

            {isOpen && children}
        </li>
    );
}
