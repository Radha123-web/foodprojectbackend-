var express = require('express');
var pool = require('./pool');
var {LocalStorage}=require("node-localstorage")
var localstorage= new LocalStorage('./scratch')
var router = express.Router();
const jwt=require('jsonwebtoken');
const dotenv =require('dotenv');
dotenv.config();

/* GET home page. */

router.get("/food_login", function (req, res, next) {
    try{
    var admin=  JSON .parse(localstorage.getItem('Admin'))
    if (admin==null)
    //  console.log("ADMIN:",admin)
    res.render('foodlogin', { message: '' });
    else
    res.render('dashboard', { data:admin, status: true, message: 'Login Sucess' })
}  
            catch{
                res.render('foodlogin', { message: '' }); 
            }
    
});

router.post("/check_login", function (req, res) {
    pool.query("select * from admins where (emailid=? or mobileno=? )and password=?", [req.body.emailid, req.body.mobileno, req.body.password], function (error, result) {
        if (error) {
            
            res.render('foodlogin', { data: [], status: false, message: 'database error...pls contact with database admin'})
        }
        else {
            // console.log("hyhjhuj:",result)
            if (result.length==1) 
               { let jwtSecretKey= process.env.jwt_SECRET_KEY;
                localstorage.setItem("Admin", JSON.stringify(result[0]))
                    const token =jwt.sign({user:result[0]},jwtSecretKey,{
                        expiresIn:'1h',
                    });
                    console.log(token)
                    //res.json({token,  status :true,data:result[0],message:"Sucess"})
                
                res.render('dashboard', { token, data: result[0], status: true, message: 'Login Sucess' })
            
        
                }
            else 

                // res.json({status:false})
                 res.render('foodlogin', { data: [],status: false, message: 'Invalid Emailid/mobileNumber/Password' })
            }

        }
    )
    
    })



router.get("/admin_logout", function (req, res, next) {
    localstorage.clear()
    res.redirect('/admin/food_login')

})
module.exports = router;
