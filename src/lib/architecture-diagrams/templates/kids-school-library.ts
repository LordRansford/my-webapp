import type { ArchitectureTemplate } from "./types";

export const kidsSchoolLibraryTemplate: ArchitectureTemplate = {
  id: "kids-school-library",
  title: "School library system 📚",
  description: "Students borrow books, librarians manage inventory, and the system tracks loans.",
  intendedAudience: "kids",
  diagramTypesIncluded: ["Context", "Container", "Deployment", "Data Flow", "Sequence"],
  input: {
    systemName: "School library",
    systemDescription: "Students borrow books. Librarians add books and track returns. The system records loans and due dates.",
    audience: "kids",
    goal: "explain",
    users: [{ name: "Student" }, { name: "Librarian" }],
    externalSystems: [],
    containers: [
      { name: "Library website", type: "ui", description: "Search and borrow books." },
      { name: "Library API", type: "api", description: "Handles loans and returns." },
      { name: "Library database", type: "database", description: "Books, students, and loans." },
    ],
    dataTypes: ["pii"],
    dataStores: [{ name: "Loans DB", description: "Borrowed books and due dates." }],
    flows: [
      { from: "Student", to: "Library website", purpose: "Search and borrow a book", sensitive: false },
      { from: "Library website", to: "Library API", purpose: "Create loan record", sensitive: true },
      { from: "Library API", to: "Library database", purpose: "Store loan and book status", sensitive: true },
    ],
    security: {
      authenticationMethod: "Simple login for students and librarians",
      trustBoundaries: ["Browser to server"],
      hasNoTrustBoundariesConfirmed: false,
      adminAccess: true,
      sensitiveDataCategories: ["pii"],
    },
    versionName: "School library starter",
  },
};


