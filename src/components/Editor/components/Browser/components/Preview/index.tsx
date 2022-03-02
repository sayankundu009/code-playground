import { forwardRef, HTMLProps } from "react"

export default forwardRef<HTMLIFrameElement>((props, ref) => {
    return (
        <iframe ref={ref} className="w-full" src="/preview/" style={{height: "calc(100% - 2.1rem)"}}></iframe>
    )
})
