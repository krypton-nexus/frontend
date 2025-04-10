import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Legend,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// Refined color palette for the charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28FD0",
  "#F08080",
  "#8FBC8F",
];

// Utility function to group data by a given key (e.g., "year", "faculty", or "courseName")
const groupData = (data, key) => {
  return Object.values(
    data.reduce((acc, member) => {
      const group = member[key] || "Unknown";
      if (!acc[group]) {
        acc[group] = { name: group, value: 0 };
      }
      acc[group].value++;
      return acc;
    }, {})
  );
};

// ------------------ Basic Visualizations ------------------

// Donut chart for distribution by year with custom labels showing percentages and "year" prefix
const YearDonutChart = ({ data, title }) => {
  const groupedData = groupData(data, "year");
  if (!groupedData || groupedData.length === 0) return null;

  // Calculate total for percentage calculation
  const total = groupedData.reduce((sum, item) => sum + item.value, 0);
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const item = groupedData[index];
    const percentage = ((item.value / total) * 100).toFixed(0);
    return (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: "12px" }}
      >
        {`year ${item.name}: ${percentage}%`}
      </text>
    );
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ marginBottom: "0.5rem", color: "#333" }}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={groupedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40} // Creates the donut effect
            fill="#8884d8"
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {groupedData.map((entry, index) => (
              <Cell
                key={`cell-year-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => {
              const percentage = ((value / total) * 100).toFixed(0);
              return [`${percentage}% (${value})`, `year ${name}`];
            }}
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => `year ${value}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Bar chart for distribution by course
const CourseBarChart = ({ data, title }) => {
  const groupedData = groupData(data, "courseName");
  if (!groupedData || groupedData.length === 0) return null;
  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ marginBottom: "0.5rem", color: "#333" }}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={groupedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d">
            {groupedData.map((entry, index) => (
              <Cell
                key={`cell-course-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ------------------ Additional Visualizations ------------------

// Membership Growth Trend Chart (Line Chart)
const MembershipGrowthChart = ({ newRequests, approvedMembers }) => {
  const allMembers = [...newRequests, ...approvedMembers];
  const growthDataMap = {};
  allMembers.forEach((member) => {
    // Use the member's "year" field (if available)
    const year = member.year || "Unknown";
    growthDataMap[year] = (growthDataMap[year] || 0) + 1;
  });
  const growthData = Object.entries(growthDataMap)
    .map(([year, count]) => ({ year, count }))
    // Sort numerically when possible; "Unknown" will appear at the end.
    .sort((a, b) => (isNaN(a.year) || isNaN(b.year) ? 0 : a.year - b.year));
  if (growthData.length === 0) return null;
  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ marginBottom: "0.5rem", color: "#333" }}>
        Membership Growth Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={growthData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Faculty Distribution Chart (Donut Chart)
const FacultyDonutChart = ({ members }) => {
  const data = groupData(members, "faculty");
  if (data.length === 0) return null;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const renderLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, index } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    const item = data[index];
    const percentage = ((item.value / total) * 100).toFixed(0);
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fill="#000"
      >
        {`Faculty ${item.name}: ${percentage}%`}
      </text>
    );
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ marginBottom: "0.5rem", color: "#333" }}>
        Faculty Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            label={renderLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-faculty-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            formatter={(value) => `Faculty ${value}`}
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Notifications Breakdown Chart (Donut Chart)
const NotificationsDonutChart = ({ notifications }) => {
  const data = [
    {
      name: "Read",
      value: notifications.filter((n) => n.is_read === 1).length,
    },
    {
      name: "Unread",
      value: notifications.filter((n) => n.is_read === 0).length,
    },
  ];
  if (data.every((item) => item.value === 0)) return null;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const renderLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, index } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    const item = data[index];
    const percentage = ((item.value / total) * 100).toFixed(0);
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fill="#000"
      >
        {`Notification ${item.name}: ${percentage}%`}
      </text>
    );
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ marginBottom: "0.5rem", color: "#333" }}>
        Notifications Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            label={renderLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-notif-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            formatter={(value) => `Notification ${value}`}
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// ---------------- Container Component: MemberAnalysisCharts ----------------
// This component renders all visualizations in a single horizontal line (small grid format) using a grid with auto-flow column.
const MemberAnalysisCharts = ({
  data,
  titlePrefix,
  newRequests,
  approvedMembers,
  notifications,
}) => {
  // Create a single container that flows items as columns in one row.
  return (
    <div>
      {/* Basic Analysis Section: arranged in a horizontal grid */}
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(300px, 1fr)",
          gap: "20px",
          marginTop: "1rem",
          width: "100%",
        }}
      >
        <YearDonutChart data={data} title={`${titlePrefix} Members by Year`} />
        <CourseBarChart
          data={data}
          title={`${titlePrefix} Members by Course`}
        />
      </div>

      {/* Additional Visualizations Section (if additional props provided) in a single horizontal line */}
      {newRequests && approvedMembers && notifications && (
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "minmax(300px, 1fr)",
            gap: "20px",
            marginTop: "2rem",
            width: "100%",
            }}
        >
          <MembershipGrowthChart
            newRequests={newRequests}
            approvedMembers={approvedMembers}
          />
          <FacultyDonutChart members={data} />
          <NotificationsDonutChart notifications={notifications} />
        </div>
      )}
    </div>
  );
};

export default MemberAnalysisCharts;
