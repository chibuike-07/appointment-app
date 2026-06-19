import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Register(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    register(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    )
  }
`;

export const LOGIN = gql`
  mutation Login(
    $email: String!
    $password: String!
  ) {
    login(
      email: $email
      password: $password
    ) {
      access_token
      firstName
      lastName
    }
  }
`;


export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment(
    $name: String!
    $date: String!
    $time: String!
  ) {
    createAppointment(
      name: $name
      date: $date
      time: $time
    ) {
      id
      name
      date
      time
      completed
    }
  }
`;

export const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment(
    $id: Int!
    $completed: Boolean
    $name: String
    $date: String
    $time: String
  ) {
    updateAppointment(
      id: $id
      completed: $completed
      name: $name
      date: $date
      time: $time
    ) {
      id
      name
      date
      time
      completed
    }
  }
`;
export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment(
    $id: Int!
  ) {
    deleteAppointment(id: $id)
  }
`;