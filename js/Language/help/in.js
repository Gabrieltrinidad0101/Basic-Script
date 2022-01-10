function IN(value,text){
    for(var i = 0;i < text.length;i++){
        if(value === text[i] || JSON.stringify(value)==JSON.stringify(text[i])){
            return true;
        } 
    }
    return false
}

export default IN