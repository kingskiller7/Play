import User from '../models/User.js';

const checkPermissions = (requiredPermissions) => async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        
        const admin = user.isAdmin;
        if (admin) {
            return next();
        }

        const hasPermissions = requiredPermissions.every((perm) => 
            admin.permissions.includes(perm)
        );
        if (!hasPermissions) {
            return res.status(403).json({
                message: "Forbidden: Insufficient permissions."
            });
        }

        next();
    } catch (error) {
        console.error("Permission middleware error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default checkPermissions;