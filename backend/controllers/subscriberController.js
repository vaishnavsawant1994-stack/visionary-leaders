const prisma = require("../config/prisma");

/* ================= SUBSCRIBE ================= */
const subscribe = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    email = email.trim().toLowerCase();

    const existingSubscriber = await prisma.subscriber.findFirst({
      where: { email },
    });

    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        message: "Already subscribed",
      });
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: subscriber,
    });
  } catch (error) {
    console.error("SUBSCRIBE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SUBSCRIBERS ================= */
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    console.error("GET SUBSCRIBERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

module.exports = {
  subscribe,
  getSubscribers,
};