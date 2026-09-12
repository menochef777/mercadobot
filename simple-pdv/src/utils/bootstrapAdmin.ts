import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function bootstrapAdmin() {
  try {
    // 1. Cria os papéis básicos
    const roles = ['Admin', 'Manager', 'Seller'];
    for (const roleName of roles) {
      await prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: { name: roleName },
      });
    }

    // 2. Cria permissões
    const permissions = ['CREATE_USER', 'DELETE_USER', 'UPDATE_USER', 'VIEW_USER'];
    for (const permissionName of permissions) {
      await prisma.permission.upsert({
        where: { name: permissionName },
        update: {},
        create: { name: permissionName },
      });
    }

    // 3. Associa permissões ao Admin
    const adminRole = await prisma.role.findUnique({
      where: { name: 'Admin' },
    });

    if (adminRole) {
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
    }

    // 4. Cria ou atualiza o usuário administrador padrão
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        password: hashedPassword,
      },
      create: {
        name: 'Administrator',
        email: 'admin@example.com',
        password: hashedPassword,
        userName: 'admin',
        cpf: '00000000000',
        roleName: 'Admin',
      },
    });

    console.log('✅ Usuário administrador garantido no banco:', adminUser.email);
  } catch (error) {
    console.warn('Aviso: Não foi possível verificar/criar admin no bootstrap (banco pode estar inicializando):', error);
  }
}
