const handleSignin = (db,bcrypt) => (req,res) => {
    const { email, password} = req.body
    if(!email || !password){
        return res.status(400).json('incorrect signin information');
    }
    db.select('email','hash').from('login')
    .where('email','=',email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid){
            db.select('*').from('users')
            .where('email','=',data[0].email)
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('Error logging in!'))
        } 
        else {
            res.status(400).json('Error logging in!')
        }
    })
    .catch(err => res.status(400).json('Error logging in!'))
}

module.exports = { handleSignin }