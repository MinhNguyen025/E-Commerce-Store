// // backend/seeders/productSeeder.js

// import mongoose from "mongoose";
// import { faker } from "@faker-js/faker";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// import Category from "../models/categoryModel.js";
// import Product from "../models/productModel.js";

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

// // Danh sách các URL ảnh Cloudinary mà bạn cung cấp
// const imageUrls = [
//   "https://res.cloudinary.com/dlw3tg7vf/image/upload/v1734536464/ecommerce/ecommerce/1734536460827-alex-knight-j4uuKnN43_M-unsplash.jpg",
//   "https://res.cloudinary.com/dlw3tg7vf/image/upload/v1731919499/ecommerce/v3mt5dudcldlwkfiirky.jpg",
//   "https://res.cloudinary.com/dlw3tg7vf/image/upload/v1731920491/ecommerce/jnslh2daw0ikbejjdl7s.jpg",
//   "https://res.cloudinary.com/dlw3tg7vf/image/upload/v1731921090/ecommerce/ecommerce/1731921085207-acer_nitro_5.webp",
//   // Thêm các URL ảnh khác nếu cần
// ];

// // Danh sách các danh mục công nghệ
// const techCategories = [
//   "Phones",
//   "Laptops",
//   "Televisions",
//   "Tablets",
//   "Cameras",
//   "Accessories",
//   "Gaming Consoles",
//   "Smart Home Devices",
//   "Wearables",
//   "Audio Equipment",
// ];

// // Hàm tạo sản phẩm
// const createProducts = async () => {
//   try {
//     console.log("Clearing old products...");
//     await Product.deleteMany();
//     console.log("Old products cleared.");

//     // Lấy các danh mục công nghệ đã được tạo
//     const categories = await Category.find({ name: { $in: techCategories } });
//     if (categories.length === 0) {
//       console.error("No technology categories found. Please seed categories first.");
//       process.exit(1);
//     }

//     console.log(`Found ${categories.length} technology categories.`);

//     const products = [];

//     for (let i = 0; i < 200; i++) {
//       const category = categories[faker.number.int({ min: 0, max: categories.length - 1 })];
//       const productName = faker.commerce.productName(); // Tên sản phẩm ngẫu nhiên
//       const brand = faker.company.name(); // Tên thương hiệu ngẫu nhiên

//       const product = {
//         name: productName,
//         image: imageUrls[faker.number.int({ min: 0, max: imageUrls.length - 1 })],
//         brand: brand,
//         quantity: faker.number.int({ min: 0, max: 100 }),
//         category: category._id,
//         description: faker.commerce.productDescription(),
//         rating: parseFloat(faker.number.float({ min: 1, max: 5, precision: 0.1 }).toFixed(1)),
//         numReviews: faker.number.int({ min: 0, max: 50 }),
//         price: parseFloat(faker.commerce.price({ min: 10, max: 2000, dec: 2 })),
//         countInStock: faker.number.int({ min: 0, max: 100 }),
//         reviews: [], // Khởi tạo mảng reviews trống
//       };

//       products.push(product);
//     }

//     console.log(`Generated ${products.length} products.`);

//     // Insert vào database
//     await Product.insertMany(products);
//     console.log("Products inserted into database.");
//   } catch (err) {
//     console.error("Error creating products:", err);
//     process.exit(1);
//   }
// };

// // Chạy script
// const runSeeder = async () => {
//   await connectDB();
//   await createProducts();
//   console.log("Seeding complete!");
//   process.exit();
// };

// runSeeder();
