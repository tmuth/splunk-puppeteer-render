
console.log(process.env.SPASS_REPORT1);
var username = 'report11';
eval('var x="SPASS_'  + username.toUpperCase() + '";');
console.log(x);

console.log(eval('process.env.'+x));