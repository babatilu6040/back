import express from "express";
import Login from "../modules/auth/Login.js";
import Signup from "../modules/auth/Signup.js";
import Verify from "../modules/auth/Verify.js"

const auth = express.Router();

auth.post("/signup", async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const result = await Signup(firstname, lastname, email, password);
        res.status(200).json({ result })
    }
    catch (error) {
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

auth.post("/login", async (req, res) => {

    try {
        const { email, password, accesstoken, refreshtoken } = req.body;
        const result = await Login(email, password, accesstoken, refreshtoken)

        res.status(200).json({ result })
    }
    catch (error) {
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

auth.post("/verify", async (req, res) => {
    try {
        const { accesstoken, refreshtoken, accessid } = req.body;
        const result = await Verify(accesstoken, refreshtoken, accessid)

        res.status(200).json({ result })
    }
    catch (error) {
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

export default auth;
