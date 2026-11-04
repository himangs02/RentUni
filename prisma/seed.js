const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CampusCloset seed...');

  // Clean existing data
  await prisma.inquiry.deleteMany();
  await prisma.rentalTransaction.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Users
  const userAlex = await prisma.user.create({
    data: {
      id: 'user-alex',
      name: 'Alex Rivera',
      email: 'alex@stanford.edu',
      password: passwordHash,
      university: 'Stanford University',
      phone: '+1 (650) 555-0142',
      role: 'Alum/Senior',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      verifiedStudent: true,
      dormLocation: 'Wilbur Hall, East Campus',
      bio: 'Graduating CS Senior moving to NYC! Renting & selling my dorm gear in pristine condition. Quick responses on WhatsApp.',
    },
  });

  const userSarah = await prisma.user.create({
    data: {
      id: 'user-sarah',
      name: 'Sarah Chen',
      email: 'sarah@stanford.edu',
      password: passwordHash,
      university: 'Stanford University',
      phone: '+1 (650) 555-0189',
      role: 'Alum/Senior',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      verifiedStudent: true,
      dormLocation: 'Florence Moore Hall',
      bio: 'Senior Econ major subletting furniture and premium electronics. Always happy to drop off around White Plaza.',
    },
  });

  const userEmma = await prisma.user.create({
    data: {
      id: 'user-emma',
      name: 'Emma Watson',
      email: 'emma@stanford.edu',
      password: passwordHash,
      university: 'Stanford University',
      phone: '+1 (650) 555-0271',
      role: 'Student',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      verifiedStudent: true,
      dormLocation: 'Roble Hall',
      bio: 'Sophomore premed looking for affordable semester rentals and textbooks. 5-star verified campus borrower.',
    },
  });

  const userMarcus = await prisma.user.create({
    data: {
      id: 'user-marcus',
      name: 'Marcus Vance',
      email: 'marcus@stanford.edu',
      password: passwordHash,
      university: 'Stanford University',
      phone: '+1 (650) 555-0399',
      role: 'Alum/Senior',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      verifiedStudent: true,
      dormLocation: 'Rains Houses, Grad Housing',
      bio: 'Coterm Mechanical Engineering student. Selling heavy dorm furniture before heading to Seattle.',
    },
  });

  console.log('✅ Seeded 4 campus users');

  // 2. Seed Items
  const items = [
    {
      id: 'item-mini-fridge',
      title: 'Compact 3.2 Cu. Ft. Mini Refrigerator with Freezer',
      description: 'Energy-star certified 2-door compact dorm mini fridge with separate freezer compartment. Quiet compressor (dorm friendly < 38dB), ice tray included, adjustable thermostat. Perfect for keeping drinks cold and meal prep frozen. Cleaned and sanitized!',
      category: 'Appliances',
      listingType: 'RENT',
      rentalRate: 1.50,
      rentalPeriod: 'daily',
      securityDeposit: 35.0,
      condition: 'Like New',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
      ]),
      sellerId: userAlex.id,
      isAvailable: true,
      location: 'Wilbur Hall (Can deliver with dolly)',
      viewsCount: 142,
    },
    {
      id: 'item-herman-chair',
      title: 'Ergonomic Mesh Study Chair with Lumbar Support',
      description: 'Breathable high-back mesh ergonomic office chair with adjustable armrests, 3D lumbar support, and smooth rollerblade wheels that will not scratch dorm floors. Ideal for late-night study sessions without back pain.',
      category: 'Furniture',
      listingType: 'RENT',
      rentalRate: 1.00,
      rentalPeriod: 'daily',
      securityDeposit: 25.0,
      condition: 'Like New',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1580481077195-c328ad0f919b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
      ]),
      sellerId: userSarah.id,
      isAvailable: true,
      location: 'Florence Moore Hall',
      viewsCount: 98,
    },
    {
      id: 'item-queen-topper',
      title: 'Twin XL / Queen Cooling Gel Memory Foam Mattress Topper',
      description: '3-inch thick high-density cooling memory foam topper. Makes standard hard dorm mattresses feel like a 5-star hotel bed. Removable machine-washable bamboo cover. Only used 1 academic term with mattress protector.',
      category: 'Furniture',
      listingType: 'SELL',
      price: 45.0,
      condition: 'Like New',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      ]),
      sellerId: userMarcus.id,
      isAvailable: true,
      location: 'Rains Houses, Stanford',
      viewsCount: 76,
    },
    {
      id: 'item-ti84-calc',
      title: 'TI-84 Plus CE Color Graphing Calculator (Rechargeable)',
      description: 'Python edition graphing calculator with backlit color screen and rechargeable battery. Essential for Math 51, CS 109, and Stats courses. Comes with USB charging cable and slide protective cover.',
      category: 'Electronics',
      listingType: 'RENT',
      rentalRate: 0.80,
      rentalPeriod: 'daily',
      securityDeposit: 25.0,
      condition: 'Like New',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
      ]),
      sellerId: userSarah.id,
      isAvailable: true,
      location: 'White Plaza / Green Library',
      viewsCount: 165,
    },
    {
      id: 'item-calculus-book',
      title: "Thomas' Calculus: Early Transcendentals (14th Edition Hardcover)",
      description: 'Standard textbook for multivariable calculus and differential equations. Crisp pages, no highlighter markings inside. Save $150 compared to the campus bookstore!',
      category: 'Books',
      listingType: 'SELL',
      price: 38.0,
      condition: 'Good',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      ]),
      sellerId: userAlex.id,
      isAvailable: true,
      location: 'Wilbur Hall',
      viewsCount: 54,
    },
    {
      id: 'item-dorm-microwave',
      title: '700W Compact Countertop Microwave (0.7 Cu. Ft.)',
      description: 'Reliable student dorm microwave. 6 quick-set presets (Popcorn, Pizza, Beverage, Reheat, Potato, Dinner plate). Compact footprint takes almost no space on top of a fridge. Deep cleaned and deodorized.',
      category: 'Appliances',
      listingType: 'RENT',
      rentalRate: 1.10,
      rentalPeriod: 'daily',
      securityDeposit: 20.0,
      condition: 'Good',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      ]),
      sellerId: userMarcus.id,
      isAvailable: true,
      location: 'Rains Houses',
      viewsCount: 89,
    },
    {
      id: 'item-gaming-monitor',
      title: 'Dell 27" QHD (2560x1440) 165Hz IPS Monitor with USB-C Hub',
      description: 'High-end productivity & coding monitor. 99% sRGB color gamut, USB-C 65W power delivery for laptops, height/tilt/swivel adjustable stand. Rent by week or semester!',
      category: 'Electronics',
      listingType: 'RENT',
      rentalRate: 2.50,
      rentalPeriod: 'daily',
      securityDeposit: 60.0,
      condition: 'Like New',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80',
      ]),
      sellerId: userSarah.id,
      isAvailable: true,
      location: 'FloMo Hall',
      viewsCount: 230,
    },
    {
      id: 'item-study-desk',
      title: 'Minimalist Wooden Study Desk with Headphone Hook & Cable Tray',
      description: '47-inch wide modern desk. Sturdy powder-coated steel legs with walnut wood top. Disassembles easily with 8 hex screws for transport in any compact car. Perfect for dual monitors and textbook space.',
      category: 'Furniture',
      listingType: 'SELL',
      price: 65.0,
      condition: 'Good',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      ]),
      sellerId: userMarcus.id,
      isAvailable: true,
      location: 'Rains Graduate Housing',
      viewsCount: 112,
    },
    {
      id: 'item-chem-textbook',
      title: 'Organic Chemistry as a Second Language (David Klein) + Molecular Model Kit',
      description: 'Essential life-saver combo for Chem 33/35! Includes both First and Second Semester topics books plus a full 240-piece Duluth molecular orbital building kit. No damaged parts.',
      category: 'Books',
      listingType: 'SELL',
      price: 32.0,
      condition: 'Like New',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      ]),
      sellerId: userAlex.id,
      isAvailable: true,
      location: 'Wilbur Hall',
      viewsCount: 45,
    },
    {
      id: 'item-instant-pot',
      title: 'Instant Pot Duo 7-in-1 (6 Quart) Multi-Cooker',
      description: 'Pressure cooker, slow cooker, rice maker, steamer, sauté pan, and yogurt maker. Saves so much money cooking healthy meals in the dorm kitchen instead of dining halls. Comes with silicone tongs and ladle.',
      category: 'Appliances',
      listingType: 'RENT',
      rentalRate: 1.00,
      rentalPeriod: 'daily',
      securityDeposit: 20.0,
      condition: 'Like New',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      ]),
      sellerId: userAlex.id,
      isAvailable: true,
      location: 'Wilbur Hall Lounge',
      viewsCount: 120,
    },
    {
      id: 'item-u-lock-scooter',
      title: 'Kryptonite New York U-Lock + Heavy Duty Campus Scooter',
      description: 'Heavy duty theft-resistant 16mm hardened steel U-lock with 3 keys, bundled with a foldable adult commuter kick scooter. Glides effortlessly between dorms and lecture halls.',
      category: 'Others',
      listingType: 'SELL',
      price: 40.0,
      condition: 'Good',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
      ]),
      sellerId: userMarcus.id,
      isAvailable: true,
      location: 'Rains Houses',
      viewsCount: 88,
    },
  ];

  for (const it of items) {
    await prisma.item.create({ data: it });
  }

  console.log(`✅ Seeded ${items.length} marketplace items`);

  // 3. Seed Sample Rental Transactions (one active rental for Emma from Alex)
  const now = new Date();
  const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  const endDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // due in 14 days

  await prisma.rentalTransaction.create({
    data: {
      id: 'tx-active-fridge',
      itemId: 'item-mini-fridge',
      buyerId: userEmma.id,
      sellerId: userAlex.id,
      type: 'RENT',
      startDate,
      endDate,
      totalAmount: 31.50, // 21 days * $1.50
      depositAmount: 35.0,
      status: 'ACTIVE',
      paymentStatus: 'PAID',
      pickupLocation: 'Wilbur Hall Front Entrance',
      notes: 'Picked up on first day of spring quarter. Fridge in flawless shape.',
    },
  });

  // Seed sample completed transaction for purchase
  await prisma.rentalTransaction.create({
    data: {
      id: 'tx-completed-book',
      itemId: 'item-calculus-book',
      buyerId: userEmma.id,
      sellerId: userAlex.id,
      type: 'BUY',
      totalAmount: 38.0,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      pickupLocation: 'Green Library Café',
      notes: 'Handed over cash/Venmo on site. Thank you!',
    },
  });

  console.log('✅ Seeded sample rental and buy transactions');

  // 4. Seed sample message/inquiry
  await prisma.inquiry.create({
    data: {
      itemId: 'item-herman-chair',
      senderId: userEmma.id,
      receiverId: userSarah.id,
      message: 'Hi Sarah! Is the Herman Miller study chair still available for the next 3 weeks? Can pick up tomorrow at FloMo!',
    },
  });

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
