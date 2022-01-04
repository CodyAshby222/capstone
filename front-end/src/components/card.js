export default function Card({ img, name, msg }) {
  return (
    <div className="card">
      <img className="card-img blue-border" src={img} alt="rocket-icon" />
      <h3 className="text-center">{name}</h3>
      <h6 style={{ marginTop: 5 }} className="text-center">
        {msg}
      </h6>
    </div>
  );
}
