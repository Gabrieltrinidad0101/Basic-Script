function IN(value,values){
    for(const i in values){
        if(values[i] === value || JSON.stringify(value)==JSON.stringify(values[i])) return true
    }
    return false
}

export default IN