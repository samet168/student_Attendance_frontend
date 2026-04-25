import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../Layouts/RootLayout";
import Dashboard from "../pages/Dashboard";
import Schedule from "../pages/Schedule";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings ";
import Class from "../pages/Class";
import Login from "../components/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path:"login",
        element: <Login />
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "class",
        element: <Class />,
      }
    ],
  },
]);

const AppRoute = () => {
  return <RouterProvider router={router} />;
};

export default AppRoute;