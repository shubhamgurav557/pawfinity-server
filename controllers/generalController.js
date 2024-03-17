import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import storage from "../firebase.js";
import { generateAndStoreOtp, verifyAndDeleteOtp } from "../middleware/otp.js";
import { sendOtpByEmail } from "../middleware/triggeremail.js";
import { OAuth2Client } from 'google-auth-library';

const generateToken = async (email) => {
    let user = await User.findOne({ email });
    const token = jwt.sign({ userId: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname, phoneNumber: user.phoneNumber, city: user.city, state: user.state, country: user.country, gender: user.gender }, process.env.SECRET_KEY, { expiresIn: '7d' });
    return token;
}

export const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const enteredPassword = req.body.password.trim();
            const storedHashedPassword = user.password.trim();
            const isPasswordValid = await bcrypt.compareSync(enteredPassword, storedHashedPassword);
            if (isPasswordValid) {
                const token = await generateToken(user.email);
                return res.json({ success: true, message: 'Login Successfull', token });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid Password' });
            }
        } else {
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }
    } catch (error) {
        console.log('Server - ', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export const createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password, country, state, city, gender, phoneNumber } = req.body;
        const userVerify = await User.findOne({ email });
        if (userVerify) {
            return res.status(500).json({ message: 'User Already Exists' });
        }
        const otp = await generateAndStoreOtp(email);

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            phoneNumber,
            gender,
            country,
            state,
            city
        });

        const savedUser = await newUser.save();
        if (savedUser) {
            await sendOtpByEmail(email, otp, firstname, lastname);
            return res.status(200).json({ otp: true, message: 'OTP Sent Successfully' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUserDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id }).select({ _id: 0, password: 0 });
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(400).json({ message: "User Not Found" });
        }
    } catch (error) {

    }
}

export const updateUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if (req.files[0].fieldname === 'profilePic') {
            const imageFile = req.files[0];
            const imageRef = ref(storage, `public/${user._id}/${imageFile.originalname}`);

            try {
                const snapshot = await uploadBytes(imageRef, imageFile.buffer);
                const imageUrl = await getDownloadURL(imageRef);
                console.log('Image URL:', imageUrl);
                user.profilePic = imageUrl;
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        Object.keys(updates).forEach((key) => {
            user[key] = updates[key];
        });

        await user.save();

        res.status(200).json({ message: "User details updated successfully", user, success: true });
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        console.log(req.body, '--------------------------------------------------')
        const isValidOtp = await verifyAndDeleteOtp(email, otp);
        if (isValidOtp) {
            await User.updateOne({ email }, { isActive: true })
            let token = await generateToken(email);
            return res.status(200).json({ success: true, message: 'OTP Verification Successful', token });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid Otp' });
        }
    } catch (error) {
        cosole.log('Error verifying otp', error)
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}


export const verifyGoogleToken = async (req, res) => {
    try {
        const idToken = req.body.credential;
        const client = new OAuth2Client({
            clientId: process.env.GOOGLE_ID
        });

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_ID
        })

        console.log('GOOGLE Token Verification', ticket);

    } catch (error) {
        console.log('GOOGLE Token Verification Error', error);
    }
}
