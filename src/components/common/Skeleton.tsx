export function CardSkeletons({ n = 5 }: { n?: number }) {
  return (
    <div className="hscroll" aria-busy="true">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="card">
          <div className="skeleton" style={{ width: 148, height: 148 }} />
          <div className="skeleton" style={{ height: 12, width: "80%", marginTop: 10 }} />
          <div className="skeleton" style={{ height: 10, width: "50%", marginTop: 6 }} />
        </div>
      ))}
    </div>
  );
}

export function RowSkeletons({ n = 6 }: { n?: number }) {
  return (
    <div className="rows" aria-busy="true">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="row">
          <div className="skeleton" style={{ width: 52, height: 52 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 12, width: "60%" }} />
            <div className="skeleton" style={{ height: 10, width: "35%", marginTop: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
