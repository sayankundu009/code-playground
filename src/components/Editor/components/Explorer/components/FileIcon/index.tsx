import { FileIconProps } from "../../types"

export default function FileIcon({ type }: FileIconProps) {
    switch (type) {
        case "html": {
            return (
                <svg width="19" height="24" viewBox="0 0 32 32"><path fill="#e44f26" d="M5.902 27.201L3.655 2h24.69l-2.25 25.197L15.985 30L5.902 27.201z"></path><path fill="#f1662a" d="m16 27.858l8.17-2.265l1.922-21.532H16v23.797z"></path><path fill="#ebebeb" d="M16 13.407h-4.09l-.282-3.165H16V7.151H8.25l.074.83l.759 8.517H16v-3.091zm0 8.027l-.014.004l-3.442-.929l-.22-2.465H9.221l.433 4.852l6.332 1.758l.014-.004v-3.216z"></path><path fill="#fff" d="M15.989 13.407v3.091h3.806l-.358 4.009l-3.448.93v3.216l6.337-1.757l.046-.522l.726-8.137l.076-.83h-7.185zm0-6.256v3.091h7.466l.062-.694l.141-1.567l.074-.83h-7.743z"></path></svg>
            )
        }
        case "css": {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="19" height="24"><path fill="none" d="M0 0h24v24H0z" /><path d="M5 3l-.65 3.34h13.59L17.5 8.5H3.92l-.66 3.33h13.59l-.76 3.81-5.48 1.81-4.75-1.81.33-1.64H2.85l-.79 4 7.85 3 9.05-3 1.2-6.03.24-1.21L21.94 3z" fill="rgba(50,152,219,1)" /></svg>
            )
        }
        case "js": {
            return (
                <svg width="19" height="24" viewBox="0 0 32 32"><path fill="#f5de19" d="M2 2h28v28H2z"></path><path d="M20.809 23.875a2.866 2.866 0 0 0 2.6 1.6c1.09 0 1.787-.545 1.787-1.3c0-.9-.716-1.222-1.916-1.747l-.658-.282c-1.9-.809-3.16-1.822-3.16-3.964c0-1.973 1.5-3.476 3.853-3.476a3.889 3.889 0 0 1 3.742 2.107L25 18.128A1.789 1.789 0 0 0 23.311 17a1.145 1.145 0 0 0-1.259 1.128c0 .789.489 1.109 1.618 1.6l.658.282c2.236.959 3.5 1.936 3.5 4.133c0 2.369-1.861 3.667-4.36 3.667a5.055 5.055 0 0 1-4.795-2.691Zm-9.295.228c.413.733.789 1.353 1.693 1.353c.864 0 1.41-.338 1.41-1.653v-8.947h2.631v8.982c0 2.724-1.6 3.964-3.929 3.964a4.085 4.085 0 0 1-3.947-2.4Z"></path></svg>
            )
        }
        case "folder": {
            return (
                <svg width="24" height="30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M216 68h-82.6l-26-29.3a20 20 0 0 0-15-6.7H40a20.1 20.1 0 0 0-20 20v148.6A19.4 19.4 0 0 0 39.4 220h177.5a19.2 19.2 0 0 0 19.1-19.1V88a20.1 20.1 0 0 0-20-20ZM44 56h46.6l10.7 12H44Zm168 140H44V92h168Z"></path></svg>
            )
        }
        case "folder-open": {
            return (
                <svg width="24" height="30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M208 88v24H69.8a8 8 0 0 0-7.6 5.5L32 208V64a8 8 0 0 1 8-8h53.3a8.1 8.1 0 0 1 4.8 1.6l27.8 20.8a8.1 8.1 0 0 0 4.8 1.6H200a8 8 0 0 1 8 8Z" opacity=".2"></path><path fill="currentColor" d="M241.9 110.6a16.2 16.2 0 0 0-13-6.6H216V88a16 16 0 0 0-16-16h-69.3l-27.8-20.8a15.6 15.6 0 0 0-9.6-3.2H40a16 16 0 0 0-16 16v144a7.9 7.9 0 0 0 8 8h176a8 8 0 0 0 7.6-5.5l28.5-85.4a16.3 16.3 0 0 0-2.2-14.5ZM93.3 64l27.8 20.8a15.6 15.6 0 0 0 9.6 3.2H200v16H69.8a16 16 0 0 0-15.2 10.9L40 158.7V64Zm108.9 136H43.1l26.7-80h159.1Z"></path></svg>
            )
        }
        default: {
            return <></>
        }
    }
}
