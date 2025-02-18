import { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../supabase/client";

export const RentCarContext = createContext();

export const RentCarContextProvider = ({ children }) => {
  const [data, setData] = useState({}); // Guarda datos de diferentes tablas
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // 🔹 Función genérica para obtener datos de cualquier tabla
  const fetchData = useCallback(async (table, relations = "") => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: result, error } = await supabase
        .from(table)
        .select(`*${relations ? `, ${relations}` : ""}`)
        .eq("userId", user.id);
      if (error) throw error;

      setData((prevData) => ({ ...prevData, [table]: result }));
    } catch (err) {
      console.error(`Error al obtener datos de ${table}:`, err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Función genérica para insertar datos en cualquier tabla
  const createData = async (table, newData) => {
    setLoading(true);
    setAdding(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: insertedData, error } = await supabase
        .from(table)
        .insert({ ...newData, userId: user.id })
        .select();

      if (error) throw error;

      setData((prevData) => ({
        ...prevData,
        [table]: [...(prevData[table] || []), ...insertedData],
      }));
    } catch (error) {
      console.error(`Error al insertar datos en ${table}:`, error.message);
    } finally {
      setLoading(false);
      setAdding(false);
    }
  };

  // 🔹 Función genérica para actualizar datos en cualquier tabla
  const updateData = async (table, id, updateFields) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: updatedData, error } = await supabase
        .from(table)
        .update(updateFields)
        .eq("userId", user.id)
        .eq("id", id)
        .select();

      if (error) throw error;

      setData((prevData) => ({
        ...prevData,
        [table]: prevData[table].map((item) =>
          item.id === id ? { ...item, ...updateFields } : item
        ),
      }));
    } catch (error) {
      console.error(`Error al actualizar datos en ${table}:`, error.message);
    }
  };

  // 🔹 Función genérica para eliminar datos de cualquier tabla
  const deleteData = async (table, id) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("userId", user.id)
        .eq("id", id);

      if (error) throw error;

      setData((prevData) => ({
        ...prevData,
        [table]: prevData[table].filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error(`Error al eliminar datos en ${table}:`, error.message);
    }
  };

  return (
    <RentCarContext.Provider
      value={{
        data,
        fetchData,
        createData,
        updateData,
        deleteData,
        loading,
        adding,
      }}
    >
      {children}
    </RentCarContext.Provider>
  );
};

export const useRentCar = () => useContext(RentCarContext);
