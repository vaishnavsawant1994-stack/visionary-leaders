const cron = require("node-cron");
const prisma = require("../config/prisma");

const startScheduler = () => {
  cron.schedule(
    "* * * * *", // every minute
    async () => {
      try {
        const now = new Date();

        console.log("⏰ Checking scheduled content at:", now);

        /* ================= ARTICLES ================= */
        /* ================= PUBLISH SCHEDULED ARTICLES ================= */
const scheduledArticles =
  await prisma.article.findMany({
    where: {
      status: "SCHEDULED",
      scheduledPublishDate: {
        not: null,
        lte: now,
      },
    },
  });

if (scheduledArticles.length > 0) {
  for (const article of scheduledArticles) {
    await prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        status: "PUBLISHED",
        publishDate: new Date(),
        scheduledPublishDate: null,
      },
    });

    console.log(
      `✅ Article Published: ${article.title}`
    );
  }
} else {
  console.log(
    "ℹ No scheduled articles to publish"
  );
}
        /* ================= MAGAZINES ================= */
        const scheduledMagazines =
          await prisma.magazine.findMany({
            where: {
              status: "SCHEDULED",
              scheduledPublishDate: {
                not: null,
                lte: now,
              },
            },
          });

        for (const magazine of scheduledMagazines) {
          await prisma.magazine.update({
            where: { id: magazine.id },
            data: {
              status: "PUBLISHED",
              publishDate: now,
              scheduledPublishDate: null,
            },
          });

          console.log(
            `✅ Magazine Published: ${magazine.title}`
          );
        }

        /* ================= BLOGS ================= */
        const scheduledBlogs =
          await prisma.blog.findMany({
            where: {
              status: "SCHEDULED",
              scheduledPublishDate: {
                not: null,
                lte: now,
              },
            },
          });

        for (const blog of scheduledBlogs) {
          await prisma.blog.update({
            where: { id: blog.id },
            data: {
              status: "PUBLISHED",
              publishDate: now,
              scheduledPublishDate: null,
            },
          });

          console.log(
            `✅ Blog Published: ${blog.title}`
          );
        }

        /* ================= NEWS ================= */
        const scheduledNews =
          await prisma.news.findMany({
            where: {
              status: "SCHEDULED",
              scheduledPublishDate: {
                not: null,
                lte: now,
              },
            },
          });

        for (const news of scheduledNews) {
          await prisma.news.update({
            where: { id: news.id },
            data: {
              status: "PUBLISHED",
              publishDate: now,
              scheduledPublishDate: null,
            },
          });

          console.log(
            `✅ News Published: ${news.title}`
          );
        }
      } catch (error) {
        console.error(
          "❌ Scheduler Error:",
          error.message
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log("✅ Scheduler started successfully");
};

module.exports = startScheduler;