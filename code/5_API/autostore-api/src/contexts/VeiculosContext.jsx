// src/contexts/VeiculosContext.jsx
import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

// (1) URL base vinda do .env, com um valor padrão
const API_URL = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com';

// (2) Somente os campos que a interface usa (menos dados trafegando)
const CAMPOS = 'id,title,brand,price,category,thumbnail';

// (3) Função genérica de requisição: trata JSON, erros HTTP e erros de rede
async function requisicao(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      // Content-Type só quando há corpo (evita preflight desnecessário no GET)
      headers: opcoes.body ? { 'Content-Type': 'application/json' } : undefined,
    });
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro;
    throw new Error('Não foi possível conectar à API. Verifique sua conexão.');
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(dados?.message ?? `A API respondeu com erro ${resposta.status}.`);
  }
  return dados;
}

// (4) Estado inicial e reducer
const estadoInicial = {
  produtos: [],
  total: 0,
  carregando: false,
  erro: null,
  ultimaBusca: null, // termo da última busca realizada (null = carga inicial)
};

function veiculosReducer(estado, acao) {
  switch (acao.type) {
    case 'BUSCA_INICIOU':
      return { ...estado, carregando: true, erro: null };
    case 'BUSCA_SUCESSO':
      return {
        ...estado,
        carregando: false,
        produtos: acao.produtos,
        total: acao.total,
        ultimaBusca: acao.termo,
      };
    case 'BUSCA_ERRO':
      return { ...estado, carregando: false, erro: acao.erro, produtos: [], total: 0 };
    case 'VEICULO_ADICIONADO':
      return {
        ...estado,
        produtos: [acao.veiculo, ...estado.produtos],
        total: estado.total + 1,
      };
    default:
      throw new Error(`Ação desconhecida: ${acao.type}`);
  }
}

// (5) Criação do contexto
const VeiculosContext = createContext(null);

// (6) Provider: guarda o estado e expõe as operações
export function VeiculosProvider({ children }) {
  const [estado, dispatch] = useReducer(veiculosReducer, estadoInicial);

  // GET /products/category/vehicle — carga inicial
  const carregarVeiculos = useCallback(async (signal) => {
    dispatch({ type: 'BUSCA_INICIOU' });
    try {
      const params = new URLSearchParams({ limit: 12, select: CAMPOS });
      const dados = await requisicao(`/products/category/vehicle?${params}`, { signal });
      dispatch({ type: 'BUSCA_SUCESSO', produtos: dados.products, total: dados.total, termo: null });
    } catch (erro) {
      if (erro.name !== 'AbortError') dispatch({ type: 'BUSCA_ERRO', erro: erro.message });
    }
  }, []);

  // GET /products/search?q=...&sortBy=...&order=...&limit=... — busca com parâmetros
  const buscarVeiculos = useCallback(async ({ termo, ordenarPor, ordem, limite }) => {
    dispatch({ type: 'BUSCA_INICIOU' });
    try {
      const params = new URLSearchParams({ q: termo, limit: limite, select: CAMPOS });
      if (ordenarPor) {
        params.append('sortBy', ordenarPor);
        params.append('order', ordem);
      }
      const dados = await requisicao(`/products/search?${params}`);
      dispatch({ type: 'BUSCA_SUCESSO', produtos: dados.products, total: dados.total, termo });
    } catch (erro) {
      dispatch({ type: 'BUSCA_ERRO', erro: erro.message });
    }
  }, []);

  // GET /products/category-list — opções do <select> de categoria
  const listarCategorias = useCallback(
    (signal) => requisicao('/products/category-list', { signal }),
    [],
  );

  // POST /products/add — envia JSON e devolve o objeto criado
  const cadastrarVeiculo = useCallback(async (veiculo) => {
    const criado = await requisicao('/products/add', {
      method: 'POST',
      body: JSON.stringify(veiculo),
    });
    dispatch({ type: 'VEICULO_ADICIONADO', veiculo: criado });
    return criado; // o formulário usa o retorno para a mensagem de sucesso
  }, []);

  // (7) useMemo evita recriar o objeto a cada renderização do Provider
  const valor = useMemo(
    () => ({ ...estado, carregarVeiculos, buscarVeiculos, listarCategorias, cadastrarVeiculo }),
    [estado, carregarVeiculos, buscarVeiculos, listarCategorias, cadastrarVeiculo],
  );

  return <VeiculosContext.Provider value={valor}>{children}</VeiculosContext.Provider>;
}

// (8) Hook personalizado para consumir o contexto com segurança
// eslint-disable-next-line react-refresh/only-export-components
export function useVeiculos() {
  const contexto = useContext(VeiculosContext);
  if (!contexto) {
    throw new Error('useVeiculos deve ser usado dentro de <VeiculosProvider>.');
  }
  return contexto;
}