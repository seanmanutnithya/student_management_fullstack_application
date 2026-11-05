import { getHomeData } from "@/services/homeService";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import { GraduationCap, Users, ClipboardCheck, Wallet } from "lucide-react";
import { getDirection } from "@/utils/getDirection";
const HomeContext = createContext();

export function HomeProvider({ children }) {
  const [data, setData] = useState(null);

  const [fee, setFee] = useState({});
  const [att, setAtt] = useState({});
  const [teacher, setTeacher] = useState({});
  const [std, setStd] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stats = useMemo(
    () => [
      {
        icon: GraduationCap,
        colorClass: "purple",
        value: std.totalStudent,
        label: "Total students",
        trend: std.currentTrend,
        trendDirection: getDirection(std.currentTrend),
      },
      {
        icon: Users,
        colorClass: "blue",
        value: teacher.totalTeacher,
        label: "Total teachers",
        trend: teacher.currentTrend,
        trendDirection: getDirection(teacher.currentTrend),
      },
      {
        icon: ClipboardCheck,
        colorClass: "green",
        value: att.attendanceRate,
        suffix: "%",
        label: "Today's attendance",
        trend: att.currentTrend,
        trendDirection: getDirection(att.currentTrend),
      },
      {
        icon: Wallet,
        colorClass: "amber",
        value: fee.totalFee,
        prefix: "$",
        label: "Pending fees",
        trend: fee.currentTrend,
        trendDirection: getDirection(fee.currentTrend),
      },
    ],
    [std, teacher, att, fee],
  );

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const data = await getHomeData();
        setFee(data.fee);
        setAtt(data.att);
        setTeacher(data.teacher);
        setStd(data.std);
        setData(data);
      } catch (error) {
        setError(error.message);
        console.error(error.message);
      }
    }
    fetchHomeData();
  }, []);

  const value = useMemo(
    () => ({
      data,
      fee,
      att,
      teacher,
      std,
      stats,
      loading,
      error,
    }),
    [data, fee, att, teacher, std, stats, loading, error],
  );
  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHome() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error("useHome must be inside <HomeProvider>");
  return ctx;
}
