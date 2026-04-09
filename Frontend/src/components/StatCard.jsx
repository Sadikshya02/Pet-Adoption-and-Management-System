// components/StatCard.jsx
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon, link }) => {
  return (
    <Link
      to={link}
      className="flex items-center gap-4 rounded-xl border border-orange-100 bg-orange-50 p-5 shadow-sm hover:shadow-md transition hover:scale-[1.02]"
    >
      <div className="text-3xl">{icon}</div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold text-orange-600">
          {value}
        </h2>
      </div>
    </Link>
  );
};

export default StatCard;
