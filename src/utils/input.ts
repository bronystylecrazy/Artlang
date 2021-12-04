import readline from 'readline';

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.question(">", function(answer) {
    console.log("Thank you for your valuable feedback:", answer);
    rl.close();
});

