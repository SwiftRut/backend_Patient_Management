import doctorModel from "../models/doctorModel.js";


export const registerAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      country,
      state,
      city,
      hospital,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !country ||
      !state ||
      !city
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const newAdmin = new adminModel({
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
      state,
      city,
      hospital,
      role: "admin",
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin registered successfully",
      newAdmin,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email/phone and password" });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();
    const normalizedPhone = identifier.trim().replace(/[\s\+\-\(\)]/g, "");

    const doctor = await doctorModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });

    if (!doctor) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? "7d" : "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      doctor: {
        id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        phone: doctor.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res
        .status(400)
        .json({ message: "Please provide email or phone number" });
    }

    const doctor = await doctorModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!doctor) {
      return res.status(404).json({ message: "doctor not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    doctor.resetPasswordOtp = hashedOtp;
    doctor.resetPasswordExpires = otpExpiry;
    await doctor.save();

    if (identifier.includes("@")) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        to: doctor.email,
        from: process.env.EMAIL_USER,
        subject: "Password Reset OTP",
        text: `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`,
      };

      await transporter.sendMail(mailOptions);

      return res
        .status(200)
        .json({ message: "OTP has been sent to your email" });
    } else {
      await twilioClient.messages.create({
        body: `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: doctor.phone,
      });

      return res
        .status(200)
        .json({ message: "OTP has been sent to your phone" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Please provide a new password and confirmation" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const doctor = await doctorModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!doctor) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(password, salt);
    doctor.resetPasswordToken = undefined;
    doctor.resetPasswordExpires = undefined;

    await doctor.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
