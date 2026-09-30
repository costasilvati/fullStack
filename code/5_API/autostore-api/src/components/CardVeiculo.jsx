// src/components/CardVeiculo.jsx
const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' });

function CardVeiculo({ veiculo }) {
  return (
    <div className="card h-100">
      {veiculo.thumbnail && (
        <img src={veiculo.thumbnail} className="card-img-top" alt={veiculo.title} />
      )}
      <div className="card-body">
        <h5 className="card-title">{veiculo.title}</h5>
        {veiculo.brand && <p className="card-subtitle text-muted mb-2">{veiculo.brand}</p>}
        <p className="card-text fw-bold">{formatoMoeda.format(veiculo.price ?? 0)}</p>
        <span className="badge bg-secondary">{veiculo.category}</span>
      </div>
    </div>
  );
}

export default CardVeiculo;