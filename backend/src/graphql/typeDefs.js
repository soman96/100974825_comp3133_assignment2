// Types - what you return
// Inputs - what you accept
// Queries - read requests
// Mutations - write requests

const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  type AuthPayload {
    message: String!
    token: String
    user: User
  }

  type EmployeePayload {
    message: String!
    employee: Employee
  }

  type DeletePayload {
    message: String!
    deletedId: ID
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    username_or_email: String!
    password: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
  }

  type Query {
    login(input: LoginInput!): AuthPayload!
    getAllEmployees: [Employee!]!
    getEmployeeById(eid: ID!): Employee!
    searchEmployees(designation: String, department: String): [Employee!]!
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload!
    addEmployee(input: EmployeeInput!): EmployeePayload!
    updateEmployee(eid: ID!, input: UpdateEmployeeInput!): EmployeePayload!
    deleteEmployee(eid: ID!): DeletePayload!
  }
`;