"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(
  () => import("react-apexcharts"),
  { ssr: false }
);

interface RatingData {
  id: number;
  title: string;
  averageRating: number;
  totalRatings: number;
}

export default function RatingAnalyticsPage() {
  const [data, setData] = useState<RatingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/rating-analytics"
      );

      const result = await res.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: 40 }}>Loading analytics...</h2>;
  }

  const titles = data.map((item) => item.title);
  const avgRatings = data.map((item) => item.averageRating);
  const totalRatings = data.map((item) => item.totalRatings);

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>
        📊 Rating Analytics Dashboard
      </h1>

      {/* BAR CHART - AVERAGE RATINGS */}
      <div style={{ marginBottom: "50px" }}>
        <h2>Average Rating per Magazine</h2>

        <Chart
          type="bar"
          height={350}
          series={[
            {
              name: "Average Rating",
              data: avgRatings,
            },
          ]}
          options={{
            chart: {
              toolbar: { show: false },
            },
            xaxis: {
              categories: titles,
            },
            colors: ["#2563eb"],
          }}
        />
      </div>

      {/* BAR CHART - TOTAL RATINGS */}
      <div style={{ marginBottom: "50px" }}>
        <h2>Total Ratings per Magazine</h2>

        <Chart
          type="bar"
          height={350}
          series={[
            {
              name: "Total Ratings",
              data: totalRatings,
            },
          ]}
          options={{
            chart: {
              toolbar: { show: false },
            },
            xaxis: {
              categories: titles,
            },
            colors: ["#16a34a"],
          }}
        />
      </div>

      {/* PIE CHART - DISTRIBUTION */}
      <div>
        <h2>Rating Distribution</h2>

        <Chart
          type="pie"
          height={350}
          series={totalRatings}
          options={{
            labels: titles,
            colors: [
              "#2563eb",
              "#16a34a",
              "#f59e0b",
              "#ef4444",
              "#8b5cf6",
            ],
          }}
        />
      </div>
    </div>
  );
}