import { gql } from "@apollo/client";

export const GET_APPOINTMENTS = gql`
  query GetAppointments {
    appointments {
      id
      name
      date
      time
      completed
    }
  }
`;