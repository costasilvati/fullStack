// src/components/FormBusca.jsx
import { useState } from 'react';
import { useVeiculos } from '../contexts/VeiculosContext.jsx';

function validarBusca({ termo, limite }) {
  const erros = {};
  if (termo.trim() === '') {
    erros.termo = 'Informe um termo para a busca.';
  } else if (termo.trim().length < 2) {
    erros.termo = 'Digite pelo menos 2 caracteres.';
  }
  if (!Number.isInteger(limite) || limite < 1 || limite > 30) {
    erros.limite = 'Escolha entre 1 e 30 resultados.';
  }
  return erros;
}

function FormBusca() {
  const { buscarVeiculos, carregando } = useVeiculos();

  const [termo, setTermo] = useState('');
  const [ordenacao, setOrdenacao] = useState('');   // ex.: "price:asc"
  const [limite, setLimite] = useState(10);
  const [erros, setErros] = useState({});

  function handleSubmit(evento) {
    evento.preventDefault();                          // impede o recarregamento da página (SPA!)

    const errosEncontrados = validarBusca({ termo, limite });
    setErros(errosEncontrados);
    if (Object.keys(errosEncontrados).length > 0) return;   // não envia se houver erro

    const [ordenarPor, ordem] = ordenacao ? ordenacao.split(':') : ['', ''];
    buscarVeiculos({ termo: termo.trim(), ordenarPor, ordem, limite });
  }

  return (
    <form className="row g-3 align-items-start" onSubmit={handleSubmit} noValidate>
      <div className="col-md-5">
        <label htmlFor="termo" className="form-label">Termo de busca *</label>
        <input
          id="termo"
          type="text"
          className={`form-control ${erros.termo ? 'is-invalid' : ''}`}
          placeholder="ex.: car, motorcycle, electric"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />
        {erros.termo && <div className="invalid-feedback">{erros.termo}</div>}
      </div>

      <div className="col-md-3">
        <label htmlFor="ordenacao" className="form-label">Ordenar por</label>
        <select
          id="ordenacao"
          className="form-select"
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
        >
          <option value="">Relevância</option>
          <option value="price:asc">Menor preço</option>
          <option value="price:desc">Maior preço</option>
          <option value="title:asc">Nome (A–Z)</option>
        </select>
      </div>

      <div className="col-md-2">
        <label htmlFor="limite" className="form-label">Resultados</label>
        <input
          id="limite"
          type="number"
          min="1"
          max="30"
          className={`form-control ${erros.limite ? 'is-invalid' : ''}`}
          value={limite}
          onChange={(e) => setLimite(Number(e.target.value))}
        />
        {erros.limite && <div className="invalid-feedback">{erros.limite}</div>}
      </div>

      <div className="col-md-2 d-grid">
        <label className="form-label invisible">Buscar</label>
        <button type="submit" className="btn btn-primary" disabled={carregando}>
          {carregando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
    </form>
  );
}

export default FormBusca;