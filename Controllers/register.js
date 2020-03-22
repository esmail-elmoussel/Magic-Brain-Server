const handleRegister = (req,res,db,bcrypt) => {
    const {name,email,password} = req.body;
    const hash = bcrypt.hashSync(password);
    
    if(!name || !email || !password){
        return res.status(400).json('incorrect register information');
    }
    
    // transaction means than if one fails then all will
    db.transaction(trx => {         // trx = db
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')         // return all columns for the user u just added
            .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)       // means if everything went OK commit these changes
        .catch(trx.rollback)    //if there is an error start over!
    })
    .catch(err => {
        res.status(400).json('UNABLE TO REGISTER!');
    })
}

module.exports = { handleRegister }