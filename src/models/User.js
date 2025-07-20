const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 30
    },
    age: {
        type: Number,
        required: true,
        min:13
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new error("Not a valid Email")
            }
        }
    },
    password: {
        type: String,
        minLength:6,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new error("Please use a strong password")
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("User", userSchema,"Subscription Management")