import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
const razorpay = new Razorpay({
  key_id: `${process.env.key_id}`,
  key_secret: `${process.env.key_secret}`,
});

export const pay = (req, res) => {
  let { amount } = req.body;
  let options = {
    amount: amount * 100,
  };
  razorpay.orders.create(options, (err, order) => {
    if (err) {
      console.log(err);
      res.send({ data: err.message });
    } else {
      res.send(order);
    }
  });
};
