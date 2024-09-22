"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../api/prisma"));
const jsonwebtoken_1 = require("jsonwebtoken");
const router = express_1.default.Router();
const signUp = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string()
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = signUp.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "Invalid Credentials"
        });
    }
    const currentUser = yield prisma_1.default.user.findUnique({
        where: {
            email: req.body.email
        }
    });
    if (currentUser != null) {
        return res.status(411).json({
            msg: "User already exists"
        });
    }
    try {
        const response = yield prisma_1.default.user.create({
            data: {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password
            },
        });
        console.log(response);
        return res.status(200).json({
            msg: "Sign up successful!"
        });
    }
    catch (error) {
        return res.status(401).json({
            msg: error
        });
    }
}));
const siginIn = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
router.get("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const SECRETKEY = process.env.SECRETKEY || "";
    const { success } = siginIn.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "Enter the proper details!"
        });
    }
    const currentUser = yield prisma_1.default.user.findUnique({
        where: {
            email: req.body.email
        }
    });
    if (!currentUser) {
        return res.status(411).json({
            msg: "You don't have an account linked to that email! Create an account to login"
        });
    }
    try {
        const token = (0, jsonwebtoken_1.sign)({
            id: currentUser.id
        }, SECRETKEY);
        return res.status(200).json({
            msg: "Sign in successful!",
            token: token
        });
    }
    catch (error) {
        return res.status(401).json({
            msg: error
        });
    }
}));
exports.default = router;
