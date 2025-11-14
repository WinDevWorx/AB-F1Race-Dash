import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import MainDashboard from "./MainDashboard";

export default function F1RacingDashboard({ 
  salesReportPath = "/Book1.xlsx", 
  pointsReportPath = "/PointsReport.xlsx" 
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExcelData = async () => {
      try {
        setLoading(true);

        // Fetch both Excel files
        const salesRes = await fetch(salesReportPath);
        if (!salesRes.ok) throw new Error(`Failed to fetch sales report: ${salesRes.status}`);

        const pointsRes = await fetch(pointsReportPath);
        if (!pointsRes.ok) throw new Error(`Failed to fetch points report: ${pointsRes.status}`);

        const arrayBuffer_salesReport = await salesRes.arrayBuffer();
        const workbook_salesReport = XLSX.read(arrayBuffer_salesReport, { type: "array" });
        
        const arrayBuffer_pointsReport = await pointsRes.arrayBuffer();
        const workbook_pointsReport = XLSX.read(arrayBuffer_pointsReport, { type: "array" });

        // Get first sheets
        const sheetName_sales = workbook_salesReport.SheetNames[0];
        const worksheet_sales = workbook_salesReport.Sheets[sheetName_sales];
        
        const sheetName_points = workbook_pointsReport.SheetNames[0];
        const worksheet_points = workbook_pointsReport.Sheets[sheetName_points];
        
        const jsonData_Sales = XLSX.utils.sheet_to_json(worksheet_sales, { raw: false });
        const jsonData_Points = XLSX.utils.sheet_to_json(worksheet_points, { raw: false });

        console.log("=== ACTUAL POINTS FILE STRUCTURE ===");
        console.log("Number of rows:", jsonData_Points?.length);
        console.log("Columns:", jsonData_Points && jsonData_Points.length > 0 ? Object.keys(jsonData_Points[0]) : []);
        console.log("First 3 rows:", jsonData_Points?.slice(0, 3));

        const processedData = processExcelData(jsonData_Sales, jsonData_Points);
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
  }, [salesReportPath, pointsReportPath]);

  const getCircuitAssignment = (supervisorName) => {
    const monacoSupervisors = [
      "Ashley Moyo", "Mixo Makhubele", "Nonhle Zondi", "Rodney Naidu", 
      "Samantha Govender", "Samuel Masubelele", "Taedi Moletsane", 
      "Thabo Mosweu", "Thobile Phakhathi",
    ];

    const kyalamiSupervisors = [
      "Busisiwe Mabuza", "Cindy Visser", "Matimba Ngobeni", "Mfundo Mdlalose", 
      "Mondli Nhlapho", "Mosima Moshidi", "Salome Baloyi", "Shadleigh White", 
      "Tshepo Moeketsi", "Zwivhuya Magwara",
    ];

    if (monacoSupervisors.includes(supervisorName)) return "Monaco";
    if (kyalamiSupervisors.includes(supervisorName)) return "Kyalami";
    return supervisorName?.charCodeAt(0) % 2 === 0 ? "Monaco" : "Kyalami";
  };

  const parseNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d.-]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : Math.ceil(num);
    }
    const num = typeof value === 'number' ? value : parseFloat(value);
    return isNaN(num) ? 0 : Math.ceil(num);
  };

  const processExcelData = (salesData, pointsData) => {
    if (!salesData || salesData.length === 0) {
      return { supervisors: [], consultants: [], companyMetrics: {} };
    }

    console.log("=== PROCESSING POINTS DATA ===");
    
    // Create points lookup - handle both possible file structures
    const pointsBySupervisor = {};
    if (pointsData && pointsData.length > 0) {
      const firstRow = pointsData[0];
      const columns = Object.keys(firstRow);
      
      console.log("Available columns in points file:", columns);
      
      pointsData.forEach(row => {
        const supervisorName = row["Supervisor Name"];
        if (supervisorName && supervisorName !== "Total Result") {
          // Try multiple possible column name variations
          const creditPoints = 
            row["Credit Points"] !== undefined ? row["Credit Points"] :
            row["CreditPoints"] !== undefined ? row["CreditPoints"] : 0;
            
          const myWorldPoints = 
            row["MyWorld Points"] !== undefined ? row["MyWorld Points"] :
            row["MyWorldPoints"] !== undefined ? row["MyWorldPoints"] : 0;
            
          const funeralPoints = 
            row["Funeral Points"] !== undefined ? row["Funeral Points"] :
            row["FuneralPoints"] !== undefined ? row["FuneralPoints"] : 0;
            
          const investmentPoints = 
            row["Investment Points"] !== undefined ? row["Investment Points"] :
            row["InvestmentPoints"] !== undefined ? row["InvestmentPoints"] : 0;
            
          const totalPoints = 
            row["Total Points"] !== undefined ? row["Total Points"] :
            row["TotalPoints"] !== undefined ? row["TotalPoints"] : 0;

          pointsBySupervisor[supervisorName] = {
            creditPoints: parseNumber(creditPoints),
            myWorldPoints: parseNumber(myWorldPoints),
            funeralPoints: parseNumber(funeralPoints),
            investmentPoints: parseNumber(investmentPoints),
            totalPoints: parseNumber(totalPoints)
          };

          console.log(`Points for ${supervisorName}:`, {
            credit: pointsBySupervisor[supervisorName].creditPoints,
            myWorld: pointsBySupervisor[supervisorName].myWorldPoints,
            funeral: pointsBySupervisor[supervisorName].funeralPoints,
            investment: pointsBySupervisor[supervisorName].investmentPoints,
            total: pointsBySupervisor[supervisorName].totalPoints
          });
        }
      });
    }

    // Process sales data
    const totalRow = salesData.find((row) => row["ReportMonth"] === "Total");
    
    const supervisorGroups = {};
    const consultantsList = [];

    salesData.forEach((row, index) => {
      const supervisorName = row["Supervisor Name"];
      const consultantName = row["Consultant Name"];

      if (!supervisorName || !consultantName || supervisorName === "Total" || supervisorName.includes("Applied filters")) {
        return;
      }

      const salesActual = parseNumber(row["TotalSalesVal"]);
      const salesTarget = parseNumber(row["SalesValTarget"]);
      const appsActual = parseNumber(row["TotalRealAppsVol"]);
      const appsTarget = parseNumber(row["RealAppsTarget"]);
      const myWorldTarget = parseNumber(row["MyWorldTarget"]);
      const myWorldFundedVol = parseNumber(row["MyWorldFundedAccs"]);
      const funeralTarget = parseNumber(row["FuneralTarget"]);
      const funeralVol = parseNumber(row["FuneralVol"]);

      const salesAchievement = salesTarget > 0 ? (salesActual / salesTarget) * 100 : 0;
      const appsAchievement = appsTarget > 0 ? (appsActual / appsTarget) * 100 : 0;
      const overallPerformance = (salesAchievement + appsAchievement) / 2;

      let performanceLevel = "Recovery Mode";
      if (overallPerformance >= 100) performanceLevel = "Superstar";
      else if (overallPerformance >= 90) performanceLevel = "Target Achieved";
      else if (overallPerformance >= 70) performanceLevel = "On Track";
      else if (overallPerformance >= 50) performanceLevel = "Needs Boost";

      const circuit = getCircuitAssignment(supervisorName);

      // Get points
      const supervisorPoints = pointsBySupervisor[supervisorName] || {
        creditPoints: 0,
        myWorldPoints: 0,
        funeralPoints: 0,
        investmentPoints: 0,
        totalPoints: 0
      };

      const consultant = {
        id: index + 1,
        consultantName: consultantName.trim(),
        supervisorName: supervisorName.trim(),
        salesAchievement,
        appsAchievement,
        salesActual,
        salesTarget,
        appsActual,
        appsTarget,
        myWorldTarget,
        myWorldFundedVol,
        funeralTarget,
        funeralVol,
        circuit,
        performanceLevel,
        overallPerformance,
        points: supervisorPoints
      };

      consultantsList.push(consultant);

      if (!supervisorGroups[supervisorName]) {
        supervisorGroups[supervisorName] = {
          supervisorName,
          circuit,
          consultants: [],
          salesActual,
          salesTarget,
          appsActual,
          appsTarget,
          myWorldTarget,
          myWorldFundedVol,
          funeralTarget,
          funeralVol,
          points: supervisorPoints
        };
      }

      supervisorGroups[supervisorName].consultants.push(consultant);
    });

    // Calculate supervisor achievements
    const supervisors = Object.values(supervisorGroups).map((group) => {
      const salesAchievement = group.salesTarget > 0 ? (group.salesActual / group.salesTarget) * 100 : 0;
      const appsAchievement = group.appsTarget > 0 ? (group.appsActual / group.appsTarget) * 100 : 0;
      const myWorldAchievement = group.myWorldTarget > 0 ? (group.myWorldFundedVol / group.myWorldTarget) * 100 : 0;
      const funeralAchievement = group.funeralTarget > 0 ? (group.funeralVol / group.funeralTarget) * 100 : 0;

      return {
        ...group,
        salesAchievement,
        appsAchievement,
        myWorldAchievement,
        funeralAchievement,
        overallAchievement: (salesAchievement + appsAchievement) / 2,
        teamSize: group.consultants.length,
      };
    });

    // Company metrics
    const companyMetrics = {
      totalSalesActual: totalRow ? parseNumber(totalRow["TotalSalesVal"]) : 0,
      totalSalesTarget: totalRow ? parseNumber(totalRow["SalesValTarget"]) : 0,
      totalAppsActual: totalRow ? parseNumber(totalRow["TotalRealAppsVol"]) : 0,
      totalAppsTarget: totalRow ? parseNumber(totalRow["RealAppsTarget"]) : 0,
      totalMyWorldTarget: totalRow ? parseNumber(totalRow["MyWorldTarget"]) : 0,
      totalMyWorldFundedVol: totalRow ? parseNumber(totalRow["MyWorldFundedAccs"]) : 0,
      totalFuneralTarget: totalRow ? parseNumber(totalRow["FuneralTarget"]) : 0,
      totalFuneralVol: totalRow ? parseNumber(totalRow["FuneralVol"]) : 0,
      totalConsultants: consultantsList.length,
      totalSupervisors: supervisors.length,
      totalPoints: Object.values(pointsBySupervisor).reduce((sum, points) => sum + points.totalPoints, 0),
    };

    companyMetrics.salesAchievement = companyMetrics.totalSalesTarget > 0 ? (companyMetrics.totalSalesActual / companyMetrics.totalSalesTarget) * 100 : 0;
    companyMetrics.appsAchievement = companyMetrics.totalAppsTarget > 0 ? (companyMetrics.totalAppsActual / companyMetrics.totalAppsTarget) * 100 : 0;
    companyMetrics.myWorldAchievement = companyMetrics.totalMyWorldTarget > 0 ? (companyMetrics.totalMyWorldFundedVol / companyMetrics.totalMyWorldTarget) * 100 : 0;
    companyMetrics.funeralAchievement = companyMetrics.totalFuneralTarget > 0 ? (companyMetrics.totalFuneralVol / companyMetrics.totalFuneralTarget) * 100 : 0;
    companyMetrics.overallAchievement = (companyMetrics.salesAchievement + companyMetrics.appsAchievement) / 2;

    // Final check
    console.log("=== FINAL POINTS VERIFICATION ===");
    supervisors.forEach((sup) => {
      console.log(`${sup.supervisorName}: MyWorldPoints = ${sup.points.myWorldPoints}`);
    });

    return {
      supervisors,
      consultants: consultantsList,
      companyMetrics,
      pointsData: pointsBySupervisor
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl text-white font-bold">Loading F1 Racing Dashboard...</h2>
          <p className="text-gray-300">Processing Excel data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center max-w-md p-8 bg-red-900/20 border border-red-500/30 rounded-lg">
          <h2 className="text-xl text-red-400 font-bold mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-400">
            Make sure both Excel files are placed in your public folder.
          </p>
        </div>
      </div>
    );
  }

  return <MainDashboard data={data} />;
}