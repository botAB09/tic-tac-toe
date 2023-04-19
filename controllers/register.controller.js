const 
db = require('../utilities/db.utility');

module.exports = async function(req, res) {
    try{  
        const existUser = await db.isExistingUser(req.body.username);
        if(existUser.length){
            res.redirect('/');
        }
        else{
            await db.addUser(req.body);
            res.redirect('/');
        }
    }
    catch(err){
        console.log(err);
    }
}
