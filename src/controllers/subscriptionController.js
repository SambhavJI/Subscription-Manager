const subscription = require("../models/subscription");
const Subscription = require("../models/subscription");

const addSub = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subName, category, amount, billingCycle, startDate, status } = req.body;
    const alrExist = await subscription.findOne({subName})
    if(alrExist){
        throw new Error("Subscription already exists")
    }
    let date = new Date(startDate);

    if (billingCycle === "monthly") {
      date.setMonth(date.getMonth() + 1);
    } else if (billingCycle === "daily") {
      date.setDate(date.getDate() + 1);
    } else if (billingCycle === "weekly") {
      date.setDate(date.getDate() + 7);
    } else if (billingCycle === "yearly") {
      date.setFullYear(date.getFullYear() + 1);
    }

    const nextBillingDate = date;

    const sub = new Subscription({
      userId,
      subName,
      category,
      amount,
      billingCycle,
      startDate,
      status,
      nextBillingDate,
    });

    await sub.save();
    res.status(201).send("Subscription Added Successfully");
  } catch (err) {
    res.status(400).send("Could Not Add the Subscription: " + err.message);
  }
};
module.exports = addSub