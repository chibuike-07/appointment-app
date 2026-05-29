import "./styles.css";
import { useState } from "react";

const AppointmentList = ({ appointments, onDelete, onToggle, onEdit }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [editedTime, setEditedTime] = useState("");

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all')

  const startEdit = (appt) => {
    setEditingId(appt.id);
    setEditedName(appt.name);
    setEditedDate(appt.date);
    setEditedTime(appt.time);
  };

  const saveEdit = () => {
    onEdit(editingId, {
      name: editedName,
      date: editedDate,
      time: editedTime,
    });
    setEditingId(null);
  };

  const groupAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const grouped = {
      overdue: [],
      today: [],
      tomorrow: [],
      upcoming: [],
    };

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);

      if (appointmentDate < today) {
        grouped.overdue.push(appointment);
      }
      else if (appointmentDate.toDateString() === today.toDateString()) {
        grouped.today.push(appointment);
      } else if (appointmentDate.toDateString() === tomorrow.toDateString()) {
        grouped.tomorrow.push(appointment);
      } else {
        grouped.upcoming.push(appointment);
      }
    });

    return grouped;
  };

  const applyFilters = (appointments) => {
    return appointments
      .filter(
        (appointment) => appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

  const grouped = groupAppointments();
  const sortAppointments = (appointments) => {
  return [...appointments].sort(
    (a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA - dateB;
      }
    );
};

  const filteredGroups = {
    overdue: sortAppointments(applyFilters(grouped.overdue)),
    today: sortAppointments(applyFilters(grouped.today)),
    tomorrow: sortAppointments(applyFilters(grouped.tomorrow)),
    upcoming: sortAppointments(applyFilters(grouped.upcoming)),
  };

  const visibleSections =
  filter === 'all' ? filteredGroups
  :{[filter]: filteredGroups[filter]};


  

  const renderAppointmentItem = (appt) => (
    <div key={appt.id} className="appointment-list">
      <div className="appt-info">
        {editingId === appt.id ? (
          <div className="edit-form-inline">
            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="edit-input"
            />
            <div className="edit-date-time">
              <input
                type="date"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
              />
              <input
                type="time"
                value={editedTime}
                onChange={(e) => setEditedTime(e.target.value)}
              />
            </div>
            <button onClick={saveEdit} className="save-btn">Save</button>
            <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
          </div>
        ) : (
          <>
            <h4 className={appt.completed ? "completed-text" : ""}>
              {appt.name}
            </h4>
            <p className={`appt-details ${appt.completed ? "completed-text" : ""}`}>
              {appt.date} • {appt.time}
            </p>
          </>
        )}
      </div>

      <button onClick={() => onToggle(appt.id, appt.completed)}
        style={{
          margin: "auto",
          padding: "5px 10px",
          border: "none",
          cursor: "pointer",
          color: "white",
          backgroundColor: appt.completed ? "gray" : "green",
        }}
      >
        {appt.completed ? "Undo" : "Complete"}
      </button>

      <button onClick={() => onDelete(appt.id)}
        style={{
          margin: "auto",
          padding: "5px 10px",
          border: "none",
          cursor: "pointer",
          color: "white",
          backgroundColor: "red",
        }}
      >
        Delete
      </button>
      <button onClick={() => startEdit(appt)}>
        Edit
      </button>
    </div>
  );

  return (
    <div className="appointment-list-wrapper">
      <div className="appointment-list-header">
        <h3>Appointments</h3>
        <input type="text" placeholder="Search Appointment" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={filter}
          onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="overdue">Overdue</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>
      {appointments.length === 0 ? (
        <p>No appointments yet</p>
      ) : (
        <div>
          {visibleSections.overdue?.length > 0 && (
            <details className="overdue-dropdown">
              <summary className="group-title">Overdue</summary>
              {visibleSections.overdue.map(renderAppointmentItem)}
            </details>
          )}
          {visibleSections.today?.length > 0 && (
            <div className="grouped-section">
              <h3 className="group-title">Today</h3>
              {visibleSections.today.map(renderAppointmentItem)}
            </div>
          )}

          {visibleSections.tomorrow?.length > 0 && (
            <div className="grouped-section">
              <h3 className="group-title">Tomorrow</h3>
              {visibleSections.tomorrow.map(renderAppointmentItem)}
            </div>
          )}

          {visibleSections.upcoming?.length > 0 && (
            <div className="grouped-section">
              <h3 className="group-title">Upcoming</h3>
              {visibleSections.upcoming.map(renderAppointmentItem)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;