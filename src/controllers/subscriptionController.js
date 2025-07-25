const subscription = require("../models/subscription");
const validateData = require("../utils/validator")

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

    const sub = new subscription({
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
const removeSub = async (req,res)=>{
  try{
  const user = req.user._id;

  const {subId} = req.params;
  if(!subId){
    return res.status(400).send("Please provide a subsciption to remove");
  }
  const sub = await subscription.findOne({_id:subId,userId:user});
  if(!sub){
    return res.status(404).send("Not an existing subsctiption")
  }

  await subscription.findOneAndDelete({_id:subId,userId:user});
  res.send("Subscription removed succesfully");

  }catch(err){
    res.status(400).send("ERROR: "+ err.message);
  }

}

const updateSub = async (req, res) => {
  try {
    const { subId } = req.params;
    const user = req.user;

    const sub = await subscription.findOne({ _id: subId, userId: user._id });

    if (!sub) {
      return res.status(404).send("Subscription not found or not owned by user");
    }

    if (!validateData(req)) {
      return res.status(400).send("Invalid update fields");
    }

    Object.keys(req.body).forEach((key) => {
      sub[key] = req.body[key];
    });

    await sub.save();
    res.send(`${user.firstName}'s subscription updated successfully:\n${JSON.stringify(sub)}`);
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
};

const getAllSub = async (req, res) => {
  try {
    const userId = req.user._id;

    const allSub = await subscription.find({ userId }).lean();

    res.status(200).json(allSub);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {addSub,removeSub,updateSub,getAllSub}