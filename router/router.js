const express = require('express');
const router = express.Router();
const User = require("../Models/User");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const upload = multer({ dest: 'Uploads/' });

// Add User
router.post("/add", upload.single('image'), async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            city: req.body.city,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename
        });
        await user.save();
        req.session.message = {
            type: "success",
            message: "Added successfully"
        };
        res.redirect("/");
    } catch (err) {
        console.log("all error", err.message);
        req.session.message = {
            type: "danger",
            message: "User not added"
        };
        res.redirect("/");
    }
});

// Get Users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().exec();
        const message = req.session.message;
        delete req.session.message; // Empty Session

        res.render('index', {
            title: 'Home Page',
            users: users,
            message: message,
        });
    } catch (err) {
        console.log(err.message);
        req.session.message = {
            type: 'danger',
            message: "Failed to Fetch Users"
        };
        res.redirect('/');
    }
});

// Edit User
router.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).exec();
        if (!user) {
            console.log('User not found');
            res.redirect('/');
            return;
        }

        res.render('edit_user', {
            title: "Edit User",
            user: user,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// Delete User
router.get("/delete/:id", async (req, res) => {
    const delete_id = req.params.id;
    try {
        const user = await User.findOneAndDelete({ _id: delete_id }).exec();
        if (user && user.image) {
            const imagePath = `./Uploads/${user.image}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log("User image deleted");
            }
        }
        req.session.message = {
            type: 'success',
            message: "User deleted successfully"
        };
        res.redirect('/');
    } catch (err) {
        console.error("Error:", err.message);
        req.session.message = {
            type: 'danger',
            message: "Failed to delete user"
        };
        res.redirect('/');
    }
});

// Update User
router.post("/update/:id", upload.single('image'), async (req, res) => {
    const save_id = req.params.id;
    const old_image = req.body.old_image;
    const new_file = req.file ? req.file.filename : old_image;

    try {
        const user = await User.findByIdAndUpdate(save_id, {
            name: req.body.name,
            city: req.body.city,
            email: req.body.email,
            phone: req.body.phone,
            image: new_file
        }, { new: true });

        if (req.file && old_image && old_image !== req.file.filename) {
            const oldImagePath = `./Uploads/${old_image}`;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
                console.log("Old image deleted");
            }
        }

        req.session.message = {
            type: 'success',
            message: "User updated successfully"
        };
        res.redirect('/');
    } catch (err) {
        console.error("Error:", err.message);
        req.session.message = {
            type: 'danger',
            message: "Failed to update user"
        };
        res.redirect('/');
    }
});

module.exports = router;
