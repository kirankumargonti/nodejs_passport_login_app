module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("errorMessage", "Please login to view that resource");
        res.redirect('/users/login');
    },
    forwardAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/dashboard');
    }
}