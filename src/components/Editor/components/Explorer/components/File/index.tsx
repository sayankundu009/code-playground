import FileIcon from "../FileIcon";
import { getFileExtension } from "../../../../../../utils";
import { FileProps } from "../../types";

export default function File({ name, onFileClick, active = false }: React.PropsWithChildren<FileProps>) {
    const extension = getFileExtension(name);
    const activeClassName = active ? "selected" : "";

    function handleClick() {
        onFileClick(name);
    }

    return (
        <li>
            <a onClick={handleClick} className={activeClassName}>
                <FileIcon type={extension} />

                <span className="pl-1">{name}</span>
            </a>
        </li>
    );
}
