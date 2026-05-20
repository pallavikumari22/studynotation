const Course = require("../models/Course");

const OPENAI_URL = "https://api.openai.com/v1/responses";

const demoCourses = [
  {
    _id: "demo-full-stack",
    courseName: "Full Stack Web Development Path",
    courseDescription: "A starter roadmap covering HTML, CSS, JavaScript, React, Node, APIs, and deployment.",
    price: 0,
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    studentsEnrolled: [],
    ratingAndReviews: [],
    category: { name: "Web Development" },
  },
  {
    _id: "demo-ai-productivity",
    courseName: "AI Productivity and Prompting Basics",
    courseDescription: "Learn how to use AI tools for studying, summaries, project planning, and revision.",
    price: 0,
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    studentsEnrolled: [],
    ratingAndReviews: [],
    category: { name: "AI" },
  },
  {
    _id: "demo-backend-api",
    courseName: "Backend APIs with Node and MongoDB",
    courseDescription: "Build secure REST APIs with authentication, database models, validation, and deployment.",
    price: 0,
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    studentsEnrolled: [],
    ratingAndReviews: [],
    category: { name: "Backend" },
  },
];

const buildCourseSummary = (courses) =>
  courses
    .map((course, index) => {
      const ratingCount = course.ratingAndReviews?.length || 0;
      const studentCount = course.studentsEnrolled?.length || 0;
      const category = course.category?.name || "General";
      return `${index + 1}. ${course.courseName} | ${category} | Rs ${course.price || 0} | ${studentCount} students | ${ratingCount} reviews | ${course.courseDescription || ""}`;
    })
    .join("\n");

const getRelevantCourses = async ({ goal = "", budget = "" }) => {
  const query = { status: "Published" };
  const trimmedGoal = goal.trim();

  if (trimmedGoal) {
    query.$or = [
      { courseName: { $regex: trimmedGoal, $options: "i" } },
      { courseDescription: { $regex: trimmedGoal, $options: "i" } },
      { tag: { $elemMatch: { $regex: trimmedGoal, $options: "i" } } },
    ];
  }

  if (budget) {
    const parsedBudget = Number(budget);
    if (!Number.isNaN(parsedBudget) && parsedBudget > 0) {
      query.price = { $lte: parsedBudget };
    }
  }

  try {
    let courses = await Course.find(query)
      .populate("category", "name")
      .populate("instructor", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(6);

    if (!courses.length) {
      courses = await Course.find({ status: "Published" })
        .populate("category", "name")
        .populate("instructor", "firstName lastName")
        .sort({ createdAt: -1 })
        .limit(6);
    }

    return courses.length ? courses : demoCourses;
  } catch (error) {
    console.warn("Using demo AI courses because database courses are unavailable:", error.message);
    return demoCourses;
  }
};

const localAdvisor = ({ goal, level, timePerWeek, courses }) => {
  const courseNames = courses.map((course) => course.courseName).filter(Boolean);
  const weeklyTime = timePerWeek || "4-6";
  const learnerLevel = level || "beginner";
  const focus = goal || "career-ready technical skills";

  return [
    `Here is a focused plan for ${focus}.`,
    "",
    `Start at a ${learnerLevel} pace and study ${weeklyTime} hours per week. Spend the first week mapping the basics, then move into small projects and quizzes so you can prove what you learned.`,
    "",
    "Recommended courses:",
    ...(courseNames.length
      ? courseNames.map((name, index) => `${index + 1}. ${name}`)
      : ["1. Browse the newest published courses and pick the closest match to your goal."]),
    "",
    "Next steps:",
    "1. Pick one main course instead of starting many at once.",
    "2. Save useful courses to your wishlist.",
    "3. Track progress weekly from the dashboard.",
    "4. Ask the AI tutor for a quiz after each major topic.",
  ].join("\n");
};

exports.getAIRecommendations = async (req, res) => {
  try {
    const { goal = "", level = "", timePerWeek = "", budget = "" } = req.query;
    const courses = await getRelevantCourses({ goal, budget });

    return res.status(200).json({
      success: true,
      data: {
        courses,
        summary: localAdvisor({ goal, level, timePerWeek, courses }),
      },
    });
  } catch (error) {
    console.error("AI recommendation error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not generate course recommendations",
    });
  }
};

exports.askAIAdvisor = async (req, res) => {
  try {
    const {
      message = "",
      goal = "",
      level = "",
      timePerWeek = "",
      budget = "",
      history = [],
    } = req.body;

    if (!message.trim() && !goal.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a goal or question for the AI tutor",
      });
    }

    const courses = await getRelevantCourses({ goal: goal || message, budget });
    const fallbackAnswer = localAdvisor({ goal: goal || message, level, timePerWeek, courses });

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        success: true,
        source: "local",
        data: {
          answer: fallbackAnswer,
          courses,
        },
      });
    }

    const recentHistory = Array.isArray(history)
      ? history.slice(-6).map((item) => `${item.role}: ${item.content}`).join("\n")
      : "";

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "You are StudyNotion's AI learning advisor. Give concise, practical learning plans, course recommendations, quiz questions, project ideas, and study tips. Do not invent courses outside the provided catalog. If the catalog is thin, say so and recommend the closest next action.",
          },
          {
            role: "user",
            content: [
              `Learner goal: ${goal || "Not specified"}`,
              `Level: ${level || "Not specified"}`,
              `Time per week: ${timePerWeek || "Not specified"}`,
              `Budget: ${budget || "Not specified"}`,
              `Recent conversation:\n${recentHistory || "No previous messages"}`,
              `Available courses:\n${buildCourseSummary(courses) || "No published courses available"}`,
              `Question: ${message || goal}`,
            ].join("\n\n"),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI response error:", errorText);
      return res.status(200).json({
        success: true,
        source: "local",
        data: {
          answer: fallbackAnswer,
          courses,
        },
      });
    }

    const result = await response.json();
    const answer =
      result.output_text ||
      result.output?.flatMap((item) => item.content || [])
        ?.map((content) => content.text)
        ?.filter(Boolean)
        ?.join("\n") ||
      fallbackAnswer;

    return res.status(200).json({
      success: true,
      source: "openai",
      data: {
        answer,
        courses,
      },
    });
  } catch (error) {
    console.error("AI advisor error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not reach the AI tutor",
    });
  }
};
