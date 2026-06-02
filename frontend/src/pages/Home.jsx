import { useState, useEffect } from "react";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";
import Header from "../components/Header";
import { createAppointment } from "../api/appointment";
import Login from "../pages/Login";
import Register from "./Register";
import Button from "../components/Button";
import { removeToken, isAuthenticated } from "../utils/auth";
import AppointmentCounter from "../components/AppointmentCounter";

import { useQuery } from "@apollo/client/react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_APPOINTMENT } from "../graphql/mutations/mutations.js";
import { DELETE_APPOINTMENT } from "../graphql/mutations/mutations.js";
import { GET_APPOINTMENTS } from "../graphql/queries/queries.js";


const Home = () => {
  const [authMode, setAuthMode] = useState("login")
  const [creating, setCreating] = useState(false);

  // const [appointments, setAppointments] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  useEffect(() => {
    setFirstName(localStorage.getItem('firstName') || '');
    setLastName(localStorage.getItem('lastName') || '');
  }, []);

  // Reload name when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      setFirstName(localStorage.getItem('firstName') || '');
      setLastName(localStorage.getItem('lastName') || '');
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
  };
  const { loading, error, data } = useQuery(GET_APPOINTMENTS, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only'
  });

  const appointments =
    data?.appointments || [];

  const [updateAppointment] =
    useMutation(
      UPDATE_APPOINTMENT,
      {
        refetchQueries: [
          GET_APPOINTMENTS,
        ],
      }
    );
  const [deleteAppointment] =
    useMutation(
      DELETE_APPOINTMENT,
      {
        refetchQueries: [
          GET_APPOINTMENTS,
        ],
      }
    );


  //creating appointment on endpoint
  const addAppointment = async (appointment) => {
    setCreating(true)

    try {
      const newAppt = await createAppointment(appointment);
      setAppointments((prev) => [...prev, newAppt]);
    } catch (err) {
      console.error(err);
      setError("failed to create appointment")
    } finally {
      setCreating(false);
    }
  };

  //deleting appointment
  const handleDelete = async (
    id
  ) => {
    try {
      await deleteAppointment({
        variables: { id },
      });
    } catch (err) {
      console.error(err);
    }
  };

  //completing appointment
  const toggleComplete = async (
    id,
    completed
  ) => {
    try {
      await updateAppointment({
        variables: {
          id,
          completed:
            !completed,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id, updatedFields) => {
    try {
      const updated = await updateAppointment(id, updatedFields);
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? updated : appt))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update appointment");
    }
  };

  //no token? show login page, else show home page
  if (!isLoggedIn) {
    if (authMode === "login") {
      return (
        <Login
          onLogin={() =>
            setIsLoggedIn(true)
          }
          goToRegister={() =>
            setAuthMode("register")
          }
        />
      );
    }
    return (
      <Register
        onRegister={() =>
          setIsLoggedIn(true)
        }
        goTologin={() => setAuthMode("login")}
      />
    );
  }
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Appointments...</p>
      </div>
    );
  }
  if (error) {
    console.error('GraphQL error:', error.message);
    if (error.message.includes('Unauthorized')) {
      removeToken();
      window.location.reload();
      return null;
    }
    return <p style={{ color: "red" }}>something went wrong!</p>
  }
  return (
    <div className="homepage">
      <Header title="Appointment Booking System" />
      <button onClick={handleLogout}>logout </button>
      {firstName || lastName ? (
        <div className="welcome-greeting" style={{
          fontWeight: 'bold',
          fontSize: '1.1rem',
          color: '#6366f1',
          padding: '1rem 0',
        }}>
          Welcome, {firstName} {lastName}
        </div>
      ) : null}
      <AppointmentCounter appointments={appointments} />
      <div className="form-list section">
        <AppointmentForm onAdd={addAppointment} creating={creating} />
        {/* {loading &&<p>Loading Appointment...</p>}  */}

        <AppointmentList appointments={appointments} onDelete={handleDelete} onToggle={toggleComplete} onEdit={handleUpdate} />
        {/* {error && <p>{error}</p>} */}
      </div>
      <footer className="home-footer" />
    </div>
  );
};

export default Home;