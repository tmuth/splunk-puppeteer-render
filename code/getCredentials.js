const getCredentials = async (nameIn) => {
    //console.log(nameIn);
    eval('var username="SPASS_'  + nameIn.toUpperCase() + '";');
    //console.log(username);
    var password=eval('process.env.'+username)
    //console.log('Passs: '+ password);
    if(password === undefined){
        throw (`No value for environment variable ${username}`);
    }
    return password;

}

//getCredentials('report1');

module.exports = getCredentials;