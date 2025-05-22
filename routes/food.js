const express = require('express')
const upload = require('./multer.js')
const pool = require("./pool.js")
const fs = require('fs');
var {LocalStorage}=require("node-localstorage");
const verifyToken = require('./authMiddleware.js');
var localstorage  =new LocalStorage('./scratch')
const router = express.Router();

router.get('/food_interface' ,function (req, res) {
    try{
        var admin=JSON.parse (localstorage.getItem('Admin'))
        console.log(req.user)
        if(admin==null)
            res.render('foodlogin',{message:''})
    
    else

    res.render("foodinterface",{message:''})
    // res.render('foodinterface', { message: ' ' })
}
catch{
    res.render('foodlogin', {message:''})
}
});


router.post('/submit_food', upload.single('foodpicture'), function (req, res) {
    try {
        console.log("BODY", req.body)
        console.log("FILE", req.file)
        pool.query("insert into fooditems(categoryid, subcategoryid, foodname, ingredients, description, price, offerprice, foodtype, status, foodpicture)values(?,?,?,?,?,?,?,?,?,?)", [req.body.categoryid, req.body.subcategoryid, req.body.foodname, req.body.ingredients, req.body.description, req.body.price, req.body.offerprice, req.body.foodtype, req.body.status, req.file.filename], function (error, result) {
            if (error) {
                console.log("Error:", error)
                res.render('foodinterface', { message: 'there is issue in database.. pls contact with data administrator' })
            }
            else {

                res.render('foodinterface', { message: 'FoodItem submitted successfully...' })
            }

        })

    }
    catch (e) {
        res.render('foodinterface', { message: 'Server Error... pls contact with backend team' })
    }


})
router.get('/fillcategory', function (req, res) {
    try {
        pool.query("select* from category", function (error, result) {
            if (error) {
                res.json({ data: [], status: false, message: 'Database error...pls contact with Data adminstrator' })

            }
            else {
                res.json({ data: result, status: true, message: 'Success' })

            }
        })
    }
    catch (e) {
        res.json({ data: [], status: false, message: 'Server error...pls contact with backend team' })

    }
})


router.get('/fillsubcategory', function (req, res) {
    try {
        pool.query("select * from subcategory where categoryid= ?", [req.query.categoryid], function (error, result) {
            if (error) {
                res.json({ data: [], status: false, message: 'Database error...pls contact with Data adminstrator' })

            }
            else {
                res.json({ data: result, status: true, message: 'Success' })

            }
        })
    }
    catch (e) {
        res.json({ data: [], status: false, message: 'Server error...pls contact with backend team' })

    }
})

router.get('/display_all_food', function (req, res) {

    try{
        var admin=JSON.parse (localstorage.getItem('Admin'))
        if(admin==null)
            res.render('foodlogin',{message:''})
    
    else

    {

/*********** */
    try {
        pool.query("select F.*,(select C.categoryname from category C where C.categoryid=F.categoryid) as categoryname, (select S.subcategoryname from subcategory S where  S.subcategoryid= F.subcategoryid) as subcategoryname from fooditems F", function (error, result) {

            if (error) {
                res.render('displayallfood', { status: false, data: [] })

            }
            else {

                res.render('displayallfood', { status: true, data: result });
            }
        }
        );
}


    
    catch (e) {
        res.render('displayallfood', { status: false, data: [] });
    }
    // **************//
    }
}
    catch
    {
        res.render('foodlogin',{message:''})
    }


});



router.get('/show_food', function (req, res) {
    pool.query("select F.*,(select C.categoryname from category C where C.categoryid=F.categoryid) as categoryname, (select S.subcategoryname from subcategory S where  S.subcategoryid= F.subcategoryid) as subcategoryname from fooditems F where foodid=?", [req.query.foodid], function (error, result) {

        if (error) {
            res.render('showfood', { status: false, data: [] })

        }
        else {

            res.render('showfood', { status: true, data: result[0] })
        }
    })


})


router.post('/update_food_data', function (req, res) {
    if (req.body.btn == "Edit") {
        pool.query("update fooditems set categoryid=?, subcategoryid=?, foodname=?, ingredients=?, description=?, price=?, offerprice=?, foodtype=?, status=? where foodid=?", [req.body.categoryid, req.body.subcategoryid, req.body.foodname, req.body.ingredients, req.body.description, req.body.price, req.body.offerprice, req.body.foodtype, req.body.status, req.body.foodid], function (error, result) {


            if (error) {
                res.redirect('/food/display_all_food')
            }
            else {
                res.redirect('/food/display_all_food')
            }
        })
    }
    else {


        pool.query("delete from fooditems where foodid=?", [req.body.foodid], function (error, result) {

            if (error) {
                res.redirect('/food/display_all_food')
            }
            else {
                res.redirect('/food/display_all_food')
            }
        })
    }

})


router.get('/show_picture', function (req, res) {
    console.log(req.query)
    res.render("showpicture", { data: req.query })

})


router.post('/edit_picture', upload.single('foodpicture'), function (req, res) {
    pool.query("update fooditems set foodpicture=? where foodid=?",[req.file.filename, req.body.foodid], function (error, result) {

        if (error) { res.redirect('/food/display_all_food') }



        else {
            fs.unlink(`d:/foodproject/public/images/${req.body.oldfoodpicture}`, function (err) {
                if (err) { console.log(err) }

                else {

                    console.log("Deleted")
                }
            })
            {
                res.redirect('/food/display_all_food')


            }


        }
    })

})












module.exports = router