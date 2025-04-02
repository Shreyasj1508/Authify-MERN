import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Outlet, Navigate } from "react-router-dom";
import apis from "../utils/apis";
const Super = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRouteAccess = async () => {
      try {
        setLoading(true);
        const response = await fetch(apis().getAccess, {
          method: "POST",
          body: JSON.stringify({ token: localStorage.getItem("passToken") }),
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message);
        }

        if (result?.status) {
          setLoading(false);
          setIsAuth(true);
        }
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
      }
    };

    getRouteAccess();
  }, []);

  if (loading) {
    return <h5>loading...</h5>;
  }

  if (isAuth) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default Super;
