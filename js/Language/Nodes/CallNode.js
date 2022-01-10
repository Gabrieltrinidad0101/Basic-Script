class CallNode{
    constructor(nodeToCall,argNodes,){
        this.nodeToCall = nodeToCall
        this.argNodes = argNodes
        this.pos_start = this.nodeToCall.pos_start

        if(this.argNodes.length > 0){
            this.pos_end = this.argNodes[this.argNodes.length - 1].pos_end
        }else{
            this.pos_end = this.nodeToCall.pos_end
        }
    }
}

export default CallNode