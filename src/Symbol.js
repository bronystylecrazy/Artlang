class Symbol{
    constructor(){
        this.symbols = {};
        this.parent = undefined;
    }

    get(name){
        let value = this.symbols[name] || undefined;

        if(value === undefined && this.parent !== null){
            return this.parent.get(name);
        }
        return value;
    }

    set(name, value){
        this.symbols[name] = value;
    }

    remove(name){
        delete this.symbols[name];
    }
}

exports = { Symbol };