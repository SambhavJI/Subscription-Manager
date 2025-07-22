const validator = require("validator")

const validateData = (req) => {
    const allowedEdits = [
        "category", "amount", "billingCycle", "status"
    ]
    const isAllowed = Object.keys(req.body).every((feild) => {
    return allowedEdits.includes(feild);
});
    return isAllowed
}
module.exports=validateData;