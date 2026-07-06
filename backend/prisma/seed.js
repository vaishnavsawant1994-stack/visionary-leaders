const prisma = require("../config/prisma");

async function main() {
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@test.com",
      password: "123456",
      role: "ADMIN",
    },
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });