import { gql } from "@apollo/client";

export const GET_DUE_NOTIFICATIONS =
  gql`
    query {

      dueNotifications {

        id
        name
        date
        time
        notificationType
      }

    }
  `;

export const MARK_NOTIFICATION_SHOWN =
  gql`
    mutation MarkShown(
      $id: Float!
    ) {

      markNotificationShown(
        id: $id
      )

    }
  `;
