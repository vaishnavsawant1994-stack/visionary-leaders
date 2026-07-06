const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/* REUSABLE FETCH FUNCTION */
const fetchData = async (endpoint) => {
  try {
    const res = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(
        `API Error: ${res.status}`
      );
    }

    const data = await res.json();

    // Supports both:
    // [ ... ]
    // { success: true, data: [...] }
    return Array.isArray(data)
      ? data
      : data?.data || [];
  } catch (error) {
    console.error(
      `Fetch error (${endpoint}):`,
      error
    );
    return [];
  }
};

/* MAGAZINES */
export const getMagazines =
  async (category = "") => {
    const query = category
      ? `?category=${encodeURIComponent(
          category
        )}`
      : "";

    return fetchData(
      `/magazines${query}`
    );
  };

/* ARTICLES */
export const getArticles =
  async () => {
    return fetchData("/articles");
  };

/* CATEGORIES */
export const getCategories =
  async () => {
    return fetchData("/categories");
  };

/* BLOGS */
export const getBlogs =
  async () => {
    return fetchData("/blogs");
  };

/* NEWS */
export const getNews =
  async () => {
    return fetchData("/news");
  };

/* SUBSCRIBERS */
export const getSubscribers =
  async () => {
    return fetchData(
      "/subscribers"
    );
  };