// import { useEffect } from "react"

// const useDebounce = ({ text, delay = 500 }) => {

//     const [debouncedText, setDebouncedText] = useState(text)

//     useEffect(() => {

//         const timer = setTimeout(() => {
//            setDebouncedText(text)
//         }, delay)

//         return () => {
//             clearTimeout(timer)
//         }
//     }, [text, delay])

//     return debouncedText;
// }
// export default useDebounce