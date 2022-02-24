const getCredentials = async (nameIn) => {
    console.log(nameIn);
    eval('var username="SPASS_'  + nameIn.toUpperCase() + '";');
    console.log(username);
    var password=eval('process.env.'+username)
    console.log('Passs: '+ password);
    return password;

}

//getCredentials('report1');

module.exports = getCredentials;