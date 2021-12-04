import readline from 'readline-sync';




function input(question: string){
    var result = readline.question(question);
    return result;
}

export default input;