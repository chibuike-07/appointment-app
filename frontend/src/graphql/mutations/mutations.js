import { gql } from "@apollo/client";

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
    $completed: Boolean!
  ) {
    updateAppointment(
      id: $id
      completed: $completed
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