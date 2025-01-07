import React, { useState } from "react";
import { Button } from "@instructure/ui-buttons";
import {
  IconCalendarMonthSolid,
  IconCanvasLogoLine,
  IconDashboardLine,
  IconHamburgerLine,
  IconHamburgerSolid,
  IconHomeLine,
  IconMoveStartSolid,
  IconUserLine,
} from "@instructure/ui-icons";
import { Link, Outlet } from "react-router-dom";
import { Breadcrumb } from "@instructure/ui";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(true);

  return (
    <div className="min-h-screen flex ">
      {/* Sidebar */}
      <div
        className={`flex flex-col items-center ${
          sidebarOpen ? "w-64" : "w-[84px]"
        } bg-primarySidebar text-white shadow-lg transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1
            className={`text-lg font-semibold ${
              sidebarOpen ? "block" : "hidden"
            }`}
          >
            Canvas
          </h1>
          {/* <Button
            variant="icon"
            size="large"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            screenReaderLabel="Toggle Sidebar"
            renderIcon={IconCanvasLogoLine}
          /> */}
          <div>
            <IconCanvasLogoLine size="medium" />
          </div>
        </div>
        <nav className="flex-1 flex flex-col mt-4 items-center gap-5 p-1">
          <Link to="/dashboard" className="flex flex-col items-center gap-2">
            <IconUserLine
              size="small"
              className={`${sidebarOpen ? "mr-3" : ""}`}
            />
            <span className={`${sidebarOpen ? "hidden" : "block"}`}>
              Cuenta
            </span>
            <span className={`${sidebarOpen ? "block" : "hidden"}`}>
              Cuenta
            </span>
          </Link>
          <Link to="/profile" className="flex items-center flex-col gap-2">
            <IconDashboardLine
              size="small"
              className={`${sidebarOpen ? "mr-3" : ""}`}
            />
            <span className={`${sidebarOpen ? "hidden" : "block"}`}>
              Tablero
            </span>
            <span className={`${sidebarOpen ? "block" : "hidden"}`}>
              Tablero
            </span>
          </Link>
          <Link to="/profile" className="flex items-center flex-col gap-2">
            <IconUserLine
              size="small"
              className={`${sidebarOpen ? "mr-3" : ""}`}
            />
            <span className={`${sidebarOpen ? "hidden" : "block"}`}>
              Cursos
            </span>
            <span className={`${sidebarOpen ? "block" : "hidden"}`}>
              Cursos
            </span>
          </Link>
          <Link to="/profile" className="flex items-center flex-col gap-2">
            <IconCalendarMonthSolid
              size="small"
              className={`${sidebarOpen ? "mr-3" : ""}`}
            />
            <span className={`${sidebarOpen ? "hidden" : "block"}`}>
              Calendario
            </span>
            <span className={`${sidebarOpen ? "block" : "hidden"}`}>
              Calendario
            </span>
          </Link>
          <Link to="/profile" className="flex items-center flex-col gap-2">
            <IconUserLine
              size="small"
              className={`${sidebarOpen ? "mr-3" : ""}`}
            />
            <span
              className={`text-center text-sm ${
                sidebarOpen ? "hidden" : "block"
              }`}
            >
              Bandeja de Entrada
            </span>
            <span className={`${sidebarOpen ? "block" : "hidden"}`}>
              Bandeja de Entrada
            </span>
          </Link>
        </nav>
        <Link to="/" className="flex items-center p-3">
          <IconMoveStartSolid
            size="small"
            className={`${sidebarOpen ? "mr-3" : ""}`}
          />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-white w-auto shadow p-4 flex items-center mx-6 gap-3 text-blue-400">
          <div className="" onClick={() => setSectionsOpen(!sectionsOpen)}>
            <IconHamburgerSolid />
          </div>

          <div className="flex-1">
            <Breadcrumb size="medium" label="Breadcrumb with icons">
              <Breadcrumb.Link>Paralelo3_IDIG1010</Breadcrumb.Link>
              <Breadcrumb.Link>Calificaciones</Breadcrumb.Link>
              <Breadcrumb.Link>Progueso del Curso</Breadcrumb.Link>
            </Breadcrumb>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 w-full h-auto">
          <div className="flex ">
            <div className="w-[192px] ">
              <div className="p-4 text-sm font-light italic">2 PAO 2024</div>
              <ul className="flex flex-col gap-2 text-[#008EE2] font-medium leading-6">
                <li className="section">
                  <Link to="/courses/1" className="home" tabIndex="0">
                    Página de Inicio
                  </Link>
                </li>
                <li className="section">
                  <Link
                    to="/courses/1/announcements"
                    className="announcements"
                    tabIndex="0"
                  >
                    Anuncios
                  </Link>
                </li>
                <li className="section">
                  <Link
                    to="/courses/1/assignments"
                    className="assignments"
                    tabIndex="0"
                  >
                    Tareas
                  </Link>
                </li>
                <li className="section">
                  <Link
                    to="/courses/1/discussion_topics"
                    className="discussions"
                    tabIndex="0"
                  >
                    Foros de discusión
                  </Link>
                </li>
                <li className="section">
                  <Link to="/courses/1/wiki" className="pages" tabIndex="0">
                    Páginas
                  </Link>
                </li>
                <li className="section">
                  <Link
                    to="/courses/1/assignments/syllabus"
                    className="syllabus"
                    tabIndex="0"
                  >
                    Programa del curso
                  </Link>
                </li>
                <li className="section">
                  <Link
                    to="/courses/1/grades"
                    aria-current="page"
                    className="grades active"
                    tabIndex="0"
                  >
                    Calificaciones
                  </Link>
                </li>
                <li className="section">
                  <Link
                    to="/courses/1/quizzes"
                    className="quizzes"
                    tabIndex="0"
                  >
                    Evaluaciones
                  </Link>
                </li>
                <li className="section">
                  <Link
                    to="/courses/1/external_tools/336?display=borderless"
                    className="context_external_tool_336"
                    target="_blank"
                    tabIndex="0"
                  >
                    Perusall
                  </Link>
                </li>
                <li className="section">
                  <Link
                    to="/courses/1/external_tools/704"
                    className="context_external_tool_704"
                    tabIndex="0"
                  >
                    Registro de Asistencia
                  </Link>
                </li>
                <li className="section">
                  <Link
                    to="/courses/1/external_tools/2122"
                    className="context_external_tool_2122"
                    tabIndex="0"
                  >
                    Formularios de Retroalimentación Estudiantil
                  </Link>
                </li>
                <li className="section">
                  <Link to="/courses/1/external_tools/5499">Booklick</Link>
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-gray-100">
              <div className="flex max-w-[1440px] w-full flex-wrap lg:flex-nowrap lg:flex-row lg:items-stretch">
                {/* <!-- Contenedor principal (flex-1) --> */}
                <div className="flex-1">
                  <Outlet />
                </div>

                {/* <!-- Contenedor lateral derecho (288px) --> */}
                <div className="w-full lg:w-[288px] p-6">
                  <div className="hidden">
                    <h3 className="text-lg font-bold">Panel derecho</h3>
                    <p>Este contenedor tiene un ancho fijo de 288px.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
