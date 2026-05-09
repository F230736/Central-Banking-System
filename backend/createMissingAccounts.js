const mongoose = require("mongoose");
const User = require("./models/User");
const Account = require("./models/Account");
require("dotenv").config();

async function createMissingAccounts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB\n");

    const users = await User.find();
    console.log(`Found ${users.length} users\n`);

    let created = 0;
    let existing = 0;

    for (const user of users) {
      const account = await Account.findOne({ user: user._id });
      
      if (!account) {
        const accountNumber = Math.floor(100000000 + Math.random() * 900000000).toString();
        await Account.create({
          user: user._id,
          accountNumber: accountNumber,
          balance: 5000,
          status: "active"
        });
        console.log(`✅ Created account for: ${user.email} → ${accountNumber}`);
        created++;
      } else {
        console.log(`✓ Account exists for: ${user.email} → ${account.accountNumber}`);
        existing++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created} accounts`);
    console.log(`   Existing: ${existing} accounts`);
    console.log(`   Total users: ${users.length}`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

createMissingAccounts();