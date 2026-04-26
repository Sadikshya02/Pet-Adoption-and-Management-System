import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const API    = import.meta.env.VITE_API_URL    || "http://localhost:4000/api";
const SOCKET = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export const useShelterMap = () => {
  const [shelters, setShelters]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  // initial load
  useEffect(() => {
    fetch(`${API}/shelters/map`)          // ← /shelters/map (approved only, with coordinates)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message);
        setShelters(data.shelters);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // real-time
  useEffect(() => {
    const socket = io(SOCKET, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect",    () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // newly approved shelter appears on map immediately
    socket.on("shelter:new", (s) =>
      setShelters((prev) =>
        prev.find((x) => x._id === s._id) ? prev : [...prev, s]
      )
    );

    // full shelter details updated
    socket.on("shelter:updated", (s) =>
      setShelters((prev) =>
        prev.map((x) => (x._id === s._id ? { ...x, ...s } : x))
      )
    );

    // live operational status badge (accepting/full/closed)
    socket.on("shelter:statusChanged", ({ _id, shelterStatus }) =>
      setShelters((prev) =>
        prev.map((x) => (x._id === _id ? { ...x, shelterStatus } : x))
      )
    );

    // dynamic pet counts when a pet is added or marked adopted
    socket.on("shelter:petsUpdated", ({ _id, petCounts }) =>
      setShelters((prev) =>
        prev.map((x) => (x._id === _id ? { ...x, petCounts } : x))
      )
    );

    // shelter rejected or deleted — remove pin
    socket.on("shelter:removed", ({ _id }) =>
      setShelters((prev) => prev.filter((x) => x._id !== _id))
    );

    return () => socket.disconnect();
  }, []);

  return { shelters, loading, error, connected };
};