import { getFileExtension } from "../../../../../../utils";
import { FileProps } from "../../types";
import FileIcon from "../FileIcon";

export default function File({ name, onClick }: React.PropsWithChildren<FileProps>) {
    const extension = getFileExtension(name);

    return (
        <li>
            <a onClick={onClick}>
                <FileIcon type={extension} />
                
                <span className="pl-1">
                    {name}
                </span>
            </a>
        </li>
    )
}
