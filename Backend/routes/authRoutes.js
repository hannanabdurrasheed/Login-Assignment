const express = require("express");
const bcrypt = require("bcryptjs");
const { sql } = require("../db");

const router = express.Router();

/* ==========================
   REGISTER USER
========================== */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid Gmail address."
            });
        }

        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

        if (!passwordPattern.test(password)) {
            return res.status(400).json({
                message:
                    "Password must contain uppercase, lowercase, number and special character."
            });
        }

        // Check if email already exists
        const existing = await sql.query`
            SELECT * FROM Users WHERE email = ${email}
        `;

        if (existing.recordset.length > 0) {
            return res.status(400).json({
                message: "Email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await sql.query`
            INSERT INTO Users(name,email,password)
            VALUES(${name},${email},${hashedPassword})
        `;

        res.json({
            message: "Registration successful."
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error."
        });
    }
});

/* ==========================
   LOGIN USER
========================== */
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        const result = await sql.query`
            SELECT * FROM Users WHERE email = ${email}
        `;

        if (result.recordset.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = result.recordset[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        res.json({
            message: "Login Successful!"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server error."
        });

    }

});

module.exports = router;