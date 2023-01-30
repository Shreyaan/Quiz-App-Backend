import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: false,
        unique: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
    },
});
export default mongoose.model("User", UserSchema);
//# sourceMappingURL=User.js.map