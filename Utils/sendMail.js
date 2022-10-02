const nodemailer = require("nodemailer");

const verifyLinkSubject = "Verification Link - Please verify your Email by clicking on given link";
const resetPasswordSubject = "Reset Password - Reset your Password by clicking on given link";

const sendEmail = async (email, purpose , link) => {
  try {

    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: purpose === 'VU' ? verifyLinkSubject : resetPasswordSubject,
      html: `
          <h1>Welcome to Vegety</h1>
          <p>I hope you are well!</p>
          <br />
          <p>This is a ${purpose === 'VU' ? 'verification' : 'reset password'} link. Please click on given link to ${purpose === 'VU' ? 'verify your email account' : 'reset your password'}</p>
          <br />
          ${link}
      ` ,
    });
    console.log("email sent sucessfully");
    return true;
  } catch (error) {
    console.log("email not sent");
    console.log(error);
    return false;
  }
};

module.exports = sendEmail;