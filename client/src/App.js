import { useState } from "react";
import "./App.css";
import DataTable from "./components/DataTable";
import FormDialog from "./components/FormDialog";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isUserAdded, setUserAdded] = useState(false);

  return (
    <div className="App">
      <FormDialog handleUserAdded={setUserAdded} />
      <DataTable isUserAdded={isUserAdded} handleUserAdded={setUserAdded} />
      <ToastContainer />
    </div>
  );
}

export default App;
