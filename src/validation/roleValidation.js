import jwt from 'jsonwebtoken'

function authRole(req, res, next){
    if(req.user.role != 'admin'){
        return res.status(403).json({msg: 'Forbidden error'})
    }else{
        console.log(req.user.role)
        next();
    }
}

export default authRole