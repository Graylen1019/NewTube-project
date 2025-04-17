// TODO: Seed 

import { db } from "@/db";
import { categories } from "@/db/schema";


const categoryNames = [
    "Cars & Vehichles",
    "Comedy",
    "Education",
    "Gaming",
    "Entertainment",
    "Film & Animation",
    "How-to and Style",
    "Music",
    "News & Polotics",
    "People & Blogs",
    "Pets & Animals",
    "Science & Technology",
    "Sports",
    "Travel & Events"
];

async function Main() {
    console.log("Seeding Categories...")

    try {
        const values =categoryNames.map((name) => ({
            name,
            Description: `Videos related to ${name.toLowerCase()}`,
        }));

        await db.insert(categories).values(values)

        console.log("Categories Seeded Successfully!")
    } catch (error) {
        console.log("Error Seeding Categories: ", error)
        process.exit(1)
    }
}

Main()