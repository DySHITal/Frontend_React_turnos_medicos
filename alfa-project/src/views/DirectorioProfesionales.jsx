import React, { useEffect, useState } from "react";
import medico from "../assets/medico-icono.png";
import Navbar from "./components/Navbar";
import img2 from "../assets/imgCMI-2.jpg";
import Footer from "./components/Footer";

const DirectorioProfesionales = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [filteredProfesionales, setFilteredProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    nombre: true,
    obraSocial: false,
    matricula: false,
    especialidad: false,
  });
  const [filterError, setFilterError] = useState("");

  const fetchObrasSociales = async (id_profesional) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/os_profesional/${id_profesional}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(
            `No se encontraron obras sociales para el profesional ${id_profesional}.`
          );
          return [];
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const obrasSociales = data.map((item) => item[0]);
      return obrasSociales;
    } catch (error) {
      console.error(
        `Error al obtener obras sociales para el profesional ${id_profesional}: ${error.message}`
      );
      return [];
    }
  };

  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/get_profesionales",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los profesionales.");
        }
        const profesionales = await response.json();

        for (const profesional of profesionales) {
          const obrasSociales = await fetchObrasSociales(
            profesional.id_profesional
          );
          profesional.obrasSociales = obrasSociales;
        }

        setProfesionales(profesionales);
        setFilteredProfesionales(profesionales);
      } catch (err) {
        console.error("Error general:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfesionales();
  }, []);

  const normalize = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const handleSearch = () => {
    const isAnyFilterSelected = Object.values(selectedFilters).some(
      (filter) => filter
    );
    if (!isAnyFilterSelected) {
      setFilterError("Debe seleccionar al menos un filtro antes de buscar.");
      return;
    }

    setFilterError(""); 

    const filtered = profesionales.filter((profesional) => {
      let matches = false;

      if (selectedFilters.nombre) {
        matches =
          normalize(profesional.nombre).includes(normalize(searchTerm)) ||
          normalize(profesional.apellido).includes(normalize(searchTerm));
      }

      if (selectedFilters.obraSocial) {
        matches =
          matches ||
          profesional.obrasSociales.some((os) =>
            normalize(os).includes(normalize(searchTerm))
          );
      }

      if (selectedFilters.matricula) {
        matches =
          matches ||
          profesional.numero_matricula.toString().includes(searchTerm);
      }

      if (selectedFilters.especialidad) {
        matches =
          matches ||
          normalize(profesional.especialidad).includes(normalize(searchTerm));
      }

      return matches;
    });

    setFilteredProfesionales(filtered);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredProfesionales(profesionales);
    setFilterError("");
  };

  const toggleFilter = (filter) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [filter]: !prevFilters[filter],
      };

      const isAnyFilterSelected = Object.values(updatedFilters).some(
        (selected) => selected
      );
      if (!isAnyFilterSelected) {
        updatedFilters.nombre = true;
      }

      return updatedFilters;
    });
  };

  if (loading) {
    return (
      <div className="text-center py-24">
        <p className="text-lg font-semibold text-gray-700">
          Cargando profesionales...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-lg font-semibold text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-full bg-cyan-500 relative isolate overflow-hidden sm:py-12">
        <img
          src={img2}
          alt="Centro Médico Integral"
          className="absolute inset-0 -z-10 w-full h-full sm:h-[540px] lg:h-[740px] md:h-[640px] object-cover object-center"
        />
        <div className="relative  p-10 py-14 shadow-lg rounded-lg mx-28 flex items-center justify-center my-1 sm:overflow-hidden sm:h-[470px] lg:h-[670px] md:h-570px]">
        <div className="max-w-xl">
              <h2 className="text-pretty text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                Nuestros Profesionales
              </h2>
              <p className="mt-16 text-xl font-medium text-gray-700">
                Conoce a los especialistas que forman parte de nuestro equipo. Estamos comprometidos a ofrecer la mejor atención médica.
              </p>
            </div>
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:px-8 sm:px-1">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-200 to-cyan-500 opacity-50 rounded-lg"></div>
          
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFilters.nombre}
                    onChange={() => toggleFilter("nombre")}
                  />
                  Nombre o Apellido
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFilters.obraSocial}
                    onChange={() => toggleFilter("obraSocial")}
                  />
                  Obra Social
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFilters.matricula}
                    onChange={() => toggleFilter("matricula")}
                  />
                  Matrícula
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFilters.especialidad}
                    onChange={() => toggleFilter("especialidad")}
                  />
                  Especialidad
                </label>
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="border p-2 rounded-md w-full"
                />
                <button
                  onClick={handleSearch}
                  className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
                >
                  Buscar
                </button>
                <button
                  onClick={clearSearch}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Limpiar
                </button>
              </div>
              {filterError && (
                <p className="text-red-500 text-sm mt-2">{filterError}</p>
              )}
            </div>
            <ul
              role="list"
              className="grid gap-x-8 gap-y-12 sm:grid-cols-4 sm:gap-y-1 xl:col-span-2 min-h-[500px] sm:min-h-[200px] "
            >
              {filteredProfesionales.map((profesional) => (
                <li key={profesional.id_profesional}>
                  <div className="flex items-center gap-x-6">
                    <img
                      className="h-16 w-16 rounded-full"
                      src={medico}
                      alt="medico-icono"
                    />
                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-gray-900">
                        {profesional.nombre} {profesional.apellido}
                      </h3>
                      <p className="text-sm font-semibold text-indigo-600">
                        {profesional.especialidad}
                      </p>
                      <p className="text-sm text-gray-600">
                        Matrícula: {profesional.numero_matricula}
                      </p>
                      <p className="text-sm font-semibold text-gray-700 mt-2">
                        Obra Social: {profesional.obrasSociales.join(", ")}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DirectorioProfesionales;
