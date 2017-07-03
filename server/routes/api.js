const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
var db     = require('../db-config');
var Person     = require('../models/person');
var Area     = require('../models/area');
var Province     = require('../models/province');
var District     = require('../models/district');
var Setting     = require('../models/setting');
var Activity     = require('../models/activity');
var Admin     = require('../models/admin');
var Point     = require('../models/point');
var Audit     = require('../models/audit');
var Formfield     = require('../models/form-field');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app = express();
app.set('superSecret',"datacenter");

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

function saveAudit(activity, date, adminid )
{

    var audit = new Audit();      
    audit.activity = activity; 
    audit.date = date; 
    audit.adminid = adminid;  
    
    audit.save(function(err, data) {
        if (err)
            res.send(err);

        return "Saved";
    });

}

router.route('/audit/:adminid')
    .get(function(req, res) {

        Audit.find({ adminid: req.params.adminid })        
        .sort({'date': -1})
        .limit(10)
        .exec(function(err, audits) {
            res.json(audits);
        });

    });

router.route('/point')
    // create a point 
    .post(function(req, res) {

        var point = new Point();      
        point.users = req.body.users; 
        point.province = req.body.province; 
        point.area = req.body.area;  
        point.district = req.body.district;
        point.points = req.body.points;  

        point.save(function(err, data) {
            if (err)
                res.send(err);

            res.json(data);
        });

    });

router.route('/point')
    .get(function(req, res) {

        Point.find(function (err, docs) {
            res.json(docs);
        });

    });

router.route('/point/:id')
    .delete(function(req, res) {

        Point.remove({
            _id: req.params.id
        }, function(err, point) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });

    });

router.route('/dashboard/topadmin')
    
    .get(function(req, res) {        
        Admin.find({}).sort({points: -1}).limit(10)
        .exec(function (err, docs) {            
                res.json(docs);
        });

    });

router.route('/dashboard/province')
    
    .get(function(req, res) {        
        Province.find({}, function (err, docs) {            
                res.json(docs);
        });

    });

router.route('/lookup/area')
    
    .get(function(req, res) {        
        console.log("Api called");
        Area.find(function (err, docs) {            
            //console.log(docs);
            res.json(docs);
        });

    });


router.route('/lookup/province')
    
    .get(function(req, res) {                
        Province.find(function (err, docs) {                    
            res.json(docs);
        });

    });

router.route('/lookup/district')
    
    .get(function(req, res) {                
        District.find(function (err, docs) {                    
            res.json(docs);
        });

    });

router.route('/setting')
    
    .get(function(req, res) {                
        Setting.findOne(function (err, docs) {              
            res.json(docs);
        });

    });

router.route('/setting')
    // create a person 
    .post(function(req, res) {
        var setting = new Setting();      // create a new instance of the Bear model
        setting.noOfUserInProvince = req.body.noOfUserInProvince;  // set the bears name (comes from the request)
        setting.noOfUserInArea = req.body.noOfUserInArea;  // set the bears name (comes from the request)
        setting.noOfUserInDistrict = req.body.noOfUserInDistrict;  // set the bears name (comes from the request)
        setting.noOfUserInSocial = req.body.noOfUserInSocial;  // set the bears name (comes from the request)
        setting.noOfUsers = req.body.noOfUsers;  // set the bears name (comes from the request)
        setting.addPersonPointsAdmin = req.body.addPersonPointsAdmin;  // set the bears name (comes from the request)
        setting.addPointPointsAdmin = req.body.addPointPointsAdmin;  // set the bears name (comes from the request)
        setting.addActivityPointsAdmin = req.body.addActivityPointsAdmin;  // set the bears name (comes from the request)
        setting.addhashtagPoints = req.body.addhashtagPoints;  // set the bears name (comes from the request)
        setting.addfacebookPoints = req.body.addfacebookPoints;  // set the bears name (comes from the request)
        setting.addtelegramPoints = req.body.addtelegramPoints;  // set the bears name (comes from the request)
        setting.addOtherPoints = req.body.addOtherPoints;  // set the bears name (comes from the request)
        setting.websiteTitle = req.body.websiteTitle;  // set the bears name (comes from the request)

        // save the person and check for errors
        Setting.findOne(function (err, out) {

            if (out!=null)
            {
                out.noOfUserInProvince = req.body.noOfUserInProvince;  // set the bears name (comes from the request)
                out.noOfUserInArea = req.body.noOfUserInArea;  // set the bears name (comes from the request)
                out.noOfUserInDistrict = req.body.noOfUserInDistrict;  // set the bears name (comes from the request)
                out.noOfUserInSocial = req.body.noOfUserInSocial;  // set the bears name (comes from the request)
                out.noOfUsers = req.body.noOfUsers;  // set the bears name (comes from the request)
                out.addPersonPointsAdmin = req.body.addPersonPointsAdmin;  // set the bears name (comes from the request)
                out.addPointPointsAdmin = req.body.addPointPointsAdmin;  // set the bears name (comes from the request)
                out.addActivityPointsAdmin = req.body.addActivityPointsAdmin;  // set the bears name (comes from the request)
                out.addhashtagPoints = req.body.addhashtagPoints;  // set the bears name (comes from the request)
                out.addfacebookPoints = req.body.addfacebookPoints;  // set the bears name (comes from the request)
                out.addtelegramPoints = req.body.addtelegramPoints;  // set the bears name (comes from the request)
                out.addOtherPoints = req.body.addOtherPoints;  // set the bears name (comes from the request)
                out.websiteTitle = req.body.websiteTitle;  // set the bears name (comes from the request)
                out.save(function(err, data) {
                    if (err)
                        res.send(err);

                    res.json(data);
                });
            }
            else
            {
                setting.save(function(err, data) {
                    if (err)
                        res.send(err);

                    res.json(data);
                });
            }
        });        

    });

