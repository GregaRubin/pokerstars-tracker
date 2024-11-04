var UserModel = require('../models/userModel.js');
var defaultImage = "images/6568d7af3ff9cb4e87ac8ff49263daab";
var path = require('path');
var bcrypt = require('bcrypt');
var fs = require('fs');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {
    update: function(req, res, next){
        console.log("updating user with public status:", req.body.publicStats);
        var id = req.session.userId;
        const file = req.file;

        UserModel.findOne({_id: id}, function(err, user){
            if (err) {
                var err = new Error('Error when getting user!');
                    err.status = 500;
                    return next(err);
            }

            if (!user) {
                var err = new Error('No such user');
                    err.status = 400;
                    return next(err);
            }


            if (file && file.length != 0){
                if(! (user.imagePath == defaultImage)){
                    const oldPath = path.join(__dirname, "..", "public/", user.imagePath);
                    console.log("deleting " + oldPath);
                    if (fs.existsSync(oldPath)) {
                        fs.unlink(oldPath, (err) => {
                          if (err) {
                            var err = new Error('Error when deleting old profile image');
                            console.log("Error deleting image");
                            err.status = 500;
                            return next(err);
                          }
                        });
                      }
                }
    
                var newPath = '/images/'+file.filename;
                console.log("changing image to ", newPath);
    
                UserModel.updateOne({_id: id}, {imagePath: newPath, publicStats: req.body.publicStats}, function(err, user){
                    if(err){
                        var err = new Error('Error when saving user');
                            err.status = 500;
                            return next(err);
                    }
                })

            } else{
                UserModel.updateOne({_id: id}, {publicStats: req.body.publicStats}, function(err, user){
                    if(err){
                        var err = new Error('Error when saving user');
                            err.status = 500;
                            return next(err);
                    }
                })
            }
            return res.status(200).json(user);
        });
    },

    /**
     * userController.leaderboards()
     */
    leaderboards: function (req, res, next) {
        UserModel.find({publicStats: true}).sort({profit: -1}).exec(function (err, users) {
            if (err) {
                var err = new Error('Error when getting users');
                err.status = 500;
                return next(err);
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.create()
     */
    create: function (req, res, next) {
        var user = new UserModel({
			username : req.body.username,
			password : req.body.password,
			email : req.body.email,
            imagePath: defaultImage,
            publicStats: true,
            sessions: 0,
            hands: 0,
            profit: 0,
            call: 0,
            raise: 0,
            fold: 0,
            bet: 0,
            threeBet: 0,
            showdown: 0,
            wonShowdown: 0,
            vpip: 0,
            pfr: 0,
        });

        bcrypt.hash(user.password, 10, function(err, hash){
            if(err){
                return next(err);
            } else{
                user.password = hash;
                user.save(function (err, user) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating user',
                            error: err
                        });
                    }
        
                    return res.status(201).json(user);
                    //return res.redirect('/users/login');
                });
            }
        })
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    login: function(req, res, next){
        UserModel.authenticate(req.body.username, req.body.password, function(err, user){
            if(err || !user){
                var err = new Error('Wrong username or password');
                err.status = 401;
                return next(err);
            }
            req.session.userId = user._id;
            //res.redirect('/users/profile');
            return res.json(user);
        });
        
    },

    profile: function(req, res,next){
        UserModel.findById(req.session.userId)
        .exec(function(error, user){
            if(error){
                return next(error);
            } else{
                if(user===null){
                    var err = new Error('Not authorized, go back!');
                    err.status = 400;
                    return next(err);
                } else{
                    //return res.render('user/profile', user);
                    return res.json(user);
                }
            }
        });  
    },

    logout: function(req, res, next){
        console.log("Session destroyed");
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    var err = new Error('Error when destroying session');
                    err.status = 500;
                    return next(err);
                } else{
                    //return res.redirect('/');
                    return res.status(201).json({message:"Success"});
                }
            });
        }
    }
};
