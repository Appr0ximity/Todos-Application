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
const middleware_1 = require("../middleware");
const prisma_1 = __importDefault(require("../api/prisma"));
const zod_1 = require("zod");
const router = express_1.default.Router();
//get all the types
router.get("/types", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const types = yield prisma_1.default.type.findMany();
        return res.status(200).json({
            msg: "Successfully found all the types",
            types: types
        });
    }
    catch (error) {
        console.log(error);
        return res.status(411).json({
            msg: "Error while fetching all types!"
        });
    }
}));
const type = zod_1.z.object({
    type: zod_1.z.string()
});
//create a new type
router.post("/type", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = type.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "Enter a valid type!"
        });
    }
    try {
        const response = yield prisma_1.default.type.create({
            data: {
                type: req.body.type
            }
        });
        console.log(response);
        return res.status(200).json({
            msg: "Successfully created a new type!"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: "Error while creating a type"
        });
    }
}));
exports.default = router;
