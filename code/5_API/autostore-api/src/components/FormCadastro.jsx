// src/components/FormCadastro.jsx
import { useEffect, useState } from 'react';
import { useVeiculos } from '../contexts/VeiculosContext.jsx';

const VAZIO = { title: '', brand: '', price: '', category: 'vehicle' };

function validarCadastro(dados) {
  const erros = {};
  if (dados.title.trim().length < 3) erros.title = 'O modelo deve ter pelo menos 3 caracteres.';
  if (dados.brand.trim() === '') erros.brand = 'Informe a marca.';
  const preco = Number(dados.price);
  if (dados.price === '' || Number.isNaN(preco) || preco <= 0) {
    erros.price = 'Informe um preço maior que zero.';
  }
  if (!dados.category) erros.category = 'Selecione uma categoria.';
  return erros;
}

function FormCadastro() {
  const { cadastrarVeiculo, listarCategorias } = useVeiculos();

  const [dados, setDados] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);   // erro DEPOIS do envio
  const [sucesso, setSucesso] = useState(null);

  // GET das categorias quando o formulário aparece
  useEffect(() => {
    const controlador = new AbortController();
    listarCategorias(controlador.signal)
      .then(setCategorias)
      .catch((e) => {
        if (e.name !== 'AbortError') setErroEnvio(`Categorias indisponíveis: ${e.message}`);
      });
    return () => controlador.abort();
  }, [listarCategorias]);

  // Um único handler para todos os campos, usando o atributo "name"
  function handleChange(evento) {
    const { name, value } = evento.target;
    setDados((anterior) => ({ ...anterior, [name]: value }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setSucesso(null);
    setErroEnvio(null);

    // 1. Validação ANTES do envio
    const errosEncontrados = validarCadastro(dados);
    setErros(errosEncontrados);
    if (Object.keys(errosEncontrados).length > 0) return;

    // 2. Envio (POST com JSON)
    setEnviando(true);
    try {
      const criado = await cadastrarVeiculo({
        title: dados.title.trim(),
        brand: dados.brand.trim(),
        price: Number(dados.price),          // envia número, não string
        category: dados.category,
      });
      // 3a. Sucesso DEPOIS do envio
      setSucesso(`Veículo "${criado.title}" cadastrado com o id ${criado.id}.`);
      setDados(VAZIO);
    } catch (erro) {
      // 3b. Erro DEPOIS do envio (resposta 4xx/5xx ou falha de rede)
      setErroEnvio(erro.message);
    } finally {
      setEnviando(false);
    }
  }

  // Função auxiliar para não repetir as classes de validação
  const classe = (campo, base = 'form-control') => `${base} ${erros[campo] ? 'is-invalid' : ''}`;

  return (
    <form className="card card-body my-4" onSubmit={handleSubmit} noValidate>
      <h2 className="h5">Cadastrar veículo</h2>

      {sucesso && <div className="alert alert-success">{sucesso}</div>}
      {erroEnvio && <div className="alert alert-danger">{erroEnvio}</div>}

      <div className="row g-3">
        <div className="col-md-4">
          <label htmlFor="title" className="form-label">Modelo *</label>
          <input id="title" name="title" className={classe('title')}
                 value={dados.title} onChange={handleChange} />
          {erros.title && <div className="invalid-feedback">{erros.title}</div>}
        </div>

        <div className="col-md-3">
          <label htmlFor="brand" className="form-label">Marca *</label>
          <input id="brand" name="brand" className={classe('brand')}
                 value={dados.brand} onChange={handleChange} />
          {erros.brand && <div className="invalid-feedback">{erros.brand}</div>}
        </div>

        <div className="col-md-2">
          <label htmlFor="price" className="form-label">Preço (US$) *</label>
          <input id="price" name="price" type="number" min="0" step="0.01"
                 className={classe('price')} value={dados.price} onChange={handleChange} />
          {erros.price && <div className="invalid-feedback">{erros.price}</div>}
        </div>

        <div className="col-md-3">
          <label htmlFor="category" className="form-label">Categoria *</label>
          <select id="category" name="category" className={classe('category', 'form-select')}
                  value={dados.category} onChange={handleChange}>
            <option value="">Selecione...</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {erros.category && <div className="invalid-feedback">{erros.category}</div>}
        </div>
      </div>

      <button type="submit" className="btn btn-success mt-3 align-self-start" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Cadastrar'}
      </button>
    </form>
  );
}

export default FormCadastro;