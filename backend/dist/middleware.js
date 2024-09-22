"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const auth = (req, res, next) => {
    const SECRETKEY = process.env.SECRETKEY || "";
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith("Bearer ")) {
        return res.status(411).json({
            msg: "Invalid Token"
        });
    }
    const token = authToken.split(' ')[1];
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, SECRETKEY);
        const id = Number(decoded.id);
        if (!id) {
            return res.status(411).json({
                msg: "Invalid token"
            });
        }
        req.user = req.user || {};
        req.user.id = id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            msg: "Invalid Token"
        });
    }
};
exports.auth = auth;
