var express = require('express');
var pool= require('./pool');
var router = express.Router();

/* GET home page. */

router.get('/show_movie',function(req,res,next){
    res.render('showmovie')
})


router.get('/get_all_movie', function(req, res, next) {
  pool.query("select  * from movie", function (error,result){
  res.json ({data:result})
  })
});

module.exports = router;
