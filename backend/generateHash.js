// generateHash.js
import bcrypt from "bcrypt";

const plainPassword = "SuperAdminPassword123!";

const run = async () => {
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log("Generated hash:", hash);
};

run();