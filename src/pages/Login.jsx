import { useState, useEffect } from "react";
import { supabase } from "../supabase/client.js";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await supabase.auth.signInWithOtp({
        email,
      });
      toast.success("Revisa tu correo!");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!supabase.auth.getUser()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <ToastContainer />

      <div className="Login">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="">
          <input
            type="email"
            name="email"
            className="form-control w-100 mb-4"
            placeholder="email@site.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-outline-success w-100 boton">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};
