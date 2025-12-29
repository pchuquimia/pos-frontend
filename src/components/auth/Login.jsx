import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate(formData);
  };

  const loginMutation = useMutation({
    mutationFn: (reqData) => login(reqData),
    onSuccess: (res) => {
      const { data } = res;
      const { _id, name, email, phone, role } = data.data;
      dispatch(setUser({ _id, name, email, phone, role }));

      if (role === "Administrador") {
        navigate("/dashboard");
      } else if (role === "Cocina") {
        navigate("/orders");
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      const { response } = error;
      enqueueSnackbar(response.data.message, { variant: "error" });
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-[#212729] mb-2 mt-3 text-sm font-medium">
            Email de usuario
          </label>
          <div className="flex item-center rounded-lg p-5 px-4 bg-[#F8F9FA]">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingrese su email"
              className="bg-transparent flex-1 text-[#6C757D] focus:outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-[#212729] mb-2 mt-3 text-sm font-bold">
            Contrasena
          </label>
          <div className="flex item-center rounded-lg p-5 px-4 bg-[#F8F9FA]">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingrese su contrasena"
              className="bg-transparent flex-1 text-[#212729] focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold"
        >
          Inicio de Sesion
        </button>
      </form>
    </div>
  );
};

export default Login;
