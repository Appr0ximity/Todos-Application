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
router.get("/todos", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.id;
    try {
        const todos = yield prisma_1.default.todo.findMany({
            where: {
                userId: userId
            }
        });
        return res.status(200).json({
            msg: "Successfully found all the todos",
            todos: todos
        });
    }
    catch (error) {
        console.log(error);
        return res.status(411).json({
            msg: "Error while fetching all todos"
        });
    }
}));
const todoObject = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string()
});
router.post("/todo", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { success } = todoObject.safeParse(req.body);
    const userId = Number(((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || {});
    console.log(userId);
    if (!success) {
        return res.status(411).json({
            msg: "Enter all the details!"
        });
    }
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(411).json({
                msg: "User not found"
            });
        }
        const response = yield prisma_1.default.todo.create({
            data: {
                title: req.body.title,
                description: req.body.description,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
        console.log(response);
        return res.status(200).json({
            msg: "Todo created successfully!"
        });
    }
    catch (error) {
        console.log(error);
    }
}));
router.patch("/add-type:id/:typeId", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoId = Number(req.params.id);
    const typeId = Number(req.params.typeId);
    try {
        const response = yield prisma_1.default.todo.update({
            where: {
                id: todoId
            }, data: {
                typeId: typeId
            }
        });
        console.log(response);
    }
    catch (error) {
        console.log(error);
    }
}));
router.delete("/delete:id", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoId = Number(req.params.id);
    try {
        const response = yield prisma_1.default.todo.delete({
            where: {
                id: todoId
            }
        });
        console.log(response);
    }
    catch (error) {
        console.log(error);
    }
}));
router.put("/todo:id", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoId = Number(req.query.id);
    try {
        const response = yield prisma_1.default.todo.update({
            where: {
                id: todoId
            }, data: {
                title: req.body.title,
                description: req.body.description,
            }
        });
        console.log(response);
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = router;
