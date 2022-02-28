export function getFileExtension(name: string | null): string {
    return name?.split('.').pop() || "";
}

export function getLanguage(name: string){
    const extension = getFileExtension(name);

    switch(extension){
        case "html": return "html";
        case "css": return "css";
        case "js": return "javascript";
        default: return "html"
    }
}

export function debounce(callback: (...args: any[]) => void, delay: number = 400) {
    let timer: ReturnType<typeof setTimeout>;
    
    let debounced = function (...args: any[]) {
        clearTimeout(timer);
        
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    }

    return debounced;
}