import Editor from "./components/Editor";
import { Provider } from "react-redux";
import { store } from "./store";

export default function App() {
  return (
    <Provider store={store}>
      <Editor />
    </Provider>
  );
}
