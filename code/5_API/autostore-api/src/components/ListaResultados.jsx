// src/components/ListaResultados.jsx
import { useEffect } from 'react';
import { useVeiculos } from '../contexts/VeiculosContext.jsx';
import CardVeiculo from './CardVeiculo.jsx';

function ListaResultados() {
  const { produtos, total, carregando, erro, ultimaBusca, carregarVeiculos } = useVeiculos();

  // Carga inicial: executa uma vez, quando o componente aparece
  useEffect(() => {
    const controlador = new AbortController();
    carregarVeiculos(controlador.signal);
    return () => controlador.abort();
  }, [carregarVeiculos]);

  // Estado 1 — carregando
  if (carregando) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status" aria-label="Carregando" />
      </div>
    );
  }

  // Estado 2 — erro (mensagem vinda DEPOIS do envio: HTTP ou rede)
  if (erro) {
    return (
      <div className="alert alert-danger my-4" role="alert">
        <strong>Não foi possível concluir a busca.</strong> {erro}
      </div>
    );
  }

  // Estado 3 — vazio
  if (produtos.length === 0) {
    return (
      <div className="alert alert-warning my-4">
        Nenhum veículo encontrado{ultimaBusca ? ` para "${ultimaBusca}"` : ''}.
      </div>
    );
  }

  // Estado 4 — sucesso
  return (
    <section className="my-4">
      <p className="text-muted">
        {ultimaBusca
          ? `Exibindo ${produtos.length} de ${total} resultado(s) para "${ultimaBusca}".`
          : `Destaques da categoria veículos (${total} no total).`}
      </p>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
        {produtos.map((veiculo) => (
          <div className="col" key={veiculo.id}>
            <CardVeiculo veiculo={veiculo} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ListaResultados;