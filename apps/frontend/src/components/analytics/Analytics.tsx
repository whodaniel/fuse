"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
import react_1 from 'react';
import components_1 from '../components.js';
import material_1 from '@mui/material';
import react_chartjs_2_1 from 'react-chartjs-2';
import chart_js_1 from 'chart.js';
// Register ChartJS components
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.PointElement, chart_js_1.LineElement, chart_js_1.BarElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend);
const Analytics = () => {
    const [timeRange, setTimeRange] = react_1.default.useState('24h');
    const [activeTab, setActiveTab] = react_1.default.useState(0);
    // Sample data for charts
    const performanceData = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [
            {
                label: 'Response Time (ms)',
                data: [150, 230, 180, 400, 280, 250],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };
    const resourceUsageData = {
        labels: ['CPU', 'Memory', 'GPU', 'Network'],
        datasets: [
            {
                label: 'Usage %',
                data: [65, 78, 45, 88],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                ],
            },
        ],
    };
    return (<div className="p-6">
      <material_1.Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <material_1.Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <material_1.Tab label="Performance"/>
          <material_1.Tab label="Resources"/>
          <material_1.Tab label="Knowledge Graph"/>
          <material_1.Tab label="Task Analysis"/>
        </material_1.Tabs>
      </material_1.Box>

      {activeTab === 0 && (<material_1.Grid container spacing={3}>
          <material_1.Grid item xs={12}>
            <material_1.Paper className="p-4">
              <h2 className="text-xl font-bold mb-4">System Performance</h2>
              <components_1.PerformanceMetrics />
              <div className="mt-4 h-80">
                <react_chartjs_2_1.Line data={performanceData} options={{ maintainAspectRatio: false }}/>
              </div>
            </material_1.Paper>
          </material_1.Grid>
        </material_1.Grid>)}

      {activeTab === 1 && (<material_1.Grid container spacing={3}>
          <material_1.Grid item xs={12}>
            <material_1.Paper className="p-4">
              <h2 className="text-xl font-bold mb-4">Resource Usage</h2>
              <components_1.SystemMetrics />
              <div className="mt-4 h-80">
                <react_chartjs_2_1.Bar data={resourceUsageData} options={{ maintainAspectRatio: false }}/>
              </div>
            </material_1.Paper>
          </material_1.Grid>
        </material_1.Grid>)}

      {activeTab === 2 && (<material_1.Grid container spacing={3}>
          <material_1.Grid item xs={12}>
            <material_1.Paper className="p-4">
              <h2 className="text-xl font-bold mb-4">Knowledge Graph Analysis</h2>
              <components_1.DynamicKnowledgeGraph />
            </material_1.Paper>
          </material_1.Grid>
        </material_1.Grid>)}

      {activeTab === 3 && (<material_1.Grid container spacing={3}>
          <material_1.Grid item xs={12}>
            <material_1.Paper className="p-4">
              <h2 className="text-xl font-bold mb-4">Task Allocation Analysis</h2>
              <components_1.PredictiveTaskAllocator />
            </material_1.Paper>
          </material_1.Grid>
        </material_1.Grid>)}
    </div>);
};
exports.default = Analytics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5hbHl0aWNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQW5hbHl0aWNzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUEwQjtBQUMxQiw4Q0FLdUI7QUFDdkIsNENBQTREO0FBQzVELHFEQUE0QztBQUM1Qyx1Q0FVa0I7QUFFbEIsOEJBQThCO0FBQzlCLGdCQUFPLENBQUMsUUFBUSxDQUNkLHdCQUFhLEVBQ2Isc0JBQVcsRUFDWCx1QkFBWSxFQUNaLHNCQUFXLEVBQ1gscUJBQVUsRUFDVixnQkFBSyxFQUNMLGtCQUFPLEVBQ1AsaUJBQU0sQ0FDUCxDQUFDO0FBRUYsTUFBTSxTQUFTLEdBQWEsR0FBRyxFQUFFO0lBQy9CLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEdBQUcsZUFBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4RCxNQUFNLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxHQUFHLGVBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEQseUJBQXlCO0lBQ3pCLE1BQU0sZUFBZSxHQUFHO1FBQ3RCLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO1FBQzlELFFBQVEsRUFBRTtZQUNSO2dCQUNFLEtBQUssRUFBRSxvQkFBb0I7Z0JBQzNCLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO2dCQUNwQyxXQUFXLEVBQUUsbUJBQW1CO2dCQUNoQyxPQUFPLEVBQUUsR0FBRzthQUNiO1NBQ0Y7S0FDRixDQUFDO0lBRUYsTUFBTSxpQkFBaUIsR0FBRztRQUN4QixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUM7UUFDM0MsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0Us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TyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3pCO1VBQUEsQ0FBQyxlQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNoQjtZQUFBLENBQUMsZ0JBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUNwQjtjQUFBLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLENBQ25FO2NBQUEsQ0FBQyxrQ0FBcUIsQ0FBQyxBQUFELEVBQ3hCO1lBQUEsRUFBRSxnQkFBSyxDQUNUO1VBQUEsRUFBRSxlQUFJLENBQ1I7UUFBQSxFQUFFLGVBQUksQ0FBQyxDQUNSLENBRUQ7O01BQUEsQ0FBQyxTQUFTLEtBQUssQ0FBQyxJQUFJLENBQ2xCLENBQUMsZUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDekI7VUFBQSxDQUFDLGVBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ2hCO1lBQUEsQ0FBQyxnQkFBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQ3BCO2NBQUEsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLHdCQUF3QixFQUFFLEVBQUUsQ0FDbkU7Y0FBQSxDQUFDLG9DQUF1QixDQUFDLEFBQUQsRUFDMUI7WUFBQSxFQUFFLGdCQUFLLENBQ1Q7VUFBQSxFQUFFLGVBQUksQ0FDUjtRQUFBLEVBQUUsZUFBSSxDQUFDLENBQ1IsQ0FDSDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLGtCQUFlLFNBQVMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBQZXJmb3JtYW5jZU1ldHJpY3MsXG4gIFN5c3RlbU1ldHJpY3MsXG4gIER5bmFtaWNLbm93bGVkZ2VHcmFwaCxcbiAgUHJlZGljdGl2ZVRhc2tBbGxvY2F0b3IsXG59IGZyb20gJy4uL2NvbXBvbmVudHMnO1xuaW1wb3J0IHsgR3JpZCwgUGFwZXIsIFRhYiwgVGFicywgQm94IH0gZnJvbSAnQG11aS9tYXRlcmlhbCc7XG5pbXBvcnQgeyBMaW5lLCBCYXIgfSBmcm9tICdyZWFjdC1jaGFydGpzLTInO1xuaW1wb3J0IHtcbiAgQ2hhcnQgYXMgQ2hhcnRKUyxcbiAgQ2F0ZWdvcnlTY2FsZSxcbiAgTGluZWFyU2NhbGUsXG4gIFBvaW50RWxlbWVudCxcbiAgTGluZUVsZW1lbnQsXG4gIEJhckVsZW1lbnQsXG4gIFRpdGxlLFxuICBUb29sdGlwLFxuICBMZWdlbmQsXG59IGZyb20gJ2NoYXJ0LmpzJztcblxuLy8gUmVnaXN0ZXIgQ2hhcnRKUyBjb21wb25lbnRzXG5DaGFydEpTLnJlZ2lzdGVyKFxuICBDYXRlZ29yeVNjYWxlLFxuICBMaW5lYXJTY2FsZSxcbiAgUG9pbnRFbGVtZW50LFxuICBMaW5lRWxlbWVudCxcbiAgQmFyRWxlbWVudCxcbiAgVGl0bGUsXG4gIFRvb2x0aXAsXG4gIExlZ2VuZFxuKTtcblxuY29uc3QgQW5hbHl0aWNzOiBSZWFjdC5GQyA9ICgpID0+IHtcbiAgY29uc3QgW3RpbWVSYW5nZSwgc2V0VGltZVJhbmdlXSA9IFJlYWN0LnVzZVN0YXRlKCcyNGgnKTtcbiAgY29uc3QgW2FjdGl2ZVRhYiwgc2V0QWN0aXZlVGFiXSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuXG4gIC8vIFNhbXBsZSBkYXRhIGZvciBjaGFydHNcbiAgY29uc3QgcGVyZm9ybWFuY2VEYXRhID0ge1xuICAgIGxhYmVsczogWycwMDowMCcsICcwNDowMCcsICcwODowMCcsICcxMjowMCcsICcxNjowMCcsICcyMDowMCddLFxuICAgIGRhdGFzZXRzOiBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnUmVzcG9uc2UgVGltZSAobXMpJyxcbiAgICAgICAgZGF0YTogWzE1MCwgMjMwLCAxODAsIDQwMCwgMjgwLCAyNTBdLFxuICAgICAgICBib3JkZXJDb2xvcjogJ3JnYig3NSwgMTkyLCAxOTIpJyxcbiAgICAgICAgdGVuc2lvbjogMC4xLFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xuXG4gIGNvbnN0IHJlc291cmNlVXNhZ2VEYXRhID0ge1xuICAgIGxhYmVsczogWydDUFUnLCAnTWVtb3J5JywgJ0dQVScsICdOZXR3b3JrJ10sXG4gICAgZGF0YXNldHM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdVc2FnZSAlJyxcbiAgICAgICAgZGF0YTogWzY1LCA3OCwgNDUsIDg4XSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBbXG4gICAgICAgICAgJ3JnYmEoMjU1LCA5OSwgMTMyLCAwLjUpJyxcbiAgICAgICAgICAncmdiYSg1NCwgMTYyLCAyMzUsIDAuNSknLFxuICAgICAgICAgICdyZ2JhKDI1NSwgMjA2LCA4NiwgMC41KScsXG4gICAgICAgICAgJ3JnYmEoNzUsIDE5MiwgMTkyLCAwLjUpJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicC02XCI+XG4gICAgICA8Qm94IHN4PXt7IGJvcmRlckJvdHRvbTogMSwgYm9yZGVyQ29sb3I6ICdkaXZpZGVyJywgbWI6IDMgfX0+XG4gICAgICAgIDxUYWJzIHZhbHVlPXthY3RpdmVUYWJ9IG9uQ2hhbmdlPXsoXywgbmV3VmFsdWUpID0+IHNldEFjdGl2ZVRhYihuZXdWYWx1ZSl9PlxuICAgICAgICAgIDxUYWIgbGFiZWw9XCJQZXJmb3JtYW5jZVwiIC8+XG4gICAgICAgICAgPFRhYiBsYWJlbD1cIlJlc291cmNlc1wiIC8+XG4gICAgICAgICAgPFRhYiBsYWJlbD1cIktub3dsZWRnZSBHcmFwaFwiIC8+XG4gICAgICAgICAgPFRhYiBsYWJlbD1cIlRhc2sgQW5hbHlzaXNcIiAvPlxuICAgICAgICA8L1RhYnM+XG4gICAgICA8L0JveD5cblxuICAgICAge2FjdGl2ZVRhYiA9PT0gMCAmJiAoXG4gICAgICAgIDxHcmlkIGNvbnRhaW5lciBzcGFjaW5nPXszfT5cbiAgICAgICAgICA8R3JpZCBpdGVtIHhzPXsxMn0+XG4gICAgICAgICAgICA8UGFwZXIgY2xhc3NOYW1lPVwicC00XCI+XG4gICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LXhsIGZvbnQtYm9sZCBtYi00XCI+U3lzdGVtIFBlcmZvcm1hbmNlPC9oMj5cbiAgICAgICAgICAgICAgPFBlcmZvcm1hbmNlTWV0cmljcyAvPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgaC04MFwiPlxuICAgICAgICAgICAgICAgIDxMaW5lIGRhdGE9e3BlcmZvcm1hbmNlRGF0YX0gb3B0aW9ucz17eyBtYWludGFpbkFzcGVjdFJhdGlvOiBmYWxzZSB9fSAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUGFwZXI+XG4gICAgICAgICAgPC9HcmlkPlxuICAgICAgICA8L0dyaWQ+XG4gICAgICApfVxuXG4gICAgICB7YWN0aXZlVGFiID09PSAxICYmIChcbiAgICAgICAgPEdyaWQgY29udGFpbmVyIHNwYWNpbmc9ezN9PlxuICAgICAgICAgIDxHcmlkIGl0ZW0geHM9ezEyfT5cbiAgICAgICAgICAgIDxQYXBlciBjbGFzc05hbWU9XCJwLTRcIj5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQteGwgZm9udC1ib2xkIG1iLTRcIj5SZXNvdXJjZSBVc2FnZTwvaDI+XG4gICAgICAgICAgICAgIDxTeXN0ZW1NZXRyaWNzIC8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBoLTgwXCI+XG4gICAgICAgICAgICAgICAgPEJhciBkYXRhPXtyZXNvdXJjZVVzYWdlRGF0YX0gb3B0aW9ucz17eyBtYWludGFpbkFzcGVjdFJhdGlvOiBmYWxzZSB9fSAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUGFwZXI+XG4gICAgICAgICAgPC9HcmlkPlxuICAgICAgICA8L0dyaWQ+XG4gICAgICApfVxuXG4gICAgICB7YWN0aXZlVGFiID09PSAyICYmIChcbiAgICAgICAgPEdyaWQgY29udGFpbmVyIHNwYWNpbmc9ezN9PlxuICAgICAgICAgIDxHcmlkIGl0ZW0geHM9ezEyfT5cbiAgICAgICAgICAgIDxQYXBlciBjbGFzc05hbWU9XCJwLTRcIj5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQteGwgZm9udC1ib2xkIG1iLTRcIj5Lbm93bGVkZ2UgR3JhcGggQW5hbHlzaXM8L2gyPlxuICAgICAgICAgICAgICA8RHluYW1pY0tub3dsZWRnZUdyYXBoIC8+XG4gICAgICAgICAgICA8L1BhcGVyPlxuICAgICAgICAgIDwvR3JpZD5cbiAgICAgICAgPC9HcmlkPlxuICAgICAgKX1cblxuICAgICAge2FjdGl2ZVRhYiA9PT0gMyAmJiAoXG4gICAgICAgIDxHcmlkIGNvbnRhaW5lciBzcGFjaW5nPXszfT5cbiAgICAgICAgICA8R3JpZCBpdGVtIHhzPXsxMn0+XG4gICAgICAgICAgICA8UGFwZXIgY2xhc3NOYW1lPVwicC00XCI+XG4gICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LXhsIGZvbnQtYm9sZCBtYi00XCI+VGFzayBBbGxvY2F0aW9uIEFuYWx5c2lzPC9oMj5cbiAgICAgICAgICAgICAgPFByZWRpY3RpdmVUYXNrQWxsb2NhdG9yIC8+XG4gICAgICAgICAgICA8L1BhcGVyPlxuICAgICAgICAgIDwvR3JpZD5cbiAgICAgICAgPC9HcmlkPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFuYWx5dGljcztcbiJdfQ==
export {};
