require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Category = require("../models/Category");
const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");

const password = "Password@123";

const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@studynotion.com",
    accountType: "Admin",
    about: "Platform administrator for StudyNotion.",
  },
  {
    firstName: "Aarav",
    lastName: "Mehta",
    email: "instructor@studynotion.com",
    accountType: "Instructor",
    about: "Full-stack instructor focused on practical, job-ready projects.",
  },
  {
    firstName: "Demo",
    lastName: "Student",
    email: "student@studynotion.com",
    accountType: "Student",
    about: "Demo learner account.",
  },
];

const categories = [
  {
    name: "Web Development",
    description: "Frontend, backend, APIs, and full-stack application development.",
  },
  {
    name: "Artificial Intelligence",
    description: "AI tools, prompting, automation, and applied machine learning foundations.",
  },
  {
    name: "Data Science",
    description: "Data analysis, visualization, Python, and analytics workflows.",
  },
  {
    name: "Career Skills",
    description: "Interview preparation, portfolio building, communication, and job readiness.",
  },
];

const courses = [
  {
    courseName: "Full Stack Web Development Bootcamp",
    category: "Web Development",
    price: 999,
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    tag: ["react", "node", "mongodb", "mern"],
    courseDescription:
      "Build modern full-stack apps with React, Node.js, Express, MongoDB, authentication, APIs, dashboards, and deployment.",
    whatYouWillLearn:
      "You will learn React fundamentals, reusable components, REST APIs, MongoDB data modeling, authentication, deployment, and production debugging.",
    instructions: [
      "Use a laptop with a modern browser.",
      "Install Node.js and VS Code.",
      "Practice each project after watching the lesson.",
    ],
  },
  {
    courseName: "React Frontend Mastery",
    category: "Web Development",
    price: 699,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    tag: ["react", "frontend", "javascript", "ui"],
    courseDescription:
      "Master React components, hooks, routing, forms, state management, API integration, and responsive UI patterns.",
    whatYouWillLearn:
      "You will create polished interfaces, manage state, call APIs, build routing flows, and organize production React code.",
    instructions: [
      "Know basic HTML, CSS, and JavaScript.",
      "Complete the assignments in order.",
      "Keep a small notes file for reusable patterns.",
    ],
  },
  {
    courseName: "Backend APIs with Node and MongoDB",
    category: "Web Development",
    price: 799,
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    tag: ["node", "express", "mongodb", "api"],
    courseDescription:
      "Create secure backend APIs with Express, MongoDB, JWT auth, file uploads, validation, payments, and deployment practices.",
    whatYouWillLearn:
      "You will learn route design, controllers, middleware, database schemas, authentication, authorization, and API deployment.",
    instructions: [
      "Install Node.js locally.",
      "Create a MongoDB Atlas account.",
      "Test every API with the frontend or Postman.",
    ],
  },
  {
    courseName: "AI Productivity and Prompt Engineering",
    category: "Artificial Intelligence",
    price: 499,
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    tag: ["ai", "prompting", "productivity", "automation"],
    courseDescription:
      "Use AI assistants to summarize, plan, write, debug, research, and build faster with practical prompting workflows.",
    whatYouWillLearn:
      "You will learn prompt structure, iteration, context design, AI-assisted studying, task automation, and responsible use.",
    instructions: [
      "Bring a project or study goal.",
      "Try each prompt pattern on your own work.",
      "Review outputs before using them.",
    ],
  },
  {
    courseName: "Python Data Analysis Essentials",
    category: "Data Science",
    price: 599,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tag: ["python", "data", "pandas", "analytics"],
    courseDescription:
      "Learn Python data analysis with pandas, charts, cleaning workflows, notebooks, and practical business datasets.",
    whatYouWillLearn:
      "You will clean data, analyze trends, create visualizations, and prepare insights for real reporting workflows.",
    instructions: [
      "Install Python or use Google Colab.",
      "Download the practice datasets.",
      "Repeat each analysis with a new dataset.",
    ],
  },
  {
    courseName: "Job Ready Developer Portfolio",
    category: "Career Skills",
    price: 299,
    thumbnail: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    tag: ["portfolio", "resume", "interview", "career"],
    courseDescription:
      "Turn your projects into a strong portfolio with case studies, GitHub cleanup, resume polish, and interview preparation.",
    whatYouWillLearn:
      "You will build a clear portfolio, write project case studies, prepare for interviews, and present your skills confidently.",
    instructions: [
      "Choose two projects to improve.",
      "Keep your GitHub profile public.",
      "Update your resume as you complete each module.",
    ],
  },
];

const getUserImage = (firstName, lastName) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(`${firstName} ${lastName}`)}`;

const upsertUser = async (user, hashedPassword) => {
  let existing = await User.findOne({ email: user.email });

  if (existing) {
    return existing;
  }

  const profile = await Profile.create({
    about: user.about,
    contactNumber: 9999999999,
  });

  existing = await User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: hashedPassword,
    accountType: user.accountType,
    additionalDetails: profile._id,
    image: getUserImage(user.firstName, user.lastName),
    active: true,
    approved: true,
  });

  return existing;
};

const seed = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is missing. Add it to Server/.env or Vercel env variables.");
  }

  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to MongoDB");

  const hashedPassword = await bcrypt.hash(password, 10);
  const savedUsers = {};

  for (const user of users) {
    savedUsers[user.accountType] = await upsertUser(user, hashedPassword);
  }

  const savedCategories = {};
  for (const category of categories) {
    savedCategories[category.name] = await Category.findOneAndUpdate(
      { name: category.name },
      category,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  for (const course of courses) {
    const category = savedCategories[course.category];
    const savedCourse = await Course.findOneAndUpdate(
      { courseName: course.courseName },
      {
        ...course,
        category: category._id,
        instructor: savedUsers.Instructor._id,
        status: "Published",
        studentsEnrolled: [],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Category.findByIdAndUpdate(category._id, {
      $addToSet: { courses: savedCourse._id },
    });

    await User.findByIdAndUpdate(savedUsers.Instructor._id, {
      $addToSet: { courses: savedCourse._id },
    });
  }

  console.log("Seed completed");
  console.log("");
  console.log("Demo accounts:");
  console.log(`Admin: admin@studynotion.com / ${password}`);
  console.log(`Instructor: instructor@studynotion.com / ${password}`);
  console.log(`Student: student@studynotion.com / ${password}`);
};

seed()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
