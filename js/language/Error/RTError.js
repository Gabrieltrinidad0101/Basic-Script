import Error from "./error.js"
class RTError extends Error {
        constructor(posStart,posEnd,details,context){
            super(posStart,posEnd,"Runtime Error",details)
        }
}

export default RTError