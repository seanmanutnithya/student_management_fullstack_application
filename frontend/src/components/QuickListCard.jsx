const QuickListCard = () => {
  return (
    <section className="quicklist-row">
      <div className="card quicklist-card">
        <h3 className="quicklist-title">
          <i data-lucide="user-x"></i>Top absentees this week
        </h3>
        <ul className="quicklist" id="absenteesList"></ul>
      </div>
      <div className="card quicklist-card">
        <h3 className="quicklist-title">
          <i data-lucide="circle-dollar-sign"></i>Fee defaulters
        </h3>
        <ul className="quicklist" id="defaultersList"></ul>
      </div>
      <div className="card quicklist-card">
        <h3 className="quicklist-title">
          <i data-lucide="cake"></i>Birthdays this month
        </h3>
        <ul className="quicklist" id="birthdaysList"></ul>
      </div>
    </section>
  );
};

export default QuickListCard;
