
import { writeFileSync } from "fs";
import input from "./src/utils/input";
import Program from "./src/interpreter/Program";
import chalk from 'chalk';

while(true){
    const source = input('>');
    try{
    let program = Program(source);
    if(program.error){
        console.log('\x1b[31m%s\x1b[0m', program.error.toString());
    }else console.log(chalk.gray(program.result.toString()));
}catch(e){console.log('\x1b[31m',e,'\x1b[0m');}
}