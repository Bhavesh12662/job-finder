const puppeteer = require("puppeteer");
const fs = require("fs");

// helper delay function (works in all versions)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    slowMo: 100
  });

  const page = await browser.newPage();

  // Set user agent (important for avoiding bot detection)
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  // Open Indeed
  await page.goto("https://in.indeed.com", {
    waitUntil: "domcontentloaded"
  });

  console.log("👉 If verification appears, solve it manually...");

  // Wait 15 seconds for manual verification
  await delay(15000);

  // Wait for search input
  await page.waitForSelector('input[name="q"]');

  // Enter job role
  await page.click('input[name="q"]', { clickCount: 3 });
  await page.type('input[name="q"]', "Frontend Developer");

  await delay(1000);

  // Enter location
  await page.click('input[name="l"]', { clickCount: 3 });
  await page.type('input[name="l"]', "India");

  await delay(1000);

  // Click search
  await page.click('button[type="submit"]');

  // Wait for results
  await page.waitForSelector(".job_seen_beacon");

  await delay(2000);

  // Extract job data
  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".job_seen_beacon"))
      .slice(0, 10)
      .map(job => {
        const title = job.querySelector("h2 a")?.innerText || "N/A";
        const company = job.querySelector(".companyName")?.innerText || "N/A";
        const location = job.querySelector(".companyLocation")?.innerText || "N/A";
        const link = job.querySelector("h2 a")?.href || "N/A";

        return { title, company, location, link };
      });
  });

  console.log("\n✅ Jobs Found:\n", jobs);

  // Save to JSON file
  fs.writeFileSync("jobs.json", JSON.stringify(jobs, null, 2));

  console.log("\n📁 Saved to jobs.json");

  await browser.close();
})();