const mongoose = require("mongoose");

// Define the RatingAndReview schema
const ratingAndReviewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
	rating: {
		type: Number,
		required: true,
	},
	review: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ["Visible", "Hidden"],
		default: "Visible",
	},
	reportCount: {
		type: Number,
		default: 0,
	},
	reportReasons: [
		{
			type: String,
			trim: true,
		},
	],
	course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Course",
		index: true,
	},
});

// Export the RatingAndReview model
module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
