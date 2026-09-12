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

    // 4. Cria ou atualiza o usuário administrador configurado
    const adminEmail = (process.env.ADMIN_EMAIL || 'mmbompreco33@gmail.com').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || 'bompreco').trim();
    const adminName = process.env.ADMIN_NAME || 'MiniMercado BomPreço';
    const adminUserName = (process.env.ADMIN_USERNAME || 'bompreco').trim().toLowerCase();

    const hashedPassword = bcrypt.hashSync(adminPassword, 10);

    // Verifica se já existe um usuário com este email
    const existingByEmail = await prisma.user.findFirst({
      where: { email: { equals: adminEmail, mode: 'insensitive' } },
    });

    if (existingByEmail) {
      await prisma.user.update({
        where: { userId: existingByEmail.userId },
        data: {
          password: hashedPassword,
          name: adminName,
          roleName: 'Admin',
        },
      });
      console.log('✅ Usuário administrador atualizado com sucesso:', adminEmail);
      return;
    }

    // Verifica se existe o antigo admin padrão (admin@example.com) para migrar
    const defaultAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'admin@example.com' },
          { userName: 'admin' },
        ],
      },
    });

    if (defaultAdmin) {
      await prisma.user.update({
        where: { userId: defaultAdmin.userId },
        data: {
          email: adminEmail,
          userName: adminUserName,
          name: adminName,
          password: hashedPassword,
          roleName: 'Admin',
        },
      });
      console.log('✅ Usuário administrador padrão migrado para:', adminEmail);
      return;
    }

    // Se nenhum existe, cria novo usuário garantindo CPF e username únicos
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        userName: adminUserName,
        cpf: '00000000000',
        roleName: 'Admin',
      },
    });

    console.log('✅ Usuário administrador criado com sucesso no banco:', adminEmail);
  } catch (error) {
    console.error('❌ Erro no bootstrap de admin:', error);
  }
}
