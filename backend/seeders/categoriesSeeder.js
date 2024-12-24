// // backend/seeders/categorySeeder.js

// import mongoose from "mongoose";
// import { faker } from "@faker-js/faker";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// import Category from "../models/categoryModel.js";

// // Xác định __dirname để làm việc với ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load biến môi trường từ thư mục gốc
// dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// // Kiểm tra biến môi trường
// if (!process.env.MONGO_URI) {
//   console.error("MONGO_URI is not defined in .env file");
//   process.exit(1);
// }

// // Kết nối tới MongoDB
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to MongoDB");
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//     process.exit(1);
//   }
// };

// const createCategories = async () => {
//   try {
//     console.log("Clearing old categories...");
//     await Category.deleteMany();
//     console.log("Old categories cleared.");

//     // Định nghĩa các danh mục công nghệ
//     const techCategories = [
//       "Phones",
//       "Laptops",
//       "Televisions",
//       "Tablets",
//       "Cameras",
//       "Accessories",
//       "Gaming Consoles",
//       "Smart Home Devices",
//       "Wearables",
//       "Audio Equipment",
//     ];

//     // Thêm các danh mục công nghệ
//     console.log("Creating technology categories...");
//     const techCategoryDocs = techCategories.map((name) => ({ name }));
//     await Category.insertMany(techCategoryDocs);
//     console.log(`${techCategoryDocs.length} technology categories created.`);

//     // Tiếp tục tạo các danh mục khác
//     console.log("Creating additional categories...");
//     const predefinedCategories = [
//       "Clothing",
//       "Movies",
//       "Industrial",
//       "Tools",
//       "Beauty",
//       "Games",
//       "Jewelry",
//       "Home",
//       "Garden",
//       "Books",
//       "Music",
//       "Automotive",
//       "Outdoors",
//       "Shoes",
//       "Kids",
//       "Baby",
//       "Toys",
//       "Sports",
//       "Grocery",
//       "Computers",
//       "Electronics",
//       "Health",
//       "Office",
//       "Pets",
//       "Art",
//     ];

//     const categoryNames = new Set();

//     while (categoryNames.size < (500 - techCategories.length)) {
//       const baseCategory = predefinedCategories[
//         faker.number.int({ min: 0, max: predefinedCategories.length - 1 })
//       ];
//       const uniqueCategory = `${baseCategory}_${faker.string.uuid().slice(0, 5)}`;
//       categoryNames.add(uniqueCategory);
//     }

//     console.log(`Generated ${categoryNames.size} unique categories.`);
//     console.log("Inserting additional categories into database...");

//     const additionalCategories = Array.from(categoryNames).map((name) => ({ name }));
//     const createdCategories = await Category.insertMany(additionalCategories);
//     console.log(`${createdCategories.length} additional Categories created.`);
//   } catch (err) {
//     console.error("Error creating Categories:", err);
//     process.exit(1);
//   }
// };

// // Chạy script
// const runSeeder = async () => {
//   await connectDB();
//   await createCategories(); // Chỉ tạo Categories
//   console.log("Seeding complete!");
//   process.exit();
// };

// runSeeder();
