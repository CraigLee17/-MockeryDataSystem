// load up the user model
var User = require('./models/userModel');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function (req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
        // asynchronous
        process.nextTick(function () {
            User.findOne({'email': email}, function (err, user) {
                // if there are any errors, return the error
                if (err) {
                    return done(err);
                }
                // if no user is found, return the message
                if (!user) {
                    return done(null, false, 'No user found.');
                }
                if (!user.validPassword(password)) {
                    return done(null, false, 'Oops! Wrong password.');
                }
                if (!user.status) {
                    return done(null, false, 'Oops! Account disabled.');
                }
                else {
                    return done(null, user);
                }
            });
        });
    }));

passport.use('signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        process.nextTick(function () {
            var validatorSchema = {
                "username": {
                    notEmpty: true,
                    isLength: {
                        options: {
                            min: 3,
                            max: 10
                        },
                        errorMessage: "The length of Username Must be between 2 and 10 chars long"
                    },
                    errorMessage: "Invalid email"
                },
                "firstName": {
                    notEmpty: true,
                    errorMessage: "Invalid first name"
                },
                "lastName": {
                    notEmpty: true,
                    errorMessage: "Invalid last name"
                },
                "email": {
                    isEmail: {
                        errorMessage: "Invalid email"
                    }
                },
                "role": {
                    notEmpty: true,
                    isIn: {
                        options: [["admin", "user"]],
                        errorMessage: "Invalid role"
                    }
                },
                "status": {
                    notEmpty: true,
                    isIn: {
                        options: [[true, false]],
                        errorMessage: "Invalid status"
                    }
                },
                "password": {
                    notEmpty: true,
                    errorMessage: "Invalid Password"
                }
            };
            req.checkBody(validatorSchema);
            req.getValidationResult().then(function (result) {
                if (!result.isEmpty()) {
                    return done(null, false, result.array());
                } else {
                    User.findOne({'email': email}, function (err, user) {
                        if (err)
                            return done(err);
                        if (user) {
                            return done(null, false, 'That email is already taken.');
                        } else {
                            var newUser = new User();
                            newUser.username = req.body.username;
                            newUser.firstName = req.body.firstName;
                            newUser.lastName = req.body.lastName;
                            newUser.role = req.body.role;
                            newUser.status = req.body.status;
                            newUser.email = email;
                            newUser.password = newUser.generateHash(password);
                            // save the user
                            newUser.save(function (err, user) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                    });
                }
            });
        });

    }));

module.exports = passport;