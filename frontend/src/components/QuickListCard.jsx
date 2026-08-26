import { sections } from "../assets/quickListCardAssets";

const QuickList = ({ icon: Icon, title, data, id }) => {
  return (
    <div className="card quicklist-card" id={id}>
      <h3 className="quicklist-title" key={id}>
        <Icon />
        {title}
      </h3>

      <ul className="quicklist" id="absenteesList">
        {data.map((d, idx) => (
          <li className="quicklist-item" key={idx}>
            <img
              className="quicklist-avatar"
              src={`https://i.pravatar.cc/64?img=${d.avatar}`}
              alt=""
            />
            <div className="quicklist-info">
              <div className="quicklist-name">{d.name}</div>
              <div className="quicklist-meta">{d.meta}</div>
            </div>
            <span className={`quicklist-tag quicklist-tag--${d.tagType}`}>
              {d.tag}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
const QuickListCard = () => {
  return (
    <section className="quicklist-row">
      {sections.map((s, idx) => (
        <QuickList icon={s.icon} title={s.title} data={s.data} id={s.id} />
      ))}
    </section>
  );
};

export default QuickListCard;
