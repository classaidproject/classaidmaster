const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Acess Denied');

    try {
        const verifyed = jwt.verify(token,process.env.TOKEN);
        req.user = verifyed;
        next();
    } catch (err){
        res.status(400).send('Invaild token');
    }
}