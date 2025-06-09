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
import { Box, Typography } from "@mui/material";

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

// Donut chart for distribution by year with custom labels showing percentages and "Year" prefix
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
        fill="#333"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: "11px", fontWeight: 500 }}
      >
        {`${item.name}: ${percentage}%`}
      </text>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ mb: 1, fontWeight: 600, color: "#444" }}
      >
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={groupedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={45} // Smaller inner radius for more “donut” thickness
            fill="#8884d8"
            label={renderCustomizedLabel}
            labelLine={false}
            paddingAngle={2}
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
              return [`${percentage}% (${value})`, `Year ${name}`];
            }}
            contentStyle={{
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={30}
            iconType="circle"
            formatter={(value) => `Year ${value}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

// Bar chart for distribution by course
const CourseBarChart = ({ data, title }) => {
  const groupedData = groupData(data, "courseName");
  if (!groupedData || groupedData.length === 0) return null;
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ mb: 1, fontWeight: 600, color: "#444" }}
      >
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={groupedData}
          margin={{ top: 16, right: 16, left: 16, bottom: 40 }}
          barSize={28}
        >
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="4 2" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 11 }}
            height={40}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <Legend
            verticalAlign="top"
            height={24}
            iconType="rect"
            formatter={(value) => `${value}`}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {groupedData.map((entry, index) => (
              <Cell
                key={`cell-course-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

// ------------------ Additional Visualizations ------------------

// Membership Growth Trend Chart (Line Chart)
const MembershipGrowthChart = ({ newRequests, approvedMembers }) => {
  const allMembers = [...newRequests, ...approvedMembers];
  const growthDataMap = {};
  allMembers.forEach((member) => {
    const year = member.year || "Unknown";
    growthDataMap[year] = (growthDataMap[year] || 0) + 1;
  });
  const growthData = Object.entries(growthDataMap)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => {
      if (isNaN(a.year) || isNaN(b.year)) return a.year.localeCompare(b.year);
      return +a.year - +b.year;
    });
  if (growthData.length === 0) return null;

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ mb: 1, fontWeight: 600, color: "#444" }}
      >
        Membership Growth Trend
      </Typography>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={growthData}
          margin={{ top: 16, right: 16, left: 16, bottom: 32 }}
        >
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="4 2" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2, fill: "#8884d8" }}
            activeDot={{ r: 6, fill: "#FF8042" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

// Faculty Distribution Chart (Donut Chart)
const FacultyDonutChart = ({ members }) => {
  const data = groupData(members, "faculty");
  if (data.length === 0) return null;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }) => {
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
        fontSize={10}
        fill="#333"
      >
        {`${item.name}: ${percentage}%`}
      </text>
    );
  };
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ mb: 1, fontWeight: 600, color: "#444" }}
      >
        Faculty Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={45}
            label={renderLabel}
            labelLine={false}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-faculty-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={30}
            iconType="circle"
            formatter={(value) => `Faculty ${value}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
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
  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }) => {
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
        fontSize={10}
        fill="#333"
      >
        {`${item.name}: ${percentage}%`}
      </text>
    );
  };
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ mb: 1, fontWeight: 600, color: "#444" }}
      >
        Notifications Breakdown
      </Typography>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={45}
            label={renderLabel}
            labelLine={false}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-notif-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={30}
            iconType="circle"
            formatter={(value) => `Notification ${value}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

// ---------------- Container Component: MemberAnalysisCharts ----------------
// This component renders all visualizations in a responsive grid layout.
const MemberAnalysisCharts = ({
  data,
  titlePrefix,
  newRequests,
  approvedMembers,
  notifications,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "1fr 1fr",
        },
        gap: 2,
        width: "100%",
        mt: 2,
      }}
    >
      <YearDonutChart data={data} title={`${titlePrefix} Members by Year`} />
      <CourseBarChart data={data} title={`${titlePrefix} Members by Course`} />
      <MembershipGrowthChart
        newRequests={newRequests}
        approvedMembers={approvedMembers}
      />
      <FacultyDonutChart members={data} />
      <NotificationsDonutChart notifications={notifications} />
    </Box>
  );
};

export default MemberAnalysisCharts;