router.route('/person/:adminid')
    // create a person 
    .post(function(req, res) {

        var person = new Person();      // create a new instance of the Bear model
        person.person = req.body;  // set the bears name (comes from the request)

        // save the person and check for errors
        person.save(function(err, data) {
            if (err)
                res.send(err);
            
            saveAudit("Person added", Date.now(), req.params.adminid);

            res.json(data);
        });

    });

router.route('/person')
    .get(function(req, res) {

        Person.find(function (err, docs) {
            res.json(docs);
        });

    });


router.route('/person/province/:province')
    .get(function(req, res) {

        Person.find({ province: req.params.province }, function (err, docs) {
            res.json(docs);
        });

    });


router.route('/person/search')
    .post(function(req, res) {

        var search = req.body.search;
        if (search=="facebook"){
            Person.find({ facebookurl: { $ne: null } }, function (err, docs) {
                res.json(docs);
            });
        }
        else if (search=="twitter"){
            Person.find({ twitterurl: { $ne: null } }, function (err, docs) {
                res.json(docs);
            });
        }
        else if (search=="whatsup"){
            Person.find({ whatsup: { $ne: null } }, function (err, docs) {
                res.json(docs);
            });
        }
    });


router.route('/person/:id')
    
    .get(function(req, res) {

       if (req.params.id) {
            Person.findById(req.params.id, function (err, docs) {
                res.json(docs);
            });
       }
    });

router.route('/person/:id')
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Person.findById(req.params.id, function(err, person) {

            if (err)
                res.send(err);

            person.person = req.body;  // set the person

            // save the bear
            person.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Person updated!' });
            });

        });
    });

router.route('/person/:id')
    .delete(function(req, res) {

        Person.remove({
            _id: req.params.id
        }, function(err, person) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });

    });

router.route('/formfield/add')

    // create a formfield 
    .post(function(req, res) {

        var formfield = new Formfield();      // create a new instance of the Bear model
        formfield.formname = req.body.formname;  // set the bears name (comes from the request)        
        formfield.fieldtype = req.body.fieldtype;
        formfield.lookupdata = req.body.lookupdata;
        formfield.displayname = req.body.displayname;
        formfield.labelname = req.body.labelname;
        formfield.description = req.body.description;
        formfield.isMandatory = req.body.isMandatory;
        formfield.issystemfield = req.body.issystemfield;
        formfield.isDisplayOnList = req.body.isDisplayOnList;
        formfield.formorder = req.body.formorder;

        // save the formfield and check for errors
        formfield.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'formfield created!' });
        });

    });

router.route('/formfield/:formname')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .get(function(req, res) {

       if (req.params.formname) {
            Formfield.find({ formname: req.params.formname })
                    .sort({'formorder': 1})                    
                    .exec(function(err, formfields) {
                        res.json(formfields);
                    });

       }
    });

