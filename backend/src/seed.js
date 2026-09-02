import bcrypt from "bcrypt";
import prisma from "./lib/prisma.js";
const users = [
    {
        name: "Admin User",
        email: "admin@erp.com",
        password: "Password@123",
        role: "ADMIN",
    },
    {
        name: "Sales User",
        email: "sales@erp.com",
        password: "Password@123",
        role: "SALES",
    },
    {
        name: "Warehouse User",
        email: "warehouse@erp.com",
        password: "Password@123",
        role: "WAREHOUSE",
    },
    {
        name: "Accounts User",
        email: "accounts@erp.com",
        password: "Password@123",
        role: "ACCOUNTS",
    },
];
async function main() {
    for (const user of users) {
        const password = await bcrypt.hash(user.password, 10);
        await prisma.user.upsert({
            where: {
                email: user.email,
            },
            update: {
                name: user.name,
                password,
                role: user.role,
            },
            create: {
                name: user.name,
                email: user.email,
                password,
                role: user.role,
            },
        });
    }
    console.log("✅ Four demo users created");
}
main()
    .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map