
import DashboardPage from "./pages/DashboardPage";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <DashboardPage></DashboardPage>
      <ToastContainer position="top-right" />
      </BrowserRouter>
    </Provider>
    
    
  );
}

export default App;



