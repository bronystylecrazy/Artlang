
import { writeFileSync } from "fs";
import Program from "./src/interpreter/Program";

let program = Program('4/0');
if(program.error){
    console.log(program.error.toString());
    process.exit(1);
}

console.log(program.result.value.toString());