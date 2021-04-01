import React from 'react'
import Login from './components/Login';
import Dashboard from "./components/Dashboard";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ContactsProvider } from "./context/ContactsProvider";
import { ConversationsProvider } from "./context/ConversationsProvider";
import { SocketProvider } from "./context/SocketProvider";

function App() {
  const [id, setId] = useLocalStorage('id');
  const dashboard = (
      <SocketProvider id={id}>
          <ContactsProvider>
              <ConversationsProvider id={id}>
                  <Dashboard id={id} />
              </ConversationsProvider>
          </ContactsProvider>
      </SocketProvider>
  )

  return (
      <>
          {id ? dashboard : <Login onIdSubmit={setId} />}
      </>
  );
}

export default App;
