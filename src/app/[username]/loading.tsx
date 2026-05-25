export default function Loading() {
  return (
    <div className="mo" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="mo-descent" aria-label="loading">
        <span className="dd dd--1" />
        <span className="row row--1">
          <span className="sk sk--date" />
          <span className="sk sk--title" />
          <span className="sk sk--line sk--line-a" />
          <span className="sk sk--line sk--line-b" />
        </span>

        <span className="dd dd--2" />
        <span className="row row--2">
          <span className="sk sk--date" />
          <span className="sk sk--title" />
          <span className="sk sk--line sk--line-a" />
          <span className="sk sk--line sk--line-b" />
          <span className="sk sk--line sk--line-c" />
        </span>

        <span className="dd dd--3" />
        <span className="row row--3">
          <span className="sk sk--date" />
          <span className="sk sk--title" />
          <span className="sk sk--line sk--line-a" />
        </span>

        <span className="mo-descent__label">loading</span>
      </div>
    </div>
  );
}
