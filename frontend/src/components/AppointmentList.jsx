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
      <button onClick={() => startEdit(appt)}
        title="Edit"
        style={{
          padding: "4px",
          border: "none",
          cursor: "pointer",
          color: "var(--text-secondary)",
          backgroundColor: "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "color 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
        </svg>
      </button>
    </div>
  );

  return (
    <div className="appointment-list-wrapper">
      <div className="appointment-list-header">
        <span title="Appointments" style={{ display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="8" y1="16" x2="12" y2="16"/>
          </svg>
        </span>
        <div className="search-wrapper">
          <span className="search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input className="search-input" type="text" placeholder="Search Appointment" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-wrapper">
          <span className="filter-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
          </span>
          <select value={filter}
            onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="overdue">Overdue</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="upcoming">Upcoming</option>
          </select>
          <span className="dropdown-arrow">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </div>
      </div>
      {appointments.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1rem',
          color: 'var(--text-secondary)',
          gap: '0.75rem',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p style={{ fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>No appointments yet</p>
        </div>
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