# 📈 Analytics Dashboard Boilerplate

Comprehensive analytics dashboard with charts, metrics, user behavior tracking, and custom reports. Visualize your data beautifully.

## ✨ Features

- ✅ **Charts** - Line, bar, pie, area charts
- ✅ **Metrics** - Key performance indicators
- ✅ **User Analytics** - User behavior tracking
- ✅ **Course Analytics** - Course performance
- ✅ **Revenue Analytics** - Financial metrics
- ✅ **Custom Reports** - Build custom reports
- ✅ **Export** - Export to PDF/CSV
- ✅ **Date Ranges** - Flexible date filtering
- ✅ **Real-time** - Live data updates
- ✅ **Responsive** - Mobile-friendly

## 📦 Installation

```bash
npm install recharts date-fns lucide-react
cp -r boilerplates/analytics-dashboard/components ./src/components/analytics
```

## 🚀 Quick Start

```typescript
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'

function Analytics() {
  return (
    <AnalyticsDashboard
      data={analyticsData}
      dateRange={{ start: startDate, end: endDate }}
    />
  )
}
```

## 📊 Chart Types

### Line Chart

```typescript
<LineChart
  data={data}
  xKey="date"
  yKey="value"
  title="User Growth"
/>
```

### Bar Chart

```typescript
<BarChart
  data={data}
  xKey="month"
  yKey="revenue"
  title="Monthly Revenue"
/>
```

### Pie Chart

```typescript
<PieChart
  data={data}
  nameKey="category"
  valueKey="count"
  title="Course Categories"
/>
```

## 💡 Use Cases

### User Analytics

```typescript
<UserAnalytics
  metrics={{
    totalUsers: 1234,
    activeUsers: 890,
    newUsers: 45,
    churnRate: 5
  }}
  chartData={userGrowthData}
/>
```

### Course Analytics

```typescript
<CourseAnalytics
  metrics={{
    totalCourses: 56,
    completionRate: 78,
    averageRating: 4.5,
    enrollments: 3456
  }}
  chartData={coursePerformanceData}
/>
```

---

**Need help?** Check the examples folder for complete implementations.

