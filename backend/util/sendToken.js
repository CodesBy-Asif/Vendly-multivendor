
const sendToken = (user, statuscode, res, message) => {

    const token = user.generateJWT();

    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        secure: false, // or true if using HTTPS
        sameSite: "none",
    }

    res.status(statuscode).cookie("token", token, options).json({
        success: true,
        user,
        token, message
    })
}
module.exports = sendToken  