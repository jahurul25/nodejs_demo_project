  
const router = require('express').Router(); 

const {
    adminLogin, menuEntry, createAdmin, menuView, editMenu, adminDashboard    
} = require('../controllers/adminController')
 
const {
    customerReg
} = require('../controllers/customerController')
 

router.get('/adminLogin', adminLogin);  
router.post('/adminLogin', adminLogin);  
router.get('/adminDashboard', adminDashboard);  
router.get('/menuEntry', menuEntry);  
router.post('/menuEntry', menuEntry);  
router.get('/createAdmin', createAdmin);  
router.post('/createAdmin', createAdmin);  
router.get('/menuView', menuView);  
router.get('/editMenu/:id', editMenu);  
router.post('/editMenu/:id', editMenu); 


router.get('/customerReg', customerReg);  
router.post('/customerReg', customerReg);  


module.exports = router;