import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import { GET_DUE_NOTIFICATIONS, MARK_NOTIFICATION_SHOWN } from "../graphql/notifications";

import { isAuthenticated } from "../utils/auth";
import "./styles.css";

interface Notification {
  id: string;
  name: string;
  notificationType: "before" | "now";
  date: string;
  time: string;
}

interface DueNotificationsData {
  dueNotifications: Notification[];
}

const ReminderNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const isLoggedIn = isAuthenticated();

  const { data } = useQuery<DueNotificationsData>(
    GET_DUE_NOTIFICATIONS,
    {
      pollInterval: 5000,
      skip: !isLoggedIn,
    }
  );

  const [markShown] = useMutation(MARK_NOTIFICATION_SHOWN);
  const shownNotifications = useRef<Set<string>>(new Set());

  // Request system notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    if (!data?.dueNotifications) return;

    data.dueNotifications.forEach((notification) => {
      // Prevent duplicate notification popups (e.g. in React StrictMode double-renders)
      if (shownNotifications.current.has(notification.id)) {
        return;
      }
      shownNotifications.current.add(notification.id);

      // Trigger native system notification
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("🔔 Appointment Reminder", {
            body: `"${notification.name}" ${
              notification.notificationType === "before"
                ? "starts in 15 minutes"
                : "starts NOW"
            } at ${notification.time}`,
          });
        }
      }

      setNotifications((prev) => {
        if (
          prev.some(
            (item) => item.id === notification.id
          )
        ) {
          return prev;
        }

        setTimeout(async () => {
          setNotifications((current) =>
            current.filter(
              (item) => item.id !== notification.id
            )
          );

          try {
            await markShown({
              variables: {
                id: Number(notification.id),
              },
            });
          } catch (err) {
            console.error(
              "Error marking notification as shown:",
              err
            );
          }
        }, 10000);

        return [...prev, notification];
      });
    });
  }, [data, markShown]);

  return (
    <div className="notification-wrapper">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="notification-box"
        >
          <h4>🔔 Reminder</h4>

          <p>{notification.name}</p>

          <p>
            {notification.notificationType === "before"
              ? "Starts in 15 minutes"
              : "Starts NOW"}
          </p>

          <small>
            {notification.date} {notification.time}
          </small>
        </div>
      ))}
    </div>
  );
};

export default ReminderNotifications;

// import { useQuery, useMutation } from "@apollo/client/react";
// import { GET_DUE_NOTIFICATIONS, MARK_NOTIFICATION_SHOWN } from "../graphql/notifications";
// import { useEffect, useState } from "react";
// import { isAuthenticated } from "../utils/auth";
// import "./styles.css";

// const ReminderNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const isLoggedIn = isAuthenticated();
//   const { data } = useQuery(GET_DUE_NOTIFICATIONS, {
//     pollInterval: 5000,
//     skip: !isLoggedIn,
//   });

//   const [markShown,] = useMutation(MARK_NOTIFICATION_SHOWN);

//   useEffect(() => {
//     if (!data?.dueNotifications) return;
//     data.dueNotifications.forEach((notification) => {
//       setNotifications((prev) => {
//         if (prev.some((item) => item.id === notification.id)) {
//           return prev;
//         }
        
//         setTimeout(async () => {
//           setNotifications((current) =>
//             current.filter((item) => item.id !== notification.id)
//           );
//           try {
//             await markShown({
//               variables: { id: Number(notification.id) },
//             });
//           } catch (err) {
//             console.error("Error marking notification as shown:", err);
//           }
//         }, 5000);

//         return [...prev, notification];
//       });
//     });
//   }, [data, markShown]);

//   return (
//   <div className="notification-wrapper">
//     {notifications.map(
//       (notification) => (
//         <div
//           key={notification.id}
//           className="notification-box"
//         >
//           <h4>
//             🔔 Reminder
//           </h4>
//           <p>
//             {notification.name}
//           </p>
//           <p>
//             {notification.notificationType === "before"
//             ? "Starts in 15 minutes"
//             : "Starts NOW"
//             }
//           </p>
//           <small>
//             {notification.date}
//             {" "}
//             {notification.time}
//           </small>
//         </div>
//       )
//     )}

//   </div>

// );
// };

// export default ReminderNotifications;