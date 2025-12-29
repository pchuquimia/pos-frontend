import React, { useEffect, useState } from "react";
import restaurant from "../assets/images/restaurant-img.jpg";
import logo from "../assets/images/logo.png";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";

const Auth = () => {
  useEffect(() => {
    document.title = "POS | Acceso";
  }, []);

  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF]">
      <div className="flex min-h-screen flex-col xl:flex-row">
        {/* Visual Section */}
        <section className="relative flex h-72 w-full overflow-hidden md:h-96 lg:h-[420px] xl:h-auto xl:w-1/2 xl:items-center xl:justify-center">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={restaurant}
            alt="Restaurant Image"
          />
          <div className="absolute inset-0 bg-black/70 xl:bg-black/80" />

          <div className="relative flex h-full flex-col justify-end gap-4 px-6 py-10 sm:px-10 lg:justify-center lg:py-16 xl:items-start xl:justify-end">
            <blockquote className="max-w-xl text-base font-medium italic text-white sm:text-lg lg:text-2xl">
              "Ofrece platos deliciosos acompanados de atencion cordial y un entorno agradable, y los clientes elegiran regresar una y otra vez."
              <span className="mt-4 block text-sm font-semibold text-yellow-400 sm:text-base">
                - Pablo Chuquimia
              </span>
            </blockquote>
          </div>
        </section>

        {/* Form Section */}
        <section className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:w-1/2 xl:px-16 xl:py-16">
          <div className="w-full max-w-md rounded-2xl bg-white/80 xl:rounded-none backdrop-blur-sm shadow-none ring-1 ring-black/5 px-6 py-8 sm:px-8 md:max-w-lg lg:max-w-xl xl:max-w-none xl:bg-transparent xl:px-0 xl:py-0 xl:ring-0">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex items-center justify-center rounded-full border-2 border-gray-700 bg-black p-3">
                <img
                  src={logo}
                  alt="A pedir de boca"
                  className="h-10 w-10"
                />
              </div>
              <h1 className="text-xl font-semibold tracking-wide text-[#212529] sm:text-2xl">
                A pedir de boca
              </h1>
            </div>

            <h2 className="mt-8 text-center text-3xl font-semibold text-[#212529] sm:mt-10 sm:text-4xl">
              {isRegister ? "Registro" : "Inicio de Sesion"}
            </h2>

            <div className="mt-8 sm:mt-10">
              {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}
            </div>

            <div className="mt-6 flex justify-center">
              <p className="text-sm text-[#212529]">
                {isRegister ? "Ya tienes una cuenta?" : "No tienes una cuenta?"}
                <a
                  onClick={() => setIsRegister(!isRegister)}
                  className="font-semibold text-yellow-400 hover:underline"
                  href="#"
                >
                  {isRegister ? " Iniciar Sesion" : " Registrarse"}
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Auth;
