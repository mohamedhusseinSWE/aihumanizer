const https = require("https");

const data = JSON.stringify({
  userId: "rX38N1DFFLwOwX6iyKPn0Lt2TblheIK9",
  planId: 1,
});

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/test-upgrade",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

console.log("🧪 Testing plan upgrade...");
console.log("📋 Data:", data);

const req = https.request(options, (res) => {
  let body = "";

  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    console.log("✅ Response received:");
    console.log(JSON.stringify(JSON.parse(body), null, 2));
  });
});

req.on("error", (error) => {
  console.error("❌ Error:", error.message);
});

req.write(data);
req.end();
