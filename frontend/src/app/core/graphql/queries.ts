import { gql } from 'apollo-angular';

// LoginInput using username_or_email
export const LOGIN = gql`
  query Login($input: LoginInput!) {
    login(input: $input) {
      message
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// SignupInput: username, email, password
export const SIGNUP = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      message
      token
      user {
        _id
        username
        email
      }
    }
  }
`;


export const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees {
    getAllEmployees {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

// getEmployeeById
export const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployeeById($eid: ID!) {
    getEmployeeById(eid: $eid) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;


// searchig emp by designation and department and both args are optional
export const SEARCH_EMPLOYEES = gql`
  query SearchEmployees($designation: String, $department: String) {
    searchEmployees(designation: $designation, department: $department) {
      _id
      first_name
      last_name
      email
      designation
      department
      salary
      date_of_joining
      employee_photo
    }
  }
`;

// ─── EMPLOYEE MUTATIONS ───────────────────────────────────────────────────────

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
      message
      employee {
        _id
        first_name
        last_name
      }
    }
  }
`;

// UpdateEmployeeInput — all fields are optional on the backend
export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($eid: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(eid: $eid, input: $input) {
      message
      employee {
        _id
        first_name
        last_name
      }
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($eid: ID!) {
    deleteEmployee(eid: $eid) {
      message
      deletedId
    }
  }
`;