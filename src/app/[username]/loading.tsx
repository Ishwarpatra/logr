// Brand skeleton shown while the profile page streams in.
export default function Loading() {
  return (
    <div className="mo">
      <div className="mo-page mo-page--mid">
        {/* profile card */}
        <div style={{ border: "0.5px solid var(--rule)", borderRadius: 12, padding: 22, marginTop: 28, marginBottom: 40 }}>
          <div className="sk-hero">
            <span className="sk sk--circle sk-hero__avatar" />
            <div className="sk-hero__copy">
              <span className="sk sk-hero__name" />
              <span className="sk sk-hero__sub" />
            </div>
          </div>
        </div>
        {/* timeline entries */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {[0, 1, 2, 3].map((i) => (
            <div className="sk-entry" key={i}>
              <div className="sk-entry__date"><span className="sk sk--line" style={{ width: "70%", height: 10 }} /></div>
              <div className="sk-entry__body">
                <span className="sk-entry__dot" style={i === 0 ? undefined : { background: "var(--ink)", opacity: 0.5 - i * 0.1 }} />
                <span className="sk sk-entry__title" />
                {i < 2 && <span className="sk sk-entry__b1" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
