const UniversityDetails = {
  // --- Existing Universities (with fixes) ---
  umt: {
    id: 1,
    name: "University of Management and Technology",
    shortName: "UMT",
    domain: "umt.edu.pk",
    website: "https://www.umt.edu.pk",
    logo: "/src/assets/UMT.png",
    established: 1990,
    type: "Private",
    location: "Lahore, Punjab",
    description:
      "UMT is a top private university in Pakistan offering programs in management, technology, and sciences.",

    contact: {
      phone: "+92-42-35212801",
      email: "info@umt.edu.pk",
      address: "C-II, Johar Town, Lahore 54770, Pakistan",
    },

    support: {
      admissions: {
        phone: "+92-42-35212801 Ext: 3412",
        email: "admissions@umt.edu.pk",
        website: "https://admissions.umt.edu.pk",
      },
      studentServices: {
        phone: "+92-42-35212801",
        email: "student.services@umt.edu.pk",
        website: "https://www.umt.edu.pk/Students",
      },
      helpDesk: {
        phone: "+92-42-111-868-868",
        email: "helpdesk@umt.edu.pk",
        website: "https://helpdesk.umt.edu.pk",
      },
    },

    socialMedia: {
      facebook: "https://www.facebook.com/UMT.edu.pk",
      twitter: "https://twitter.com/UMT_Lahore",
      linkedin: "https://www.linkedin.com/school/umt-lahore/",
      youtube: "https://www.youtube.com/user/UMTChannel",
    },

    quickLinks: [
      { name: "Student Portal", url: "https://online.umt.edu.pk" },
      { name: "LMS", url: "https://lms.umt.edu.pk" },
      { name: "Library", url: "https://library.umt.edu.pk" },
      { name: "Academic Calendar", url: "https://www.umt.edu.pk/org/Academic-Calendar.aspx" },
      { name: "Fee Structure", url: "https://admissions.umt.edu.pk/fee.aspx" },
      { name: "Faculty Directory", url: "https://www.umt.edu.pk/faculty.aspx" },
    ],

    emergencyContact: {
      security: "+92-42-35212801",
      medical: "+92-42-35212801",
      transport: "+92-42-35212801",
    },
  },

  // --- New Universities ---

  aku: {
    id: 17,
    name: "Aga Khan University",
    shortName: "AKU",
    domain: "aku.edu",
    website: "https://www.aku.edu",
    logo: "/src/assets/AKU.png",
    established: 1983,
    type: "Private",
    location: "Karachi, Sindh",
    description:
      "Aga Khan University is an international university with a strong focus on health sciences, education, and research.",

    contact: {
      phone: "+92-21-3493-0051",
      email: "info@aku.edu",
      address: "Stadium Road, P.O. Box 3500, Karachi 74800, Pakistan",
    },

    support: {
      admissions: {
        phone: "+92-21-3486-4410",
        email: "admissions.pk@aku.edu",
        website: "https://www.aku.edu/admissions",
      },
      studentServices: {
        phone: "+92-21-3493-0051",
        email: "student.affairs@aku.edu",
        website: "https://www.aku.edu/student-affairs",
      },
      helpDesk: {
        phone: "+92-21-3493-0051",
        email: "helpdesk@aku.edu",
        website: "https://www.aku.edu/contact",
      },
    },

    socialMedia: {
      facebook: "https://www.facebook.com/agakhanuniversity",
      twitter: "https://twitter.com/AKUGlobal",
      linkedin: "https://www.linkedin.com/school/aga-khan-university/",
      youtube: "https://www.youtube.com/user/agakhanuniversity",
    },

    quickLinks: [
      { name: "Library", url: "https://ecommons.aku.edu" },
      { name: "Research", url: "https://www.aku.edu/research" },
      { name: "Careers", url: "https://www.aku.edu/careers" },
    ],

    emergencyContact: {
      security: "+92-21-3493-0051",
      medical: "+92-21-3493-0051",
      transport: "+92-21-3493-0051",
    },
  },

  bahria: {
    id: 18,
    name: "Bahria University",
    shortName: "BU",
    domain: "bahria.edu.pk",
    website: "https://www.bahria.edu.pk",
    logo: "/src/assets/BU.png",
    established: 2000,
    type: "Public (Semi-Government, Pakistan Navy)",
    location: "Islamabad, with campuses in Karachi & Lahore",
    description:
      "Bahria University is a federally chartered public university established by Pakistan Navy, offering programs in science, engineering, and management.",

    contact: {
      phone: "+92-51-9260002",
      email: "info@bahria.edu.pk",
      address: "Shangrilla Road, Sector E-8, Islamabad, Pakistan",
    },

    support: {
      admissions: {
        phone: "+92-51-9260002",
        email: "admissions@bahria.edu.pk",
        website: "https://www.bahria.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-51-9260002",
        email: "studentaffairs@bahria.edu.pk",
        website: "https://www.bahria.edu.pk/student-services",
      },
      helpDesk: {
        phone: "+92-51-9260002",
        email: "helpdesk@bahria.edu.pk",
        website: "https://www.bahria.edu.pk/contact",
      },
    },

    socialMedia: {
      facebook: "https://www.facebook.com/BahriaUniversityOfficial",
      twitter: "https://twitter.com/OfficialBahriaU",
      linkedin: "https://www.linkedin.com/school/bahria-university/",
      youtube: "https://www.youtube.com/c/BahriaUniversityOfficial",
    },

    quickLinks: [
      { name: "Library", url: "https://library.bahria.edu.pk" },
      { name: "Research", url: "https://www.bahria.edu.pk/research" },
      { name: "Careers", url: "https://www.bahria.edu.pk/jobs" },
    ],

    emergencyContact: {
      security: "+92-51-9260002",
      medical: "+92-51-9260002",
      transport: "+92-51-9260002",
    },
  },

  air: {
    id: 19,
    name: "Air University",
    shortName: "AU",
    domain: "au.edu.pk",
    website: "https://www.au.edu.pk",
    logo: "/src/assets/AU.png",
    established: 2002,
    type: "Public (Pakistan Air Force)",
    location: "Islamabad, Pakistan",
    description:
      "Air University is a public university established by the Pakistan Air Force, offering programs in engineering, IT, business, and health sciences.",

    contact: {
      phone: "+92-51-9262557",
      email: "info@au.edu.pk",
      address: "E-9, Islamabad, Pakistan",
    },

    support: {
      admissions: {
        phone: "+92-51-9262557",
        email: "admissions@au.edu.pk",
        website: "https://www.au.edu.pk/pages/Admissions.aspx",
      },
      studentServices: {
        phone: "+92-51-9262557",
        email: "student.affairs@au.edu.pk",
        website: "https://www.au.edu.pk/pages/StudentServices.aspx",
      },
      helpDesk: {
        phone: "+92-51-9262557",
        email: "helpdesk@au.edu.pk",
        website: "https://www.au.edu.pk/pages/ContactUs.aspx",
      },
    },

    socialMedia: {
      facebook: "https://www.facebook.com/airuniversityofficial",
      twitter: "https://twitter.com/AirUniversity_",
      linkedin: "https://www.linkedin.com/school/air-university-pakistan/",
      youtube: "https://www.youtube.com/c/AirUniversityOfficial",
    },

    quickLinks: [
      { name: "LMS", url: "https://lms.au.edu.pk" },
      { name: "Library", url: "https://library.au.edu.pk" },
      { name: "Research", url: "https://www.au.edu.pk/pages/Research.aspx" },
    ],

    emergencyContact: {
      security: "+92-51-9262557",
      medical: "+92-51-9262557",
      transport: "+92-51-9262557",
    },
  },

  ist: {
    id: 20,
    name: "Institute of Space Technology",
    shortName: "IST",
    domain: "ist.edu.pk",
    website: "https://www.ist.edu.pk",
    logo: "/src/assets/IST.png",
    established: 2002,
    type: "Public",
    location: "Islamabad, Pakistan",
    description:
      "IST is a public university specializing in space science, aerospace engineering, and related fields.",

    contact: {
      phone: "+92-51-9075100",
      email: "info@ist.edu.pk",
      address: "Islamabad Highway, Near Rawat Toll Plaza, Islamabad, Pakistan",
    },

    support: {
      admissions: {
        phone: "+92-51-9075100",
        email: "admissions@ist.edu.pk",
        website: "https://www.ist.edu.pk/admissions",
      },
      studentServices: {
        phone: "+92-51-9075100",
        email: "student.affairs@ist.edu.pk",
        website: "https://www.ist.edu.pk/student-affairs",
      },
      helpDesk: {
        phone: "+92-51-9075100",
        email: "helpdesk@ist.edu.pk",
        website: "https://www.ist.edu.pk/contact",
      },
    },

    socialMedia: {
      facebook: "https://www.facebook.com/ISTofficial",
      twitter: "https://twitter.com/IST_Official",
      linkedin: "https://www.linkedin.com/school/institute-of-space-technology/",
      youtube: "https://www.youtube.com/c/ISTOfficial",
    },

    quickLinks: [
      { name: "Library", url: "https://library.ist.edu.pk" },
      { name: "Research", url: "https://www.ist.edu.pk/research" },
      { name: "Careers", url: "https://www.ist.edu.pk/careers" },
    ],

    emergencyContact: {
      security: "+92-51-9075100",
      medical: "+92-51-9075100",
      transport: "+92-51-9075100",
    },
  },
};
