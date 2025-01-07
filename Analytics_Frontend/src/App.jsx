import { BsMenuApp } from "react-icons/bs";
import "./App.css";
import { canvas, InstUISettingsProvider } from "@instructure/ui";
import ProgresoCurso from "./pages/ProgresoCurso";
import ActividadEstadistica from "./pages/ActividadEstadistica";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import StudentHistory from "./pages/StudentHistory";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/courses/:id/",
    element: <MainLayout />,
    children: [
      { path: "profesores-actividad", element: <ActividadEstadistica /> },
      { path: "profesores-progueso-curso", element: <ProgresoCurso /> },
      { path: "historial-estudiantes", element: <StudentHistory /> },
    ],
  },
]);

function App() {
  return (
    <>
      <InstUISettingsProvider theme={canvas}>
        {/* <div className="min-h-screen h-full w-full">
          <section className="h-20 w-full bg-slate-300 flex items-center justify-start p-3">
            <Link to="/">
              <BsMenuApp className="cursor-pointer text-3xl" />
            </Link>
          </section>
          <hr className="w-full border-black" />
          <section className="w-[1200px] h-full mx-auto border-2"></section>
        </div> */}
        <RouterProvider router={router} />
      </InstUISettingsProvider>
    </>
  );
}

export default App;
