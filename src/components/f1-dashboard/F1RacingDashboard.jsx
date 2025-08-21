import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import MainDashboard from "./MainDashboard";

/**
 * F1 Racing Dashboard - Main Component for Next.js Integration
 *
 * This component handles Excel file loading and provides the complete
 * F1 Racing Dashboard experience with 5 tabs:
 * - Championship Standings
 * - Team Racing (Monaco/Kyalami)
 * - Monaco Circuit View
 * - Kyalami Circuit View
 * - Pit Crew Details
 */
export default function F1RacingDashboard({ excelPath = "/Book1.xlsx" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExcelData = async () => {
      try {
        setLoading(true);

        // Fetch Excel file from public folder
        const response = await fetch(excelPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch Excel file: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Process data into F1 dashboard format
        console.log("Raw Excel data loaded:", jsonData?.length, "rows");
        console.log("Sample row:", jsonData?.[0]);

        const processedData = processExcelData(jsonData);
        console.log("Processed data:", processedData);

        setData(processedData);
        setError(null);
      } catch (err) {
        console.error("Error loading Excel data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadExcelData();
  }, [excelPath]);

  const getCircuitAssignment = (supervisorName) => {
    // Monaco circuit supervisors
    const monacoSupervisors = [
      "Ashley Moyo",
      "Mixo Makhubele",
      "Nonhle Zondi",
      "Rodney Naidu",
      "Samantha Govender",
      "Samuel Masubelele",
      "Taedi Moletsane",
      "Thabo Mosweu",
      "Thobile Phakhathi",
    ];

    // Kyalami circuit supervisors
    const kyalamiSupervisors = [
      "Busisiwe Mabuza",
      "Cindy Visser",
      "Matimba Ngobeni",
      "Mfundo Mdlalose",
      "Mondli Nhlapho",
      "Mosima Moshidi",
      "Salome Baloyi",
      "Shadleigh White",
      "Tshepo Moeketsi",
    ];

    if (monacoSupervisors.includes(supervisorName)) {
      return "Monaco";
    } else if (kyalamiSupervisors.includes(supervisorName)) {
      return "Kyalami";
    } else {
      return supervisorName.charCodeAt(0) % 2 === 0 ? "Monaco" : "Kyalami";
    }
  };

  const processExcelData = (rawData) => {
    if (!rawData || rawData.length === 0) {
      return { supervisors: [], consultants: [], companyMetrics: {} };
    }

    // Group data by supervisor
    const supervisorGroups = {};
    const consultantsList = [];

    rawData.forEach((row, index) => {
      const supervisorName =
        row["Supervisor Name"] || row.SupervisorName || row.supervisor;
      const consultantName =
        row["Consultant Name"] || row.ConsultantName || row.consultant;

      if (!supervisorName || !consultantName) return;

      const salesActual = parseFloat(
        row["TotalSalesVal"] || row.TotalSalesVal || 0
      );
      const salesTarget = parseFloat(
        row["SalesValTarget"] || row.SalesValTarget || 0
      );
      const appsActual = parseInt(
        row["TotalRealAppsVol"] || row.TotalRealAppsVol || 0
      );
      const appsTarget = parseInt(
        row["RealAppsTarget"] || row.RealAppsTarget || 0
      );

      const salesAchievement =
        salesTarget > 0 ? (salesActual / salesTarget) * 100 : 0;
      const appsAchievement =
        appsTarget > 0 ? (appsActual / appsTarget) * 100 : 0;
      const overallPerformance = (salesAchievement + appsAchievement) / 2;

      // Determine performance level
      let performanceLevel = "Recovery Mode";
      if (overallPerformance >= 100) performanceLevel = "Superstar";
      else if (overallPerformance >= 90) performanceLevel = "Target Achieved";
      else if (overallPerformance >= 70) performanceLevel = "On Track";
      else if (overallPerformance >= 50) performanceLevel = "Needs Boost";

      // Determine circuit assignment
      const circuit = getCircuitAssignment(supervisorName);

      const consultant = {
        id: index + 1,
        consultantName,
        supervisorName,
        salesAchievement,
        appsAchievement,
        salesActual,
        salesTarget,
        appsActual,
        appsTarget,
        circuit,
        performanceLevel,
        overallPerformance,
      };

      consultantsList.push(consultant);

      if (!supervisorGroups[supervisorName]) {
        supervisorGroups[supervisorName] = {
          supervisorName,
          circuit,
          consultants: [],
          totalSalesActual: 0,
          totalSalesTarget: 0,
          totalAppsActual: 0,
          totalAppsTarget: 0,
        };
      }

      supervisorGroups[supervisorName].consultants.push(consultant);
      supervisorGroups[supervisorName].totalSalesActual += salesActual;
      supervisorGroups[supervisorName].totalSalesTarget += salesTarget;
      supervisorGroups[supervisorName].totalAppsActual += appsActual;
      supervisorGroups[supervisorName].totalAppsTarget += appsTarget;
    });

    // Convert to supervisors array with calculated metrics
    const supervisors = Object.values(supervisorGroups).map((group) => {
      const salesAchievement =
        group.totalSalesTarget > 0
          ? (group.totalSalesActual / group.totalSalesTarget) * 100
          : 0;
      const appsAchievement =
        group.totalAppsTarget > 0
          ? (group.totalAppsActual / group.totalAppsTarget) * 100
          : 0;

      return {
        ...group,
        salesAchievement,
        appsAchievement,
        overallAchievement: (salesAchievement + appsAchievement) / 2,
        teamSize: group.consultants.length,
      };
    });

    // Calculate company metrics
    const totalSalesActual = consultantsList.reduce(
      (sum, c) => sum + c.salesActual,
      0
    );
    const totalSalesTarget = consultantsList.reduce(
      (sum, c) => sum + c.salesTarget,
      0
    );
    const totalAppsActual = consultantsList.reduce(
      (sum, c) => sum + c.appsActual,
      0
    );
    const totalAppsTarget = consultantsList.reduce(
      (sum, c) => sum + c.appsTarget,
      0
    );

    const companyMetrics = {
      totalConsultants: consultantsList.length,
      totalSupervisors: supervisors.length,
      totalSalesActual,
      totalSalesTarget,
      totalAppsActual,
      totalAppsTarget,
      salesAchievement:
        totalSalesTarget > 0 ? (totalSalesActual / totalSalesTarget) * 100 : 0,
      appsAchievement:
        totalAppsTarget > 0 ? (totalAppsActual / totalAppsTarget) * 100 : 0,
      achievementPercentage:
        totalSalesTarget > 0 ? (totalSalesActual / totalSalesTarget) * 100 : 0,
      currentValue: totalSalesActual,
      targetValue: totalSalesTarget,
    };

    companyMetrics.overallAchievement =
      (companyMetrics.salesAchievement + companyMetrics.appsAchievement) / 2;

    return {
      supervisors,
      consultants: consultantsList,
      companyMetrics,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl text-white font-bold">
            Loading F1 Racing Dashboard...
          </h2>
          <p className="text-gray-300">Processing Excel data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center max-w-md p-8 bg-red-900/20 border border-red-500/30 rounded-lg">
          <h2 className="text-xl text-red-400 font-bold mb-4">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-400">
            Make sure Book1.xlsx is placed in your public folder and contains
            the required columns: Supervisor Name, Consultant Name,
            TotalSalesVal, SalesValTarget, TotalRealAppsVol, RealAppsTarget
          </p>
        </div>
      </div>
    );
  }

  console.log(
    "F1RacingDashboard: Passing data to MainDashboard component:",
    data
  );
  return <MainDashboard data={data} />;
}
