import axios from "axios";

export const createSubscription = async (planType, deliveryType, meals) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `/api/subscriptions/subscribe`,
    { planType, deliveryType, meals },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
