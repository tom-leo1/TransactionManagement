import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./rtk/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);



// Cache Lifecycle methods

// onQuerystarted
// oncacheentryadded
// these are useful for optimistic updates
  






