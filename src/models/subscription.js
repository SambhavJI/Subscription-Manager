const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  subName: {
    type: String,
    required: true,
    maxLength: 50
  },
  category: {
    type: [String],
    validate: [array => array.length <= 10, "Maximum 10 categories allowed"]
  },
  amount: {
    type: Number,
    required: true,
    min:0,
    max:100000
  },
  billingCycle: {
    type: String,
    enum: {
      values: ["monthly", "yearly", "weekly", "daily"],
      message: props => `${props.value} is not a valid billing cycle`
    },
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  nextBillingDate: {
    type: Date
  },
  status: {
    type: String,
    enum: {
      values: ["Cancelled", "inactive", "active"],
      message: props => `${props.value} is not a valid status`
    },
    default: "active"
  },
  reminder: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
