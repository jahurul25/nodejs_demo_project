var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');


module.exports.adminLogin = (req, res) => {     
    MongoClient.connect(process.env.dbConString, (err, client) => { 
        if (err) throw err    
        var db = client.db('testdb')

        db.collection('users').find({userName: {$eq: req.body.user_name}}, { projection: { _id: 1, userName:1, userPass:1 } }).toArray(function (err, data) {
            if (err) throw err
            if(req.method == "POST")
            {
                bcrypt.compare(req.body.user_pass, data[0].userPass, function(err, isMatch) {
                    if (err) {
                      throw err
                    } else if (!isMatch) {
                        res.render('admin_login', { title: 'Admin Login', message: "Password doesn't match!" });
                    } else {
                        return res.redirect('/api/adminDashboard');
                    }
                })
            }  
            else{
                res.render('admin_login', { title: 'Admin Login' });
            }     
        }); 

    });       
}

module.exports.createAdmin = (req, res) => {
    MongoClient.connect(process.env.dbConString, (err, client) => {
        if (err) throw err    
        var db = client.db('testdb')

        if(req.method == "GET")
        {
            res.render('admin_registration', { title: 'New Admin Registration' });       
        }
        else if(req.method == "POST"){
            bcrypt.genSalt(10, function(err, salt) {
                if (err) return callback(err);
                bcrypt.hash(req.body.user_pass, salt, function(err, hash) {
                    var myobj = { userName: req.body.user_name, userPass: hash };
                    db.collection("users").insertOne(myobj, function(err, result) {
                        if (err) throw err;
                        res.render('admin_registration', { title: 'New Admin Registration', message: "Admin User Create Successful" });
                    });
                });
            });      
        }
    }); 
}

module.exports.adminDashboard = (req, res) => {     
    res.render('admin_dashboard', { title: 'Admin Dashboard' });      
}

module.exports.menuEntry = (req, res) => {    
    if(req.method === "POST") 
    {
        MongoClient.connect(process.env.dbConString, (err, client) => { 
            if (err) throw err    
            var db = client.db('testdb')

            var myobj = { dishName: req.body.dish_name, dishPrice: req.body.dish_price, status: req.body.status };
            db.collection("menulist").insertOne(myobj, function(err, result) {
                if (err) throw err;
                res.render('menu_entry', { title: 'Menu Entry', message: "Menu Add Successful" });
            });
        });     
    }  
    else{
        res.render('menu_entry', { title: 'Menu Entry' });
    }
}

 
module.exports.menuView = (req, res) => {
    MongoClient.connect(process.env.dbConString, (err, client) => {
        if (err) throw err    
        var db = client.db('testdb')
 
        db.collection('menulist').find({}, { projection: { _id: 1, dishName:1, dishPrice:1, status:1 } }).toArray(function (err, data) {
            if (err) throw err
            res.render('view_menu', { title: 'Menu List', menu_list: data });
        }); 

    });  
}
 
module.exports.editMenu = (req, res) => {
    var menu_id = req.param('id');     
    MongoClient.connect(process.env.dbConString, (err, client) => {
        if (err) throw err    
        var db = client.db('testdb')
        
        if(req.method === "POST")
        {
            console.log("update query")
            db.collection("menulist").updateOne({_id:new ObjectId(menu_id)}, { $set: {dishName: req.body.dish_name, dishPrice: req.body.dish_price, status: req.body.status } }, function(err, data) {
                if (err) throw err;
                return res.redirect('/api/menuView');
            });
        }
        else{
            db.collection('menulist').find({_id:new ObjectId(menu_id)}, { projection: { _id: 1, dishName:1, dishPrice:1, status:1 } }).toArray(function (err, data) {
                if (err) throw err
                res.render('edit_menu', { title: 'Menu List', menu_data: data });
            }); 
    
        }        
    });  
}
