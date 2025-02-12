import { useState, useEffect } from "react";
import { useRentCar } from "../context/RentCarContext";

export const TaskManager = () => {
  const {
    data,
    fetchData,
    loading,
    createData,
    deleteData,
    updateData,
    adding,
  } = useRentCar();
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    fetchData("Tasks");
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createData("Tasks", { Name: taskName, done: false }); // Esperamos que se complete la creación
      setTaskName(""); // Limpiamos el campo solo si la creación es exitosa
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData("Tasks", id); // Esperamos que se complete la eliminación
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

 

  const handleToggle = async (id, done) => {
    try {
      await updateData("Tasks", id, { done: !done });
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  return (
    <div>
      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="taskName"
          placeholder="Write a task"
          onChange={(e) => setTaskName(e.target.value)}
          value={taskName}
        />
        <button disabled={adding}>{adding ? "Adding..." : "Add"}</button>
      </form>

      {/* Lista de tareas */}
      {loading ? (
        <p>Loading...</p>
      ) : !data.Tasks || data.Tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <div>
          {data.Tasks.map((task) => (
            <div key={task.id}>
              <h1>{task.Name}</h1>
              <p>{JSON.stringify(task.done)}</p>
              <div>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
                <button
                  onClick={() => handleToggle(task.id, task.done)}
                >
                  Done
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
