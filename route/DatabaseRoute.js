import express from "express";
import { 
    CreateTransaction, 
    DeleteTransaction, 
    getTransaction, 
    Total
} from "../controllers/Transaction.js";
import { 
    CreateUser,
    DeleteUser,
    getUser, 
    getUserById, 
    UpdateUser
} from "../controllers/UserController.js";

const router = express.Router();

router.get('/register', getUser);
router.get('/register/:id', getUserById);
router.post('/register', CreateUser);
router.patch('/register/:id', UpdateUser);
router.delete('/register/:id', DeleteUser);

router.get('/total', Total);

router.get('/transaction', getTransaction);
router.post('/transaction', CreateTransaction);
router.delete('/transaction/:id', DeleteTransaction);


export default router;
