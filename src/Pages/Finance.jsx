import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subMonths } from "date-fns";
import AdminSidebar from "../Components/AdminSidebar";
import "../CSS/Finance.css";
import {
  Plus,
  X,
  DollarSign,
  CreditCard,
  Tag,
  Calendar,
  FileText,
  ArrowUp,
  ArrowDown,
  Filter,
} from "lucide-react";