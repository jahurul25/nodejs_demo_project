var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');


module.exports.customerReg = (req, res) => {
    if(req.method == "POST"){
        MongoClient.connect(process.env.dbConString, (err, client) => {
            if (err) throw err    
            var db = client.db('testdb')
            
            bcrypt.genSalt(10, function(err, salt) {
                if (err) return callback(err);
                bcrypt.hash(req.body.cust_pass, salt, function(err, hash) {
                    var myobj = { custName: req.body.cust_name, custEmail: req.body.cust_email, custPass: hash, custMobile: req.body.cust_mobile };
                    db.collection("customers").insertOne(myobj, function(err, result) {
                        if (err) throw err;
                        res.render('customer_panel/customer_reg', { title: 'New Customer Registration', message: "Customer Create Successful" });
                    });
                });
            }); 
        });      
    }
    else{
        res.render('customer_panel/customer_reg', { title: 'New Customer Registration' });      
    }
}