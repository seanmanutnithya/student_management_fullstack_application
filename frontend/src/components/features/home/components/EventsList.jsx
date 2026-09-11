import { events } from "@/assets/data/stats";
import { Card } from "@/components/ui";
const EventsList = () => {
  return (
    <Card className="events-card" title="Upcoming events">
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
    </Card>
  );
};

export default EventsList;
