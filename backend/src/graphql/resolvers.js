const bcrypt = require("bcryptjs");
const validator = require("validator");

const User = require("../models/User");
const Employee = require("../models/Employee");
const cloudinary = require("../config/cloudinary");
const { signToken } = require("../utils/auth");
const { assert, validateSignup, validateEmployeeInput } = require("../utils/validation");

// Helper to see if user is authenticated in context otherwise throw error
function requireAuth(context) {
  if (!context || !context.user) {
    throw new Error("Unauthorized. Please login.");
  }
}

module.exports = {

  // Convert date_of_joining to ISO string for frontend
  Employee: {
    date_of_joining: (parent) => {
      return parent.date_of_joining
        ? new Date(parent.date_of_joining).toISOString()
        : null;
    },
  },

  Query: {
    // Login with username or email
    async login(_, { input }) {
      const { username_or_email, password } = input;

      const user = await User.findOne({
        $or: [{ username: username_or_email }, { email: username_or_email }],
      });

      assert(user, "Invalid credentials");

      const ok = await bcrypt.compare(password, user.password);
      assert(ok, "Invalid credentials");

      const token = signToken(user);

      return { message: "Login successful", token, user };
    },

    // Get all emps sorted by creation date desc
    async getAllEmployees(_, __, context) {
      requireAuth(context);
      return Employee.find().sort({ created_at: -1 });
    },

    // Get emp by id
    async getEmployeeById(_, { eid }, context) {
      requireAuth(context);
      const employee = await Employee.findById(eid);
      assert(employee, "Employee not found");
      return employee;
    },

    // Search emps by designation or department
    async searchEmployees(_, { designation, department }, context) {
      requireAuth(context);
      const filter = {};
      if (designation) filter.designation = designation;
      if (department) filter.department = department;

      if (!designation && !department) return [];
      return Employee.find(filter);
    },
  },

  Mutation: {
    // Signup new user
    async signup(_, { input }) {
      validateSignup(input);

      const { username, email, password } = input;

      const exists = await User.findOne({ $or: [{ username }, { email }] });
      assert(!exists, "User with that username/email already exists");

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({ username, email, password: hashed });

      const token = signToken(user);

      return { message: "Signup successful", token, user };
    },

    // Add new employee
    async addEmployee(_, { input }, context) {
      requireAuth(context);
      validateEmployeeInput(input);

      const emailTaken = await Employee.findOne({ email: input.email });
      assert(!emailTaken, "Employee email already exists");

      let photoUrl = null;

      // Upload photo if provided
      if (input.employee_photo) {
        const uploaded = await cloudinary.uploader.upload(input.employee_photo, {
          folder: "comp3133_emps",
        });
        photoUrl = uploaded.secure_url;
      }

      const employee = await Employee.create({
        ...input,
        employee_photo: photoUrl,
        date_of_joining: new Date(input.date_of_joining),
      });

      return { message: "Employee created successfully", employee };
    },

    // Update employee by id
    async updateEmployee(_, { eid, input }, context) {
      requireAuth(context);
      const existing = await Employee.findById(eid);
      assert(existing, "Employee not found");

      // If updating email validate and ensure its unique
      if (input.email) {
        assert(validator.isEmail(input.email), "valid email is required");

        const taken = await Employee.findOne({ email: input.email });
        if (taken && taken._id.toString() !== eid) {
          throw new Error("Employee email already exists");
        }
      }

      if (input.salary !== undefined) {
        assert(typeof input.salary === "number" && input.salary >= 1000, "salary must be >= 1000");
      }

      // Upload new photo to Cloudinary if provided
      if (input.employee_photo) {
        const uploaded = await cloudinary.uploader.upload(input.employee_photo, {
          folder: "comp3133_emps",
        });
        input.employee_photo = uploaded.secure_url;
      }

      // Convert date string to Date object
      if (input.date_of_joining) {
        input.date_of_joining = new Date(input.date_of_joining);
      }

      // returnDocument replaces deprecated { new: true }
      const updated = await Employee.findByIdAndUpdate(eid, input, { returnDocument: 'after' });

      return { message: "Employee updated successfully", employee: updated };
    },

    // Delete employee by id
    async deleteEmployee(_, { eid }, context) {
      requireAuth(context);
      const deleted = await Employee.findByIdAndDelete(eid);
      assert(deleted, "Employee not found");

      return { message: "Employee deleted successfully", deletedId: deleted._id };
    },
  },
};