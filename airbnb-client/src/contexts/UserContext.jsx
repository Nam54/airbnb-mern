import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!user) {
  //       const { userData } = await axios.get("/profile");
  //       return userData;
  //     }
  //   };
  //   const userData = fetchData();
  //   setUser(userData);
  // }, []);

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        setUser(data);
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
