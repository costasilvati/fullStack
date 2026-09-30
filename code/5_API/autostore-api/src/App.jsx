// src/App.jsx
import Header from './components/Header.jsx';
import FormBusca from './components/FormBusca.jsx';
import ListaResultados from './components/ListaResultados.jsx';
import FormCadastro from './components/FormCadastro.jsx';

function App() {
  return (
    <>
      <Header />
      <main className="container my-4">
        <FormBusca />
        <ListaResultados />
        <FormCadastro />
      </main>
    </>
  );
}

export default App;