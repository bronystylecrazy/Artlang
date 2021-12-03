import IllegalCharacterError from "./src/Error/IllegalCharacterError";
import Lexer from "./src/Lexer/Lexer";
import Position from "./src/Lexer/Position";
import Token from "./src/Lexer/Token";
import TokenResult from "./src/Result/TokenResult";


const lexer = new Lexer('1+3 ','sirawit.txt');
const result = lexer.build({ save: true});



if(result.isError()){
    console.error(result.error.toString());
    process.exit();
}
