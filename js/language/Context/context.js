class Context{
    constructor(displayName,parent=null,parentEntryPos=null){
        this.displayName = displayName
        this.parent = parent
        this.parentEntryPos = parentEntryPos    
    }
}

export default Context