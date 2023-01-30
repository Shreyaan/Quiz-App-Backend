import mongoose from "mongoose";
const HighScore = new mongoose.Schema({
    quizSlug: {
        type: String,
        required: true
    },
    playerName: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});
export default mongoose.model("HighScore", HighScore);
//# sourceMappingURL=highScore.js.map