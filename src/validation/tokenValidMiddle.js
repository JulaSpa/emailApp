import jwt from 'jsonwebtoken'

function auth (req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Access denied')
    }else{
        let token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, `${process.env.TOKEN_SECRET}`, (err, decoded)=>{
            if(err){
                res.status(500).json({msg:'Your token has expired'})
            }else{
                req.user=decoded
                next();
            }

        })
      
    };
}



export default auth