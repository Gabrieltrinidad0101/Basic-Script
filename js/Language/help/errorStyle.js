function errorStyle(text,pos_start,pos_end){
    Array.prototype.find = find
    const textArray = Array.from(text)
    const idxStart = Math.max(textArray.find("\n",pos_start.idx,-1),0)
    let idxEnd = textArray.find("\n",pos_end.idx)
    if(idxEnd === -1) idxEnd = textArray.length
    
    let error = text.slice(idxStart,idxEnd)
    pos_end.col = pos_end.col - pos_start.col === 1 ? pos_end.col : pos_end.col - 1
    const repeat = pos_start.col === -1 ? 1 : pos_start.col
    error += `\n${"\u00a0".repeat(repeat)}${"^".repeat(Math.abs(pos_end.col - pos_start.col))}`

    return error
}

function find(char,start,direction=1){
    if(direction === 1){
        for(let i = start; i < this.length; i++){
            if(this[i] === char) return i
        }
    }
    else if(direction === -1){
        for(let i = start; i > 0; i--){
            if(this[i] === char) return i
        }
    }
    return -1 
}

export default errorStyle