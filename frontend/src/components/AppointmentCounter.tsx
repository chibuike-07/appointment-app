import "./styles.css";

interface Appointment {
  completed: boolean;
}

type AppointmentCounterProps = {
  appointments: Appointment[];
};

const AppointmentCounter = ({
  appointments,
}: AppointmentCounterProps) => {
  // all appointment counter
  const appointmentCount = appointments.filter(
    (appt) => appt
  ).length;

  // completed appointment counter
  const completedCount = appointments.filter(
    (appt) => appt.completed
  ).length;

  // uncompleted appointment counter
  const uncompleteCount = appointments.filter(
    (appt) => !appt.completed
  ).length;

  return (
    <div className="appointment-counter">
      <div className="counter-card total">
        <div className="counter-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
              ry="2"
            />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>

        <div className="counter-info">
          <span className="counter-label">
            Total Appointments
          </span>
          <span className="counter-value">
            {appointmentCount}
          </span>
        </div>
      </div>

      <div className="counter-card completed">
        <div className="counter-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <div className="counter-info">
          <span className="counter-label">
            Completed
          </span>
          <span className="counter-value">
            {completedCount}
          </span>
        </div>
      </div>

      <div className="counter-card uncompleted">
        <div className="counter-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className="counter-info">
          <span className="counter-label">
            Uncompleted
          </span>
          <span className="counter-value">
            {uncompleteCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCounter;

// import "./styles.css";
// type AppointmentCounterProps
// const AppointmentCounter = ({appointments}) => {
//       //all appointment counter
//   const appointmentCount = appointments.filter(
//     (appt) => appt).length;
//   //completed appointment counter
//   const completedCount = appointments.filter(
//     (appt) => appt.completed).length;
//   //uncompletes appointment counter
//   const uncompleteCount = appointments.filter(
//     (appt) => appt.completed === false).length;
//     return (
//         <div className="appointment-counter">
//             <div className="counter-card total">
//                 <div className="counter-icon">
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
//                         <line x1="16" y1="2" x2="16" y2="6"/>
//                         <line x1="8" y1="2" x2="8" y2="6"/>
//                         <line x1="3" y1="10" x2="21" y2="10"/>
//                     </svg>
//                 </div>
//                 <div className="counter-info">
//                     <span className="counter-label">Total Appointments</span>
//                     <span className="counter-value">{appointmentCount}</span>
//                 </div>
//             </div>
//             <div className="counter-card completed">
//                 <div className="counter-icon">
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
//                         <polyline points="22 4 12 14.01 9 11.01"/>
//                     </svg>
//                 </div>
//                 <div className="counter-info">
//                     <span className="counter-label">Completed</span>
//                     <span className="counter-value">{completedCount}</span>
//                 </div>
//             </div>
//             <div className="counter-card uncompleted">
//                 <div className="counter-icon">
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <circle cx="12" cy="12" r="10"/>
//                         <line x1="12" y1="8" x2="12" y2="12"/>
//                         <line x1="12" y1="16" x2="12.01" y2="16"/>
//                     </svg>
//                 </div>
//                 <div className="counter-info">
//                     <span className="counter-label">Uncompleted</span>
//                     <span className="counter-value">{uncompleteCount}</span>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default AppointmentCounter;