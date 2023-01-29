import jwt from "jsonwebtoken";
export const checkToken = async (req, res, next) => {
    const headers = req.headers;
    let token = headers["authorization"] ||
        headers["Authorization"];
    // Check if no token was provided
    if (!token) {
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    }
    try {
        // Remove Bearer from string
        if (typeof token !== "string")
            return res.status(400).json({ message: "Invalid token." });
        //subnstring
        const bearerToken = token.substring(7, token.length);
        token = bearerToken;
        // Verify the token
        if (!process.env.JWT_SECRET)
            return res.status(500).json({ message: "Internal server error" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //this works because of type in types.d.ts check it out
        req.user = decoded.user;
        console.log(req.user);
        next();
    }
    catch (error) {
        console.log(error);
        if (!res.headersSent)
            return res.status(400).json({ message: "Invalid token." });
    }
};
//# sourceMappingURL=auth.js.map