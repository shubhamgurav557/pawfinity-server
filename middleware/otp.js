import Otp from "../models/Otp.js";

function generateOTP(length) {
    const characters = '0123456789';
    const OTPArray = [];

    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * characters.length);
        OTPArray.push(characters[index]);
    }

    return OTPArray.join('');
}

export const generateAndStoreOtp = async (email) => {
    const otp = generateOTP(6);
    const otpEntry = new Otp({email, otp});
    await otpEntry.save();
    return otp;
}

export const verifyAndDeleteOtp = async (email, otp) => {
    const validOtp = await Otp.findOneAndDelete({email, otp});
    return validOtp;
}