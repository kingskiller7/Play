import Admin from '../models/Admin.js';

const checkPermissions = (requiredPermissions) => async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(401).json({ message: "Admin not found" });
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