// src/config/chartsConfig.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register all needed chart types and features globally
ChartJS.register(
  CategoryScale,       // For bar/line chart X axis
  LinearScale,         // For Y axis
  TimeScale,           // For time-based charts
  RadialLinearScale,   // For radar, polar and gauge
  PointElement,        // For line chart points
  LineElement,         // For line chart
  BarElement,          // For bar chart
  ArcElement,          // For pie, doughnut
  Title,
  Tooltip,
  Legend,
  Filler              // For filled area charts
);