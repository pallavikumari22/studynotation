const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.contactUs = async (req, res) => {
  try {
    const { email, firstname, lastname = "", message, phoneno, countrycode = "" } = req.body

    if (!email || !firstname || !message || !phoneno) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone number, and message are required",
      })
    }

    await mailSender(
      email,
      "We received your StudyNotion message",
      contactUsEmail(email, firstname, lastname, message, phoneno, countrycode)
    )

    if (process.env.MAIL_USER && process.env.MAIL_USER !== email) {
      await mailSender(
        process.env.MAIL_USER,
        `New StudyNotion contact from ${firstname}`,
        `<p><strong>Name:</strong> ${firstname} ${lastname}</p>
         <p><strong>Email:</strong> ${email}</p>
         <p><strong>Phone:</strong> ${countrycode} ${phoneno}</p>
         <p><strong>Message:</strong></p>
         <p>${message}</p>`
      )
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
