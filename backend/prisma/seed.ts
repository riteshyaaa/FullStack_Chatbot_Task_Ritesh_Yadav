import { PrismaClient, UserType, EnquiryStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing enquiries (optional for idempotent seeding)
  await prisma.enquiry.deleteMany({});
  console.log('🧹 Cleaned existing enquiry records.');

  const sampleEnquiries = [
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91-9876543210',
      userType: UserType.Student,
      serviceInterest: 'DGCA Certified Remote Pilot Training',
      message: 'I am a final-year engineering student interested in your DGCA small category certification program. Could you provide details regarding batch schedules, eligibility criteria, and weekend training sessions?',
      status: EnquiryStatus.New,
    },
    {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@agritech-solutions.in',
      phone: '+91-9123456789',
      userType: UserType.Customer,
      serviceInterest: 'Agricultural Crop Health & Spraying',
      message: 'We manage 450 acres of soybean and cotton crops in central Maharashtra. We require multispectral NDVI mapping and precision drone spraying services. Please share a commercial quote and deployment timeline.',
      status: EnquiryStatus.Contacted,
    },
    {
      name: 'Ananya Desai',
      email: 'ananya.desai@cinemedia.com',
      phone: '+91-9988776655',
      userType: UserType.Customer,
      serviceInterest: 'Aerial Cinematography & Media',
      message: 'Looking for high-end heavy-lift aerial cinematography crew with RED/ARRI payload capacity for a feature film schedule in Rajasthan starting next month. Please connect us with your lead pilot.',
      status: EnquiryStatus.InProgress,
    },
    {
      name: 'Vikram Patel',
      email: 'vikram.patel@infra-inspect.org',
      phone: '+91-9765432109',
      userType: UserType.Customer,
      serviceInterest: 'Industrial Infrastructure & Bridge Inspection',
      message: 'Our civil engineering firm has an upcoming structural audit of a 15km highway corridor and 3 major bridges. We need LiDAR + thermal visual inspection. Need DGCA compliant operations.',
      status: EnquiryStatus.New,
    },
    {
      name: 'Meera Joshi',
      email: 'meera.joshi@geouniversity.ac.in',
      phone: '+91-9898989898',
      userType: UserType.Student,
      serviceInterest: 'GIS & Photogrammetry Mapping Course',
      message: 'I am a postgraduate researcher in Remote Sensing and GIS. Does your curriculum cover Pix4D, DroneDeploy, and ortho-mosaic post-processing? Also inquiry regarding student discounts.',
      status: EnquiryStatus.Closed,
    },
    {
      name: 'David Wilson',
      email: 'david.wilson@solartech.com',
      phone: '+1-555-019-2834',
      userType: UserType.Other,
      serviceInterest: 'Solar Plant Thermography',
      message: 'Interested in partnering with DroneTV for thermographic anomaly detection across our rooftop and utility-scale solar installations.',
      status: EnquiryStatus.New,
    }
  ];

  for (const enquiry of sampleEnquiries) {
    const created = await prisma.enquiry.create({
      data: enquiry,
    });
    console.log(`✅ Seeded enquiry: ${created.name} (${created.userType}) - Status: ${created.status}`);
  }

  console.log(`\n🎉 Successfully seeded ${sampleEnquiries.length} sample enquiries.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
