import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { seedProfile } from "@/assets/data/accountSeed";

const PageHead = () => (
  <div className="page-head">
    <div>
      <h1 className="page-title">Account</h1>
      <p className="breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight />
        <span className="is-current">Account</span>
      </p>
    </div>
    <p className="account-head-meta">
      Signed in as <strong>{seedProfile.email}</strong>
    </p>
  </div>
);

export default PageHead;
