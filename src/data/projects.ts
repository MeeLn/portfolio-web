export type ProjectCategory = "Personal" | "College" | "Company";
export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  projectType?: string;
  description: string;
  longDescription: string;
  problem?: string;
  features?: string[];
  highlights?: string[];
  videoUrl?: string;
  year?: number;
  coverImage: string;
  screenshots: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  downloadLinks?: {
    label: string;
    href: string;
    version?: string;
    fileSize?: string;
    releaseNotes?: string;
  }[];
  featured?: boolean;
  status?: string;
}
export const projects: PortfolioProject[] = [
  {
    id: "altkit",
    slug: "altkit",
    title: "ALTKit",
    category: "Personal",
    projectType: "Android utility",
    description:
      "A modular Android utility app with a custom interface and practical device tools.",
    longDescription:
      "ALTKit is a modular Flutter utility app built around dedicated feature screens, synced navigation, and an admin-only settings flow. Its tools include a scanner, notes, connectivity screens, compass, flashlight, sound meter, wallpaper studio, device information, unit converter, mini browser, and file cleaner.",
    problem:
      "Common device utilities are spread across separate apps and screens.",
    features: [
      "Scanner and notes",
      "Connectivity tools, compass, flashlight, and sound meter",
      "Wallpaper studio and device information",
      "Unit converter, mini browser, and file cleaner",
    ],
    highlights: [
      "Modular Flutter feature screens",
      "Synced navigation",
      "Admin-only settings flow",
    ],
    coverImage: "/projects/icons/altkit.webp",
    screenshots: [],
    technologies: ["Flutter", "Dart", "Riverpod", "Android"],
    featured: true,
  },
  {
    id: "zerogrid",
    slug: "zerogrid",
    title: "ZeroGrid",
    category: "Personal",
    projectType: "Mobile file transfer",
    description:
      "Air-gapped file transfer between mobile devices using light and QR frames.",
    longDescription:
      "ZeroGrid transfers files between two mobile devices without Wi-Fi, Bluetooth, cellular data, or network sockets. One screen displays fountain-coded QR frames while the other scans and reconstructs the file.",
    problem:
      "Transfer a file between devices without relying on a network connection.",
    features: [
      "Display a sequence of QR frames from the sending device",
      "Scan the frames and reconstruct the file on the receiving device",
    ],
    highlights: [
      "Fountain-coded QR transfer",
      "No Wi-Fi, Bluetooth, cellular data, or network sockets",
    ],
    coverImage: "/projects/icons/zerogrid.webp",
    screenshots: [],
    technologies: ["Flutter", "Dart", "QR", "Optical transfer"],
    featured: true,
  },
  {
    id: "attendease",
    slug: "attendease",
    title: "AttendEase",
    category: "Personal",
    projectType: "Cross-platform app",
    description:
      "A cross-platform attendance app with role-based workflows and face verification on Android.",
    longDescription:
      "The Flutter version of AttendEase supports admin, teacher, and student roles, with local SQLite persistence for users, courses, departments, and attendance. On Android, face verification uses CameraX, ML Kit, and a TensorFlow Lite MobileFaceNet model before attendance is marked.",
    problem:
      "Manage attendance workflows for administrators, teachers, and students in one app.",
    features: [
      "Role-based admin, teacher, and student workflows",
      "Local records for users, courses, departments, and attendance",
      "Android face verification before attendance is marked",
    ],
    highlights: [
      "Flutter application with SQLite persistence",
      "CameraX, ML Kit, and TensorFlow Lite MobileFaceNet on Android",
    ],
    coverImage: "/projects/icons/attendease.webp",
    screenshots: [],
    technologies: [
      "Flutter",
      "Dart",
      "SQLite",
      "CameraX",
      "ML Kit",
      "TensorFlow Lite",
    ],
    featured: true,
  },
  {
    id: "attendease-legacy",
    slug: "attendease-legacy",
    title: "AttendEase · Legacy Android",
    category: "College",
    projectType: "Native Android app",
    description:
      "The original native Android attendance app with admin, teacher, and student workflows.",
    longDescription:
      "The original Android Studio implementation of AttendEase, preserved as the college project predecessor to the Flutter app. It includes role-based dashboards, SQLite-backed attendance flows, and native face registration and recognition using CameraX, ML Kit, and TensorFlow Lite.",
    problem:
      "Provide a native Android attendance workflow for the college project.",
    features: [
      "Admin, teacher, and student workflows",
      "SQLite-backed attendance records",
      "Face registration and recognition",
    ],
    highlights: [
      "Native Android Studio application",
      "CameraX, ML Kit, and TensorFlow Lite",
    ],
    coverImage: "/projects/icons/attendease-legacy.webp",
    screenshots: [],
    technologies: [
      "Android",
      "Java",
      "SQLite",
      "CameraX",
      "ML Kit",
      "TensorFlow Lite",
    ],
    githubUrl:
      "https://github.com/MeeLn/Face-recognition-integrated-attendance-system-for-student-mobile-app-using-android-studio-JAVA",
    documentationUrl:
      "https://github.com/MeeLn/Face-recognition-integrated-attendance-system-for-student-mobile-app-using-android-studio-JAVA#readme",
    downloadLinks: [
      {
        label: "Download Android APK",
        href: "/downloads/attendease-legacy.apk",
        fileSize: "97 MiB / 101.7 MB",
      },
    ],
    featured: true,
  },
];
