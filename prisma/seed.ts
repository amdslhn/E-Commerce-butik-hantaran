import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log('Seeding database...');

  // 1. Seed Roles
  const roles = [
    { id: 1, nama_role: 'Customer Reguler' },
    { id: 2, nama_role: 'Customer WO' },
    { id: 3, nama_role: 'Admin' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: role,
      create: role,
    });
  }
  console.log('✅ Roles seeded');

  // 2. Seed Services
  const services = [
    {
      id: 1,
      nama_desain: 'Rustic Wood Tray',
      deskripsi: 'Desain kayu natural yang hangat, bertema alam dan estetik',
      harga_reguler: 50000,
      harga_wo: 40000,
      image_url: null,
      is_active: true,
      is_unlimited: false,
      stok_box: 11,
    },
    {
      id: 2,
      nama_desain: 'Classic White Gold Tray',
      deskripsi: 'Perpaduan warna putih dan emas yang elegan dan klasik',
      harga_reguler: 50000,
      harga_wo: 50000,
      image_url: null,
      is_active: true,
      is_unlimited: false,
      stok_box: 16,
    },
    {
      id: 3,
      nama_desain: 'Pearl Tray',
      deskripsi: 'Berbalut hiasan mutiara mewah untuk kesan premium',
      harga_reguler: 80000,
      harga_wo: 45000,
      image_url: null,
      is_active: true,
      is_unlimited: false,
      stok_box: 10,
    },
    {
      id: 4,
      nama_desain: 'Crystal Tray',
      deskripsi: 'Desain akrilik bening mengkilap yang memantulkan cahaya',
      harga_reguler: 80000,
      harga_wo: 55000,
      image_url: null,
      is_active: true,
      is_unlimited: false,
      stok_box: 20,
    },
    {
      id: 5,
      nama_desain: 'Hidden Hantaran',
      deskripsi: 'Desain tertutup (acrylic box) eksklusif untuk menjaga kejutan',
      harga_reguler: 50000,
      harga_wo: 60000,
      image_url: null,
      is_active: true,
      is_unlimited: true,
      stok_box: 0,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: service,
      create: service,
    });
  }
  console.log('✅ Services seeded');

  // 3. Seed Users
  const users = [
    {
      id: 1,
      role_id: 3,
      nama: 'Bos Butik',
      email: 'admin@butikhantaran.com',
      password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      no_wa: '081234567890',
      created_at: new Date('2026-04-21T14:32:07.576089Z'),
      is_verified: true,
      google_id: null,
    },
    {
      id: 2,
      role_id: 1,
      nama: 'BIMA SAKTI FRANZA',
      email: 'innovatifplan@gmail.com',
      password_hash: '$2b$10$171DTKrec7K.qMhLH1DXfO7fOfWtCGAuKxt5DWZ0Bs7JXqthK66yq',
      no_wa: '085264117850',
      created_at: new Date('2026-04-21T07:32:27.533Z'),
      is_verified: true,
      google_id: null,
    },
    {
      id: 3,
      role_id: 1,
      nama: 'Ahmad Sholihin',
      email: 'ahmadsholihin.smp.it@gmail.com',
      password_hash: '$2b$10$mYidoPE/IkJA2qCNi/QO3ujxDELRKA1WFnui3VR/VQg4NOUemxY4a',
      no_wa: '085264117850',
      created_at: new Date('2026-04-25T04:16:46.138Z'),
      is_verified: true,
      google_id: null,
    },
    {
      id: 4,
      role_id: 1,
      nama: 'desain',
      email: 'uiuxdesain1@gmail.com',
      password_hash: null,
      no_wa: null,
      created_at: new Date('2026-04-30T03:48:35.467Z'),
      is_verified: true,
      google_id: '107229317703431930359',
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }
  console.log('✅ Users seeded');

  // 4. Update Auto-Increment Sequences
  // Since we are inserting with hardcoded IDs, we need to reset the sequence
  // so that new records won't collide with existing IDs.
  await prisma.$executeRawUnsafe(
    `SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));`
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));`
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`
  );
  console.log('✅ Sequences reset');

  console.log('🌱 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
