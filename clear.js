// clear.js
const mongoose = require("mongoose");

const DB_URI = "mongodb://127.0.0.1:27017/your-db-name"; // change to your DB

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => console.error("Connection error:", err));
db.once("open", async () => {
  console.log("MongoDB connected");

  try {
    await db.dropDatabase();
    console.log("Database dropped successfully");
  } catch (err) {
    console.error("Error dropping database:", err);
  } finally {
    mongoose.connection.close(); // close the connection
  }
});
