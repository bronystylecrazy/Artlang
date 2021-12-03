
class Position{
    constructor(public idx?: number, public line?: number, public column?: number, public fileName?: string, public fileText?: string){
        this.idx = idx || 0;
        this.line = line || 0;
        this.column = column || 0;
        this.fileName = fileName || "";
        this.fileText = fileText || "";
    }

    advance(currentChar?: string){
        this.idx++;
        this.column++;
        if(currentChar === "\n"){
            this.advanceLine();
        }
        return this;
    }

    advanceLine(){
        this.line++;
        this.column = 0;
        return this;
    }

    copy(){
        return new Position(this.idx, this.line, this.column, this.fileName, this.fileText);
    }

    toString(){
        return `${this.fileName}:${this.line}:${this.column}`;
    }
}

export default Position;