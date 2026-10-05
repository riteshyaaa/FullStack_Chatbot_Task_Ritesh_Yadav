import { ChatIntent, QuickReply } from '../types';

export const INITIAL_QUICK_REPLIES: QuickReply[] = [
  { id: 'qr_services', label: '🚁 Drone Services', text: 'What services does Vayudhara provide?', intentId: 'services' },
  { id: 'qr_courses', label: '🎓 Pilot Training & Courses', text: 'What courses / training are available?', intentId: 'courses' },
  { id: 'qr_register', label: '📝 How to Register', text: 'How can I register?', intentId: 'register' },
  { id: 'qr_student', label: '👨‍🎓 I am a Student', text: 'I am a student.', intentId: 'student' },
  { id: 'qr_service_interest', label: '💼 Commercial Inquiry', text: 'I am interested in a service.', intentId: 'service_interest' },
  { id: 'qr_speak', label: '📞 Speak to Someone', text: 'I want to speak with someone.', intentId: 'speak' },
  { id: 'qr_contact', label: '📍 Contact Details', text: 'How can I contact Vayudhara?', intentId: 'contact' },
];

export const CHAT_INTENTS: ChatIntent[] = [
  {
    id: 'services',
    name: 'Vayudhara Services Overview',
    keywords: [
      'service', 'services', 'what services', 'provide', 'offer', 'solutions', 'capabilities',
      'drone service', 'survey', 'surveying', 'mapping', 'agriculture', 'cinematography',
      'inspection', 'thermal', 'lidar', 'monitoring', 'what do you do'
    ],
    response: `🚁 **Vayudhara Enterprise Services:**

We provide end-to-end aerial intelligence and drone operational solutions:

1. **Precision Agriculture & Spraying**: Multispectral NDVI crop health monitoring, precision pesticide spraying, and yield forecasting.
2. **Topographical GIS & LiDAR Surveying**: High-precision 2D orthomosaics, 3D digital elevation models (DEM), and contour mapping.
3. **Industrial Infrastructure Inspection**: Thermal & high-res optical audits for solar power plants, transmission towers, bridges, and pipelines.
4. **Cinematography & High-End Media**: Heavy-lift cinema drone filming for commercials, movies, live broadcasting, and corporate events.

Would you like to explore commercial pricing or submit an inquiry for your project?`,
    followUpReplies: [
      { id: 'fu_enquiry_service', label: '📩 Request Service Quote', text: 'I am interested in a service.', intentId: 'service_interest' },
      { id: 'fu_courses', label: '🎓 View Training Courses', text: 'What courses / training are available?', intentId: 'courses' },
      { id: 'fu_speak', label: '📞 Talk to an Specialist', text: 'I want to speak with someone.', intentId: 'speak' },
    ],
    suggestEnquiry: true,
  },

  {
    id: 'courses',
    name: 'Training & Courses Overview',
    keywords: [
      'course', 'courses', 'training', 'pilot training', 'certification', 'dgca', 'license',
      'learn', 'class', 'classes', 'curriculum', 'fees', 'duration', 'admission', 'syllabus',
      'what courses', 'training program', 'rpc'
    ],
    response: `🎓 **Vayudhara Pilot Academy & Certification Programs:**

We offer DGCA-approved remote pilot certification and specialized technical masterclasses:

1. **DGCA Certified Remote Pilot Certificate (RPC)**
   - *Duration*: 5 Days Intensive | *Category*: Small & Medium Drones
   - Covers flight simulator training, DGCA regulations, and hands-on solo flight hours.

2. **GIS & Photogrammetry Mapping Specialist**
   - *Duration*: 3 Weeks | *Tools*: Pix4D, DroneDeploy, ArcGIS
   - Aerial data processing, 3D point cloud generation, and volume calculations.

3. **Precision Agricultural Drone Operations**
   - *Duration*: 10 Days | *Focus*: Multispectral sensors, spray calibrations & SOPs.

4. **Industrial Thermography & Asset Inspection**
   - *Duration*: 2 Weeks | *Focus*: Level-1 Infrared thermography & defect reporting.

Would you like to register or speak with an admissions counselor?`,
    followUpReplies: [
      { id: 'fu_register', label: '📝 How to Register', text: 'How can I register?', intentId: 'register' },
      { id: 'fu_student', label: '👨‍🎓 Student Guidance', text: 'I am a student.', intentId: 'student' },
      { id: 'fu_contact', label: '📍 Academy Location & Contact', text: 'How can I contact Vayudhara?', intentId: 'contact' },
    ],
    suggestEnquiry: true,
  },

  {
    id: 'contact',
    name: 'Contact Information',
    keywords: [
      'contact', 'how can i contact', 'phone', 'email', 'address', 'location', 'office',
      'reach', 'call', 'timing', 'working hours', 'where are you', 'headquarters', 'support'
    ],
    response: `📍 **How to Reach Vayudhara:**

- 📧 **General Inquiries**: support@vayudhara.example.com
- 🎓 **Admissions & Academy**: academy@vayudhara.example.com
- 📞 **Toll-Free Helpline**: +91 (800) 555-DRONE / +91 98765 43210
- 🏢 **Headquarters & Flight Center**: Vayudhara Aero Park, Innovation Corridor, Tech Hub, Sector 44
- ⏰ **Operating Hours**: Monday – Saturday, 9:00 AM – 6:30 PM IST

You can also leave your details directly, and our team will get back to you within 24 hours!`,
    followUpReplies: [
      { id: 'fu_leave_enquiry', label: '✍️ Submit an Enquiry Form', text: 'I want to speak with someone.', intentId: 'speak' },
      { id: 'fu_services', label: '🚁 Drone Services', text: 'What services does Vayudhara provide?', intentId: 'services' },
      { id: 'fu_courses', label: '🎓 View Courses', text: 'What courses / training are available?', intentId: 'courses' },
    ],
  },

  {
    id: 'register',
    name: 'Registration & Admissions Process',
    keywords: [
      'register', 'registration', 'how can i register', 'how to register', 'apply', 'enroll',
      'enrollment', 'admission', 'sign up', 'join', 'process', 'steps to apply', 'how do i join'
    ],
    response: `📝 **How to Register for Vayudhara Courses or Services:**

**For Pilot Training & Courses:**
1. Submit your details through our online enquiry form (or right here in chat).
2. Minimum eligibility: 10th standard pass and 18+ years of age (valid Passport or Aadhaar required for DGCA verification).
3. Our admissions counselor will guide you through batch selection and fee payment.
4. Complete your DGCA medical self-declaration and start simulator training.

**For Enterprise & Commercial Services:**
1. Submit your project requirements and target location.
2. Our flight ops team conducts an airspace feasibility check and provides a custom quote within 24 hours.

Would you like to start your registration enquiry now?`,
    followUpReplies: [
      { id: 'fu_reg_student', label: '👨‍🎓 Register as Student', text: 'I am a student.', intentId: 'student' },
      { id: 'fu_reg_client', label: '💼 Register as Commercial Client', text: 'I am interested in a service.', intentId: 'service_interest' },
      { id: 'fu_reg_contact', label: '📞 Speak with Counselor', text: 'I want to speak with someone.', intentId: 'speak' },
    ],
    suggestEnquiry: true,
  },

  {
    id: 'service_interest',
    name: 'Commercial Client Inquiry',
    keywords: [
      'interested in a service', 'interested in service', 'hire', 'quotation', 'pricing',
      'cost', 'client', 'business', 'enterprise', 'project', 'quote', 'commercial', 'hire drone',
      'book service', 'contract'
    ],
    response: `💼 **Commercial Client Assistance:**

We appreciate your interest in Vayudhara's enterprise solutions!

To provide an accurate technical scope and pricing estimate, please let us know:
- Type of service (Topographic Surveying, Agriculture, Thermal Inspection, or Cinematography)
- Target location and approximate area size
- Project timeline and deliverable requirements (CAD/GIS, orthomosaic, raw video)

You can fill out the fast enquiry form below, and our Solutions Lead will reach out to you immediately.`,
    followUpReplies: [
      { id: 'fu_open_enquiry', label: '✍️ Fill Quick Lead Form', text: 'I want to submit my project details.', intentId: 'speak' },
      { id: 'fu_view_services', label: '🔍 Browse All Services', text: 'What services does Vayudhara provide?', intentId: 'services' },
    ],
    suggestEnquiry: true,
  },

  {
    id: 'student',
    name: 'Student & Career Guidance',
    keywords: [
      'i am a student', 'student', 'career', 'college', 'fresher', 'placement', 'job',
      'internship', 'eligibility', 'pilot license', 'certification for student', 'discount'
    ],
    response: `👨‍🎓 **Welcome Future Drone Pilot & Geospatial Engineer!**

Drone technology is one of the fastest-growing industries. Here is what we offer students and young professionals:

- **100% DGCA Compliant Training**: Get your official Remote Pilot Certificate (RPC) recognized across India.
- **Career Support & Job Placement Assistance**: Direct networking with drone survey companies, agritech firms, and media houses.
- **Special Student Scholarships**: Up to 15% discount for university students and recent graduates with valid student ID.
- **Hands-on Flight Simulators & Live Field Sessions**: 15+ hours of flight simulation plus supervised field missions.

Ready to take off? Let's connect you with our career counselor!`,
    followUpReplies: [
      { id: 'fu_student_enroll', label: '📝 Apply for Student Batch', text: 'How can I register?', intentId: 'register' },
      { id: 'fu_student_counselor', label: '📞 Speak to Career Counselor', text: 'I want to speak with someone.', intentId: 'speak' },
      { id: 'fu_student_courses', label: '📚 Check Course Syllabus', text: 'What courses / training are available?', intentId: 'courses' },
    ],
    suggestEnquiry: true,
  },

  {
    id: 'speak',
    name: 'Speak with Human Representative',
    keywords: [
      'speak with someone', 'talk to someone', 'human', 'agent', 'representative', 'counselor',
      'advisor', 'executive', 'call me', 'callback', 'phone call', 'real person', 'talk to human'
    ],
    response: `📞 **Connect with a Vayudhara Specialist:**

Our dedicated team of flight instructors and solutions consultants is ready to help!

Please submit your contact details below (or use the Contact Form on the page), and an expert representative matching your inquiry (Student Admissions or Commercial Solutions) will contact you shortly during business hours.

- ⏰ **Response Time**: Usually under 2 business hours
- 📱 **Direct Helpline**: +91 (800) 555-DRONE (9:00 AM - 6:30 PM IST)`,
    followUpReplies: [
      { id: 'fu_direct_contact', label: '📍 View Direct Contact Info', text: 'How can I contact Vayudhara?', intentId: 'contact' },
      { id: 'fu_back_services', label: '🚁 Review Services', text: 'What services does Vayudhara provide?', intentId: 'services' },
    ],
    suggestEnquiry: true,
  },
];

export const FALLBACK_INTENT: ChatIntent = {
  id: 'fallback',
  name: 'Unknown / Fallback Intent',
  keywords: [],
  response: `🤖 I'm sorry, I don't have specific information about that yet.

I am the **Vayudhara Support Assistant**, and I can help you with:
- 🚁 **Drone Services**: Surveying, Agriculture, Cinematography, Inspections
- 🎓 **Training Academy**: DGCA Pilot Certification & GIS Courses
- 📝 **Registration**: Admissions & service onboarding
- 📞 **Contact**: Connecting directly with our specialist team

Please select an option below or ask in different words!`,
  followUpReplies: [
    { id: 'fb_services', label: '🚁 Drone Services', text: 'What services does Vayudhara provide?', intentId: 'services' },
    { id: 'fb_courses', label: '🎓 Pilot Courses', text: 'What courses / training are available?', intentId: 'courses' },
    { id: 'fb_register', label: '📝 How to Register', text: 'How can I register?', intentId: 'register' },
    { id: 'fb_contact', label: '📍 Contact Details', text: 'How can I contact Vayudhara?', intentId: 'contact' },
  ],
};
