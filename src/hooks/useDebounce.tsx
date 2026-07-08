import { useEffect, useState } from "react"

const useDebounce = ({ text, delay = 500 }: { text: any, delay: number }) => {

    const [debouncedText, setDebouncedText] = useState(text)

    useEffect(() => {

        const timer = setTimeout(() => {
            setDebouncedText(text)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [text, delay])

    return debouncedText;
}
export default useDebounce