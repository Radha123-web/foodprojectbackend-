const express = require('express')
const upload = require("./multer.js");
const pool = require("./pool.js");
const fs = require('fs');
const { error } = require('console');
const router = express.Router()
router.get('/movie_interface', function (req, res) {
    res.render('movieinterface', { message: ' ' })

})

router.post('/submit_movie', upload.single('poster'), function (req, res) {
    try {

        
        console.log(req.body)
        console.log(req.file)
        pool.query("insert into movie(stateid, cityid, cinemaid,screenid, moviename, actorsname, actressname, musicdirector, director, producer, musiccompany,  time, poster)values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.stateid, req.body.cityid,  req.body.cinemaid, req.body.screenid,  req.body.moviename, req.body.actorsname, req.body.actressname, req.body.musicdirector, req.body.director, req.body.producer, req.body.musiccompany, req.body.time, req.file.filename], function (error, result) {
            if (error) {
                console.log(error)
                res.render('movieinterface', { message: 'there is an issue in database.. please contact with data adminstrator' })
            }
            else {
                res.render('movieinterface', { message: 'movie selection submitted successfully...' })
            }

        })
    }
    catch (e) {

        res.render('movieinterface', { message: 'Server Error ...pls contact with backend team' })
    }

})
router.get('/fillstate', function (req, res) {

    try {
        pool.query("select * from state", function (error, result) {
            if (error) {
                res.json({ data: [], status: false, message: 'database error please contact with Data administrator' })
            }
            else {
                res.json({ data: result, status: true, message: 'Sucess' })
            }
        })

    }
    catch (e) {
        res.json({ data: [], status: false, message: 'server error ... pls contanct with backened team' })

    }
})


router.get('/fillcity', function (req, res) {
    try {
        pool.query("select* from city where stateid=?", [req.query.stateid], function (error, result) {
            if (error) {
                res.json({ data: [], status: false, message: 'database error please contact with Data administrator' })
            }
            else {
                res.json({ data: result, status: true, message: 'Sucess' })
            }
        })

    }
    catch (e) {
        res.json({ data: [], status: false, message: 'server error ... pls contanct with backened team' })

    }
})

router.get('/fillcinema', function (req, res) {


    try {
        pool.query("select * from cinema where cityid=?", [req.query.cityid], function (error, result) {
            if (error) {

                console.log(error)
                res.json({ data: [], status: false, message: 'database error please contact with Data administrator' })
            }
            else {
                res.json({ data: result, status: true, message: 'Sucess' })
            }
        })

    }
    catch (e) {
        res.json({ data: [], status: false, message: 'server error ... pls contanct with backened team' })

    }
})



router.get('/fillscreen', function (req, res) {

    try {
        pool.query("select * from  screen where cinemaid=?", [req.query.cinemaid], function (error, result) {
            if (error) {
                res.json({ data: [], status: false, message: 'database error please contact with Data administrator' })
            }
            else {
                res.json({ data: result, status: true, message: 'Sucess' })
            }
        })

    }
    catch (e) {
        res.json({ data: [], status: false, message: 'server error ... pls contanct with backened team' })

    }
})



router.get('/display_all_movie', function (req, res) {
    try {
        pool.query("select M.*,(select s.statename from state s where s.stateid=M.stateid) as statename, (select c.cityname from city c  where c.cityid=M.cityid) as cityname,(select k.cinemaname from cinema k where k.cinemaid=M.cinemaid) as cinemaname ,(select l.screenname from screen l  where l.screenid=M.screenid) as screenname from movie M", function (error, result) {

            if (error) {
                console.log(error)
                res.render('displayallmovie', { status: false, data: [] })
            }
            else {
                res.render('displayallmovie', { status: true, data: result })
            }
        })

    }
    catch (e) {
        res.render('displayallmovie', { status: false, data: [] })

    }
})


router.get('/show_movie', function (req, res) {
    pool.query("select M.*,(select s.statename from state s where s.stateid=M.stateid) as statename, (select c.cityname from city c  where c.cityid=M.cityid) as cityname,(select k.cinemaname from cinema k where k.cinemaid=M.cinemaid) as cinemaname ,(select l.screenname from screen l  where l.screenid=M.screenid) as screenname from movie M where  M.movieid=?", [req.query.movieid], function (error, result) {

        if (error) {
            console.log(error)
            res.render('showmovie', { status: false, data: [] })
        }
        else {
            res.render('showmovie', { status: true, data: result[0] })
        }
    })

}
)


router.post('/update_movie_data', function (req, res) {
    if (req.body.btn == "Edit") {
        pool.query("update movie set stateid=?, cityid=?,cinemaid=?, screenid=?, moviename=?, actorsname=?, actressname=?, musicdirector=?, director=?, producer=?, musiccompany=?, time=? where movieid=?", [req.body.stateid, req.body.cityid,  req.body.cinemaid, req.body.screenid,  req.body.moviename, req.body.actorsname, req.body.actressname, req.body.musicdirector, req.body.director, req.body.producer, req.body.musiccompany, req.body.time, req.body.movieid], function (error, result) {
            if (error) {

                res.redirect('/movie/display_all_movie')
            }
            else {
                res.redirect('/movie/display_all_movie')
            }

        })
    }
    else {



        pool.query("delete from movie  where movieid=?", [req.body.movieid], function (error, result) {
            if (error) {

                res.redirect('/movie/display_all_movie')
            }
            else {
                res.redirect('/movie/display_all_movie')
            }

        })
    }
})
router.get('/show_picture', function (req, res) {
    console.log(req.query)
    res.render("showpicture", { data: req.query })
})

router.post('/edit_picture', upload.single('poster'), function (req, res) {
    pool.query("update movie set poster=? where movieid=?", [req.file.filename, req.body.movieid], function (error, result) {

        if (error) { res.redirect('/movie/display_all_movie') }

        else {
            fs.unlink(`d:/movieproject/public/images/${req.body.oldmoviepicture}`, function (err) {
                if (err) { console.log(err) }

                else {

                    console.log("Deleted")
                }
            })
            {
                res.redirect('/movie/display_all_movie')


            }


        }
    })

})










module.exports = router