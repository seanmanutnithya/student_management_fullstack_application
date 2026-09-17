import { GraduationCap } from "lucide-react";

const AuthBanner = () => {
  return (
    <aside className="auth-visual">
      <div className="auth-visual-top">
        <div className="brand-icon">
          <GraduationCap />
        </div>
        <span className="brand-name brand-name--light">ia Academy</span>
      </div>

      <div className="auth-visual-body">
        <h2>Manage your school, effortlessly.</h2>
        <p>
          One dashboard for students, teachers, attendance, exams and more built
          for administrators and teaching staff.
        </p>
      </div>

      <div className="auth-visual-card" id="visualCard">
        <div className="auth-visual-card-head">
          <img
            src="https://i.pravatar.cc/64?img=47"
            alt=""
            className="user-avatar"
          />
          <div>
            <div className="student-name">Priscilla Lily</div>
            <div className="user-role">Admin · Online</div>
          </div>
        </div>
        <div className="auth-visual-stat-row">
          <div className="auth-visual-stat">
            <span className="stat-value">1,248</span>
            <span className="stat-label">Students</span>
          </div>
          <div className="auth-visual-stat">
            <span className="stat-value">86</span>
            <span className="stat-label">Teachers</span>
          </div>
          <div className="auth-visual-stat">
            <span className="stat-value">97%</span>
            <span className="stat-label">Attendance</span>
          </div>
        </div>
      </div>

      <div className="auth-visual-dots" aria-hidden="true">
        <span></span>
        <span className="is-active"></span>
      </div>
    </aside>
  );
};

export default AuthBanner;
