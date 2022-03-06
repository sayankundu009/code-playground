import { getFileExtension } from "../../../../../../utils";
import { FileProps } from "../../types";
import FileIcon from "../FileIcon";

export default function File({ name, onFileClick }: React.PropsWithChildren<FileProps>) {
    const extension = getFileExtension(name);

    function handleClick(){
        onFileClick(name);
    }

    return (
        <li>
            <a onClick={handleClick}>
                <FileIcon type={extension} />
                
                <span className="pl-1">
                    {name}
                </span>
            </a>
        </li>
    )
}
