const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin created:", admin);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();