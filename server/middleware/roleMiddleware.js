module.exports = function (roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access Denied: You do not have the required permissions' });
        }
        next();
    };
};
