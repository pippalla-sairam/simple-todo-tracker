import { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "active", "completed"

  // Load todos from local storage when the app starts
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to local storage when they change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const toggleFinished = () => {
    setShowFinished((prev) => !prev);
  };

  const handleEdit = (id) => {
    let t = todos.find((i) => i.id === id);
    setTodo(t.todo);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    const updatedTodos = todos.filter((item) => item.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos)); // Save immediately
  };

  const handleAdd = () => {
    if (todo.trim().length <= 3) return;

    if (editingId) {
      // Edit existing todo
      const updatedTodos = todos.map((item) =>
        item.id === editingId ? { ...item, todo: todo.trim() } : item
      );
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos)); // Save immediately
      setEditingId(null);
    } else {
      // Add new todo
      const newTodos = [...todos, { id: uuidv4(), todo: todo.trim(), isCompleted: false }];
      setTodos(newTodos);
      localStorage.setItem("todos", JSON.stringify(newTodos)); // Save immediately
    }
    setTodo("");
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (id) => {
    const updatedTodos = todos.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos)); // Save immediately
  };

  // Filtered Todos
  const filteredTodos = useMemo(() => {
    return todos.filter((item) => {
      if (filter === "active") return !item.isCompleted;
      if (filter === "completed") return item.isCompleted;
      return true;
    });
  }, [todos, filter]);

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-3xl">
          iTask - Manage your todos at one place
        </h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{editingId ? "Edit Todo" : "Add a Todo"}</h2>
          <div className="flex">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              className="w-full rounded-full px-5 py-1"
            />
            <button
              onClick={handleAdd}
              disabled={todo.trim().length <= 3}
              className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
            >
              {editingId ? "Update" : "Save"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 my-4">
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`p-2 px-4 rounded-full font-bold ${
                filter === type ? "bg-violet-800 text-white" : "bg-gray-300"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <input
          className="my-4"
          id="show"
          onChange={toggleFinished}
          type="checkbox"
          checked={showFinished}
        />
        <label className="mx-2" htmlFor="show">
          Show Finished
        </label>

        <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>
        <h2 className="text-2xl font-bold">Your Todos</h2>

        <div className="todos">
          {filteredTodos.length === 0 && <div className="m-5">No Todos to display</div>}
          {filteredTodos.map((item) => (
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo flex my-3 justify-between">
                <div className="flex gap-5">
                  <input
                    name={item.id}
                    onChange={() => handleCheckbox(item.id)}
                    type="checkbox"
                    checked={item.isCompleted}
                  />
                  <div className={item.isCompleted ? "line-through" : ""}>
                    {item.todo}
                  </div>
                </div>
                <div className="buttons flex h-full">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                    aria-label="Edit Todo"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                    aria-label="Delete Todo"
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
