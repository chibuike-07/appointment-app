import "./styles.css";

const AppointmentCounter = ({appointments}) => {
      //all appointment counter
  const appointmentCount = appointments.filter(
    (appt) => appt).length;
  //completed appointment counter
  const completedCount = appointments.filter(
    (appt) => appt.completed).length;
  //uncompletes appointment counter
  const uncompleteCount = appointments.filter(
    (appt) => appt.completed === false).length;
    return (
        <div className="appointment-counter">
            <p>Total Appointments: {appointmentCount}</p>
            <p>Completed Appointments: {completedCount}</p>
            <p>Uncompleted Appointments: {uncompleteCount}</p>
        </div>
    );
};
export default AppointmentCounter;