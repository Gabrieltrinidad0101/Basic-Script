class WhileInterpreter{
    WhileNode(node,context){
        const res = new RTResult()
        while(true){
            const condition = res.register(this.run(node.conditionNode,context))
            if(res.error) return res
            if(!condition.isTrue()) break

            res.register(this.run(node.bodyNode,context))
            if(res.error) return res
        }
        return res.success(null)
    }
}

export default WhileInterpreter