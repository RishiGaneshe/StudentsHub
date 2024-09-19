const bcrypt= require('bcrypt')



async function  hashPassword (password){
    const saltRounds= 10;
    return await bcrypt.hash(password,saltRounds)
}


async function verifyPassword(password,hashedpassword){
    return await bcrypt.compare(password,hashedpassword)
}


module.exports={
    hashPassword,
    verifyPassword
}