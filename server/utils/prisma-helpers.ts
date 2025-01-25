import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export function getUserById(id: number) {
    return prisma.user.findUnique({
        where: { id },
    });
}
