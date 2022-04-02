import { forwardRef } from "react"
import { PREVIEW_URL_PREFIX } from "../../../../../../utils"

export default forwardRef<HTMLIFrameElement>((props, ref) => {
    return (
        <iframe ref={ref} 
        className="w-full" 
        src={`${PREVIEW_URL_PREFIX}/`} 
        style={{height: "calc(100% - 2.1rem)"}} 
        title="playground-preview"
        ></iframe>
    )
})
