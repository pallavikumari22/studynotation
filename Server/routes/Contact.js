const express = require("express")
const { contactUs } = require("../controllers/Contact")

const router = express.Router()

router.post("/contact", contactUs)

module.exports = router
