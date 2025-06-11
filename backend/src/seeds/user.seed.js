"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../config/db"));
const user_model_1 = __importDefault(require("../models/user.model"));
dotenv_1.default.config();
const seedUsers = [
    // Female Users
    {
        email: "emma.thompson@example.com",
        fullName: "Emma Thompson",
        password: "123456",
        profilePictureture: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
        email: "olivia.miller@example.com",
        fullName: "Olivia Miller",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
        email: "sophia.davis@example.com",
        fullName: "Sophia Davis",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
        email: "ava.wilson@example.com",
        fullName: "Ava Wilson",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
        email: "isabella.brown@example.com",
        fullName: "Isabella Brown",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
        email: "mia.johnson@example.com",
        fullName: "Mia Johnson",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    {
        email: "charlotte.williams@example.com",
        fullName: "Charlotte Williams",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/women/7.jpg",
    },
    {
        email: "amelia.garcia@example.com",
        fullName: "Amelia Garcia",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/women/8.jpg",
    },
    // Male Users
    {
        email: "james.anderson@example.com",
        fullName: "James Anderson",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
        email: "william.clark@example.com",
        fullName: "William Clark",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
        email: "benjamin.taylor@example.com",
        fullName: "Benjamin Taylor",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
        email: "lucas.moore@example.com",
        fullName: "Lucas Moore",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
        email: "henry.jackson@example.com",
        fullName: "Henry Jackson",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
        email: "alexander.martin@example.com",
        fullName: "Alexander Martin",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
        email: "daniel.rodriguez@example.com",
        fullName: "Daniel Rodriguez",
        password: "123456",
        profilePicture: "https://randomuser.me/api/portraits/men/7.jpg",
    },
];
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        yield user_model_1.default.insertMany(seedUsers);
        console.log("Database seeded successfully");
    }
    catch (error) {
        console.error("Error seeding database:", error);
    }
});
// Call the function
seedDatabase();
