import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../Layouts/RootLayout";
import Dashboard from "../pages/Dashboard";
import Schedule from "../pages/Schedule";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings ";
import Class from "../pages/Class";
import Login from "../components/Login";
import Add from "../pages/CRUD_DSB/Add";
import Edit from "../pages/CRUD_DSB/Edit";
import Student from "../pages/Student";
import AddStudent from "../pages/CRUD_STU/AddStudent";
import EditStudent from "../pages/CRUD_STU/EditStudent";
import AddClass from "../pages/CRUD_CLASS/AddClass";
import EditClass from "../pages/CRUD_CLASS/EditClass";
import Attendance from "../pages/Attendance";
import AddAttendance from "../pages/CRUD_Attendance/AddAttendance";
import EditAttendance from "../pages/CRUD_Attendance/EditAttendance";
import Stu_Attendance from "../pages/Stu_Attendance";
import CountAttendance from "../pages/CountAttendance";

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
        path:"/users/create",
        element: <Add />
      },
      {
        path:"/users/edit/:id",
        element: <Edit />
      },
      {
        path:"/students",
        element: <Student />
      },
      {
        path:"/students/add",
        element: <AddStudent />
      },
      {
        path:"/students/edit/:id",
        element: <EditStudent />
      },
      {
        path:"/classes",
        element: <Class />
      },
      {
        path:"/classes/add",
        element: <AddClass />
      },
      {
        path:"/classes/edit/:id",
        element: <EditClass />
      },
      {
        path:"/attendances",
        element: <Attendance />
      },
      {
        path:"/attendance",
        element: <Stu_Attendance />
      },
      {
        path:"/attendance/count",
        element: <CountAttendance />
      },
      {
        path:"/attendance/add",
        element: <AddAttendance />
      },
      {
        path:"/attendance/edit/:id",
        element: <EditAttendance />
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

    ],
  },
]);

const AppRoute = () => {
  return <RouterProvider router={router} />;
};

export default AppRoute;