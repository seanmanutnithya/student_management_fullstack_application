import { events } from "../assets/assets";
const EventsList = () => {
  return (
    <section className="card events-card">
      <div className="card-head">
        <h2 className="card-title">Upcoming events</h2>
      </div>
      <ul className="events-list" id="eventsList">
        {events.map((e, idx) => (
          <li className="event-item" key={idx}>
            <div className="event-date">
              <span className="event-date-day">{e.day}</span>
              <span className="event-date-month">{e.month}</span>
            </div>
            <div className="event-info">
              <div className="event-title">{e.title}</div>
              <div className="event-meta">{e.meta}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default EventsList;