router.route('/formfieldByID/:id')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .get(function(req, res) {
       if (req.params.id) {
            Formfield.findById(req.params.id, function (err, docs) {
                res.json(docs);
            });
       }
    });

router.route('/formfield/:id')
    .put(function(req, res) {
        // use our bear model to find the bear we want
        Formfield.findById(req.params.id, function(err, formfield) {
            if (err)
                res.send(err);

            formfield.formname = req.body.formname;  // set the bears name (comes from the request)        
            formfield.fieldtype = req.body.fieldtype;
            formfield.lookupdata = req.body.lookupdata;
            formfield.displayname = req.body.displayname;
            formfield.labelname = req.body.labelname;
            formfield.description = req.body.description;
            formfield.isMandatory = req.body.isMandatory;
            formfield.issystemfield = req.body.issystemfield;
            formfield.isDisplayOnList = req.body.isDisplayOnList;
            formfield.formorder = req.body.formorder;

            // save the bear
            formfield.save(function(err, data) {
                if (err)
                    res.send(err);

                res.json(data);
            });

        });
    });

router.route('/formfield/:id')
    .delete(function(req, res) {

        Formfield.remove({
            _id: req.params.id
        }, function(err, formfield) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });

    });


router.route('/admin/login')

    .post(function(req, res) {
        Admin.findOne({ "admin.username": req.body.username }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

        // check if password matches
            if (user.admin.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                console.log("secret:" + app.get('superSecret'));
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 60*60*24 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    admin:user
                });
            }   

        }

    });
});


router.route('/admin')
    // create a person 
    .post(function(req, res) {

        var admin = new Admin();      // create a new instance of the Bear model
        admin.admin = req.body;  // set the bears name (comes from the request)
        admin.save(function(err, data) {
            if (err)
                res.send(err);

            res.json(data);
        });

    });

router.route('/admin')
    .get(function(req, res) {

        Admin.find(function (err, docs) {
            res.json(docs);
        });

    });

router.route('/admin/:id')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .get(function(req, res) {

       if (req.params.id) {
            Admin.findById(req.params.id, function (err, docs) {
                res.json(docs);
            });
       }
    });

router.route('/admin/:id')
    .put(function(req, res) {
        // use our bear model to find the bear we want
        Admin.findById(req.params.id, function(err, admin) {

            if (err)
                res.send(err);

            admin.admin = req.body;  // set the person

            // save the bear
            admin.save(function(err, data) {
                if (err)
                    res.send(err);

                res.json(data);
            });

        });
    });

router.route('/admin/:id')
    .delete(function(req, res) {

        Admin.remove({
            _id: req.params.id
        }, function(err, admin) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });

    });


router.route('/activity')
    // create a person 
    .post(function(req, res) {

        var activity = new Activity();      // create a new instance of the Bear model
        activity.name = req.body.name;  // set the bears name (comes from the request)
        activity.description = req.body.description;  // set the bears name (comes from the request)
        activity.type = req.body.type;  // set the bears name (comes from the request)
        activity.persons = req.body.persons;  // set the bears name (comes from the request)
        activity.profileimage = req.body.profileimage;  // set the bears name (comes from the request)
        activity.url = req.body.url;  // set the bears name (comes from the request)
        activity.points = req.body.points;  // set the bears name (comes from the request)
        // save the person and check for errors
        activity.save(function(err, data) {
            if (err)
                res.send(err);

            res.json(data);
        });

    });

router.route('/activity')
    .get(function(req, res) {

        Activity.find(function (err, docs) {
            res.json(docs);
        });

    });

router.route('/activity/:person')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .get(function(req, res) {

       if (req.params.id) {
            Person.find({persons: { "$in" : [person]} }, function (err, docs) {
                res.json(docs);
            });
       }
    });

app.use(fileUpload());
 
app.route('/upload')

    .post(function(req, res) {

        console.log("Api called" + req);

        if (!req.files)
        {
            console.log("Api called INSIDE");            
            return res.status(400).send('No files were uploaded.');
        }
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
        let sampleFile = req.files.sampleFile;
        
        // Use the mv() method to place the file somewhere on your server 
        console.log(sampleFile.name);
        
        sampleFile.mv('/uploads/' + sampleFile.name, function(err) {
            if (err)
            return res.status(500).send(err);
        
            res.send('File uploaded!');
        });
        console.log("Api called end");
});
module.exports = router;
