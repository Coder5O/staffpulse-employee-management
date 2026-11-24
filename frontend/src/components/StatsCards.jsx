import React from 'react';
import { Users, UserCheck, Clock, DollarSign } from 'lucide-react';

export default function StatsCards({ stats, loading }) {
  const cards = [
    {
      label: 'Total Employees',
      value: stats?.total ?? 0,
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Active Staff',
      value: stats?.active ?? 0,
      icon: UserCheck,
      color: 'green',
    },
    {
      label: 'On Leave',
      value: stats?.on_leave ?? 0,
      icon: Clock,
      color: 'amber',
    },
    {
      label: 'Average Salary',
      value: stats?.average_salary_formatted ?? '$0.00',
      icon: DollarSign,
      color: 'purple',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div key={idx} className="stat-card">
            <div className={`stat-icon ${card.color}`}>
              <IconComponent size={22} />
            </div>
            <div>
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">
                {loading ? '...' : card.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
