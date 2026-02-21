const validator = require("validator");

// helper for asserting validation
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Signup validation
function validateSignup({ username, email, password }) {
  assert(username && username.trim().length >= 3, "username must be at least 3 characters");
  assert(email && validator.isEmail(email), "email must be valid");
  assert(password && password.length >= 6, "password must be at least 6 characters");
}

// Employee input validation
function validateEmployeeInput(emp) {
  assert(emp.first_name, "first_name is required");
  assert(emp.last_name, "last_name is required");
  assert(emp.email && validator.isEmail(emp.email), "valid email is required");
  assert(["Male", "Female", "Other"].includes(emp.gender), "gender must be Male/Female/Other");
  assert(emp.designation, "designation is required");
  assert(typeof emp.salary === "number" && emp.salary >= 1000, "salary must be a number >= 1000");
  assert(emp.date_of_joining, "date_of_joining is required");
  assert(emp.department, "department is required");
}

module.exports = { assert, validateSignup, validateEmployeeInput };