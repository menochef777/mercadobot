"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    // Cria o papel "Admin" se não existir
    const roles = ['Admin', 'Manager', 'Seller'];
    for (const roleName of roles) {
        await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        });
    }
    // Cria permissões básicas se não existirem
    const permissions = ['CREATE_USER', 'DELETE_USER', 'UPDATE_USER', 'VIEW_USER'];
    for (const permissionName of permissions) {
        await prisma.permission.upsert({
            where: { name: permissionName },
            update: {},
            create: { name: permissionName },
        });
    }
    // Relaciona permissões ao papel "Admin"
    const adminRole = await prisma.role.findUnique({
        where: { name: 'Admin' },
    });
    if (!adminRole) {
        throw new Error('Erro ao encontrar o papel Admin.');
    }
    const allPermissions = await prisma.permission.findMany();
    for (const permission of allPermissions) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: permission.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: permission.id,
            },
        });
    }
    // Cria o usuário administrador se não existir
    const hashedPassword = bcryptjs_1.default.hashSync('admin123', 10);
    await prisma.user.upsert({
        where: { userName: 'admin' },
        update: {},
        create: {
            name: 'Administrator',
            email: 'admin@example.com',
            password: hashedPassword,
            userName: 'admin',
            cpf: '00000000000',
            roleName: "Admin",
        },
    });
    console.log('Usuário administrador criado com sucesso!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
