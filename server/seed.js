require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./models/Item');
const Claim = require('./models/Claim');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const sampleItems = [
  {
    title: "Black Leather Wallet",
    type: "lost",
    category: "Wallet",
    description: "Black leather wallet with college student ID card inside",
    location: "College Canteen",
    color: "Black",
    date: new Date("2026-09-22"),
    status: "Open"
  },
  {
    title: "Found Black Wallet",
    type: "found",
    category: "Wallet",
    description: "Black wallet found near the canteen counter tables",
    location: "College Canteen",
    color: "Black",
    date: new Date("2026-09-23"),
    status: "Open"
  },
  {
    title: "Dell Laptop Charger",
    type: "lost",
    category: "Electronics",
    description: "65W USB-C charger left at library desk 4B",
    location: "Central Library",
    color: "Black",
    date: new Date("2026-09-20"),
    status: "Returned"
  },
  {
    title: "Set of Bike Keys",
    type: "found",
    category: "Keys",
    description: "Honda bike key with a blue rubber keychain",
    location: "Parking Lot B",
    color: "Silver",
    date: new Date("2026-09-24"),
    status: "Open"
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Item.deleteMany({});
  await Claim.deleteMany({});
  const createdItems = await Item.insertMany(sampleItems);
  
  // Create one sample pending claim on the found wallet
  await Claim.create({
    itemId: createdItems[1]._id,
    claimantId: new mongoose.Types.ObjectId(),
    message: "This is my wallet! It has a library card with my name inside."
  });

  console.log("✅ Seed data inserted successfully into MongoDB!");
  process.exit();
}

seed();