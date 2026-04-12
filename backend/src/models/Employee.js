const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },

    designation: { type: String, required: true, trim: true },

    salary: {
      type: Number,
      required: true,
      min: 1000,
    },

    date_of_joining: { type: Date, required: true },

    department: { type: String, required: true, trim: true },

    // going to store Cloudinary URL here
    employee_photo: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Employee", employeeSchema);