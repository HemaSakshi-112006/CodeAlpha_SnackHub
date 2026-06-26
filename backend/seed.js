const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

// Your PRODUCTS array (paste from frontend)
const PRODUCTS = [
  { name:"KitKat", price:50, category:"Chocolates", emoji:"🍫", image:"images/kitkat.png", gradient:"linear-gradient(135deg,#b22222,#e84040)", rating:4.5, reviews:128, description:"Delicious crispy wafer fingers..." },
  { name:"Dairy Milk", price:80, category:"Chocolates", emoji:"🍫", image:"images/dairymilk.png", gradient:"linear-gradient(135deg,#6b3a2a,#c0714f)", rating:4.8, reviews:245, description:"Silky smooth milk chocolate..." },
  { name:"5 Star", price:30, category:"Chocolates", emoji:"⭐", image:"images/5star.png", gradient:"linear-gradient(135deg,#8B6914,#F4C430)", rating:4.2, reviews:98, description:"Caramel chocolate..." },
  { name:"Oreo", price:30, category:"Cookies", emoji:"🍪", image:"images/oreo.png", gradient:"linear-gradient(135deg,#1a1a2e,#3a3a5c)", rating:4.7, reviews:312, description:"Chocolate cookies..." },
  { name:"Bourbon", price:25, category:"Cookies", emoji:"🍪", image:"images/bourbon.png", gradient:"linear-gradient(135deg,#3d1f00,#7a3f0f)", rating:4.3, reviews:87, description:"Chocolate biscuit..." },
  { name:"Good Day", price:35, category:"Cookies", emoji:"☀️", image:"images/goodday.png", gradient:"linear-gradient(135deg,#b8860b,#ffd700)", rating:4.1, reviews:74, description:"Butter biscuits..." },
  { name:"Coca Cola", price:40, category:"Drinks", emoji:"🥤", image:"images/cola.png", gradient:"linear-gradient(135deg,#8b0000,#cc0000)", rating:4.6, reviews:196, description:"Soft drink..." },
  { name:"Sprite", price:40, category:"Drinks", emoji:"🥤", image:"images/sprite.png", gradient:"linear-gradient(135deg,#1a6b2a,#50c878)", rating:4.4, reviews:143, description:"Lemon soda..." },
  { name:"Frooti", price:20, category:"Drinks", emoji:"🥭", image:"images/frooti.png", gradient:"linear-gradient(135deg,#d4770a,#ffb347)", rating:4.5, reviews:167, description:"Mango drink..." },
  { name:"Lays Classic", price:20, category:"Chips", emoji:"🍟", image:"images/lays.png", gradient:"linear-gradient(135deg,#8b7000,#e6b800)", rating:4.3, reviews:221, description:"Crispy chips..." },
  { name:"Kurkure", price:20, category:"Chips", emoji:"🌶️", image:"images/kurkure.png", gradient:"linear-gradient(135deg,#8b1a00,#ff4500)", rating:4.6, reviews:289, description:"Spicy snacks..." },
  { name:"Pringles", price:150, category:"Chips", emoji:"🍟", image:"images/pringles.png", gradient:"linear-gradient(135deg,#8b0000,#dc143c)", rating:4.4, reviews:134, description:"Stacked chips..." }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
  }
};

const seedDB = async () => {
  try {
    await Product.deleteMany(); // clears old data
    await Product.insertMany(PRODUCTS);

    console.log("Products Inserted Successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

connectDB().then(seedDB);