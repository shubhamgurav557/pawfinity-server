import jwt from 'jsonwebtoken';

const authorize = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({ error: 'Unauthorized User' });
    }

    jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(401).json({ error: 'Unauthorized User' });
        }
        req.user = decoded;
        next();
    })
}

export default authorize;