
console.log(process.env.SPASS_REPORT1);
var username = 'report12';
eval('var x="SPASS_'  + username.toUpperCase() + '";');
console.log(x);

console.log(eval('process.env.'+x));

if(eval('process.env.'+x) === undefined){
    throw (`No value for environment variable ${x}`);
}