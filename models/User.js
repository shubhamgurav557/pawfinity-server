import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            min: 2,
            max: 100
        },
        lastname: {
            type: String,
            required: true,
            min: 2,
            max: 100
        },
        email: {
            type: String,
            required: true,
            max: 100,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        gender:{
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        alternateNumber: {
            type: String,
            default: null
        },
        profilePic: {
            type: String,
            default: null
        },
        petsPosted: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Pets'
            }
        ],
        isActive: {
            type: Boolean,
            default: false
        }
    }
);


UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model("User", UserSchema);
export default User;