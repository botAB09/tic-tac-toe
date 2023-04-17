const 
db = require('../utilities/db.utility');

module.exports = async function(req, res) {
    try{  
        const existUser = await db.checkUser(req.body);
        if(existUser){
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
