import { useEffect, useState } from "react";

export function useDebounce(editorState: string, delay: number) {
    const [debouncedState, setDebouncedState] = useState(editorState)

    useEffect(()=>{
        const handler = setTimeout(() => {
            setDebouncedState(editorState)
        }, delay);
        return () => {
            clearTimeout(handler)
        }
    }, [editorState, delay])

    return debouncedState
}