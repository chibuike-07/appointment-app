import { useQuery, useMutation } from "@apollo/client/react";
import { GET_DUE_NOTIFICATIONS, MARK_NOTIFICATION_SHOWN } from "../graphql/notifications";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../utils/auth";
import "./styles.css";

const ReminderNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const isLoggedIn = isAuthenticated();
  const { data } = useQuery(GET_DUE_NOTIFICATIONS, {
    pollInterval: 5000,
    skip: !isLoggedIn,
  });

  const [markShown,] = useMutation(MARK_NOTIFICATION_SHOWN);

  useEffect(() => {
    if (!data?.dueNotifications) return;
    data.dueNotifications.forEach((notification) => {
      setNotifications((prev) => {
        if (prev.some((item) => item.id === notification.id)) {
          return prev;
        }
        
        setTimeout(async () => {
          setNotifications((current) =>
            current.filter((item) => item.id !== notification.id)
          );
          try {
            await markShown({
              variables: { id: Number(notification.id) },
            });
          } catch (err) {
            console.error("Error marking notification as shown:", err);
          }
        }, 5000);

        return [...prev, notification];
      });
    });
  }, [data, markShown]);

  return (
  <div className="notification-wrapper">
    {notifications.map(
      (notification) => (
        <div
          key={notification.id}
          className="notification-box"
        >
          <h4>
            🔔 Reminder
          </h4>
          <p>
            {notification.name}
          </p>
          <p>
            {notification.notificationType === "before"
            ? "Starts in 15 minutes"
            : "Starts NOW"
            }
          </p>
          <small>
            {notification.date}
            {" "}
            {notification.time}
          </small>
        </div>
      )
    )}

  </div>

);
};

export default ReminderNotifications;