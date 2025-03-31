
const LocalStrategy = require('passport-local').Strategy;

const Admin = require('../models/admin');
const bcrypt = require('bcrypt');

module.exports = function(passport) {
    passport.use('admin', new LocalStrategy(
        async (username, password, done) => {
            try {
                const user = await Admin.findOne({ username });
                console.log(user)
                if (!user) return done(null, false, { message: 'Incorrect username.' });

                const isMatch = await bcrypt.compare(password, user.Password);
                if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));
    passport.serializeUser ((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser (async (id, done) => {
        // You can implement logic to find user in either collection based on the id
        // For simplicity, we will just return null here
        const user = await Admin.findById(id);
        done(null, user);
    });
};
