const express = require("express");

const app = express();

app.use(express.static("public"));

// Simple working API
app.get("/jobs", async (req, res) => {
  try {
    const response = await fetch("https://remotive.com/api/remote-jobs?search=developer");
    const data = await response.json();

    const jobs = data.jobs.slice(0, 20).map(job => ({
      id: job.id,
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location,
      link: job.url
    }));

    res.json(jobs);

  } catch (err) {
    console.error("ERROR:", err);

    res.json([
      {
        id: 1,
        title: "Error loading jobs",
        company: "Check server",
        location: "Fix API",
        link: "#"
      }
    ]);
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});