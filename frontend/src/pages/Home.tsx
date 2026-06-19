import { useState, useEffect } from "react";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";
import Header from "../components/Header";
import Login from "./Login";
import Register from "./Register";
import { removeToken, isAuthenticated } from "../utils/auth";
import AppointmentCounter from "../components/AppointmentCounter";

import { useQuery } from "@apollo/client/react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_APPOINTMENT, DELETE_APPOINTMENT } from "../graphql/mutations/mutations";
import { GET_APPOINTMENTS } from "../graphql/queries/queries";

interface Appointment {
  id: number;
  name: string;
  date: string;
  time: string;
  completed: boolean;
}

interface GetAppointmentsData {
  appointments: Appointment[];
}

const Home = () => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isAuthenticated());
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
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
  const { loading, error, data } = useQuery<GetAppointmentsData>(GET_APPOINTMENTS, {
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

  //deleting appointment
  const handleDelete = async (
    id: number
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
    id: number,
    completed: boolean
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

  const handleUpdate = async (
    id: number,
    updatedFields: { name: string; date: string; time: string }
  ) => {
    try {
      await updateAppointment({
        variables: {
          id,
          ...updatedFields,
        },
      });
    } catch (err) {
      console.error(err);
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
  if (loading && !data) {
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
        <AppointmentForm />
        {/* {loading &&<p>Loading Appointment...</p>}  */}

        <AppointmentList appointments={appointments} onDelete={handleDelete} onToggle={toggleComplete} onEdit={handleUpdate} />
        {/* {error && <p>{error}</p>} */}
      </div>
      <footer className="home-footer" />
    </div>
  );
};

export default Home;