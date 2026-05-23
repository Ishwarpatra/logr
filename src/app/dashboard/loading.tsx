// Brand skeleton shown while the dashboard loads.
export default function Loading() {
  return (
    <div className="mo">
      <div className="mo-page mo-page--wide">
        <div className="sk-hero" style={{ marginBottom: 28 }}>
          <span className="sk sk--circle sk-hero__avatar" />
          <div className="sk-hero__copy">
            <span className="sk sk-hero__name" />
            <span className="sk sk-hero__sub" />
          </div>
        </div>
        <div className="sk-tabs" style={{ marginBottom: 32 }}>
          <span className="sk" /><span className="sk" /><span className="sk" />
        </div>
        <div className="sk-card">
          <div className="sk-card__head">
            <span className="sk" />
            <span className="sk-mark"><span className="a" /><span className="b" /></span>
          </div>
          <div className="sk-card__row">
            <div className="sk-card__field"><span className="sk l" /><span className="sk i" /></div>
            <div className="sk-card__field"><span className="sk l" /><span className="sk i" /></div>
          </div>
          <div className="sk-card__row">
            <div className="sk-card__field"><span className="sk l" /><span className="sk i" /></div>
            <div className="sk-card__field"><span className="sk l" /><span className="sk i" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
