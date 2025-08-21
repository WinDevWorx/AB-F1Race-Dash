// Excel processing utilities for F1 Racing Dashboard
import * as XLSX from 'xlsx';

export const ExcelColumnMappings = {
  consultant_name: ['Consultant Name', 'Name', 'Employee Name', 'Full Name'],
  supervisor_name: ['Supervisor Name', 'Supervisor', 'Manager', 'Team Lead'],
  current_sales: ['TotalSalesVal', 'Sales', 'Current Sales', 'Actual Sales'],
  sales_target: ['SalesValTarget', 'Target', 'Sales Target', 'Goal'],
  real_apps_vol: ['TotalRealAppsVol', 'Apps Volume', 'Applications'],
  real_apps_target: ['RealAppsTarget', 'Apps Target', 'Application Target'],
  team_name: ['Team', 'Team Name', 'Department'],
  leads_generated: ['Leads', 'Lead Generation', 'Prospects'],
  calls_made: ['Calls', 'Phone Calls', 'Outbound Calls'],
  meetings_held: ['Meetings', 'Client Meetings', 'Appointments']
};

export const processExcelFile = async (filePath) => {
  try {
    console.log('Fetching Excel file from:', filePath);
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`Excel file not found: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log('Excel data loaded:', jsonData.length, 'rows');
    console.log('Sample row:', jsonData[0]);
    
    return transformExcelData(jsonData);
  } catch (error) {
    console.error('Excel processing error:', error);
    throw error;
  }
};

const transformExcelData = (rawData) => {
  // Process raw Excel data into F1 dashboard format
  const supervisorGroups = {};
  const consultantsList = [];
  
  rawData.forEach((row, index) => {
    const supervisorName = row['Supervisor Name'] || row.SupervisorName;
    const consultantName = row['Consultant Name'] || row.ConsultantName;
    
    if (!supervisorName || !consultantName) return;
    
    const salesActual = parseFloat(row['TotalSalesVal'] || 0);
    const salesTarget = parseFloat(row['SalesValTarget'] || 0);
    const appsActual = parseInt(row['TotalRealAppsVol'] || 0);
    const appsTarget = parseInt(row['RealAppsTarget'] || 0);
    
    const salesAchievement = salesTarget > 0 ? (salesActual / salesTarget) * 100 : 0;
    const appsAchievement = appsTarget > 0 ? (appsActual / appsTarget) * 100 : 0;
    
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
      circuit: getCircuitAssignment(supervisorName),
      performanceLevel: getPerformanceLevel(salesAchievement),
      overallPerformance: (salesAchievement + appsAchievement) / 2
    };
    
    consultantsList.push(consultant);
    
    // Group by supervisor
    if (!supervisorGroups[supervisorName]) {
      supervisorGroups[supervisorName] = {
        supervisorName,
        circuit: consultant.circuit,
        consultants: [],
        totalSalesActual: 0,
        totalSalesTarget: 0,
        totalAppsActual: 0,
        totalAppsTarget: 0
      };
    }
    
    const group = supervisorGroups[supervisorName];
    group.consultants.push(consultant);
    group.totalSalesActual += salesActual;
    group.totalSalesTarget += salesTarget;
    group.totalAppsActual += appsActual;
    group.totalAppsTarget += appsTarget;
  });

  // Calculate supervisor metrics
  const supervisors = Object.values(supervisorGroups).map(group => {
    const salesAchievement = group.totalSalesTarget > 0 
      ? (group.totalSalesActual / group.totalSalesTarget) * 100 
      : 0;
    const appsAchievement = group.totalAppsTarget > 0 
      ? (group.totalAppsActual / group.totalAppsTarget) * 100 
      : 0;
    
    return {
      ...group,
      salesAchievement,
      appsAchievement,
      overallAchievement: (salesAchievement + appsAchievement) / 2,
      teamSize: group.consultants.length
    };
  });

  // Calculate company metrics
  const totalSalesActual = consultantsList.reduce((sum, c) => sum + c.salesActual, 0);
  const totalSalesTarget = consultantsList.reduce((sum, c) => sum + c.salesTarget, 0);
  const totalAppsActual = consultantsList.reduce((sum, c) => sum + c.appsActual, 0);
  const totalAppsTarget = consultantsList.reduce((sum, c) => sum + c.appsTarget, 0);
  
  const companyMetrics = {
    totalConsultants: consultantsList.length,
    totalSupervisors: supervisors.length,
    totalSalesActual,
    totalSalesTarget,
    totalAppsActual,
    totalAppsTarget,
    salesAchievement: totalSalesTarget > 0 ? (totalSalesActual / totalSalesTarget) * 100 : 0,
    appsAchievement: totalAppsTarget > 0 ? (totalAppsActual / totalAppsTarget) * 100 : 0,
    achievementPercentage: totalSalesTarget > 0 ? (totalSalesActual / totalSalesTarget) * 100 : 0,
    currentValue: totalSalesActual,
    targetValue: totalSalesTarget
  };
  
  companyMetrics.overallAchievement = (companyMetrics.salesAchievement + companyMetrics.appsAchievement) / 2;

  return {
    supervisors,
    consultants: consultantsList,
    companyMetrics
  };
};

const getCircuitAssignment = (supervisorName) => {
  const monacoSupervisors = [
    'Ashley Moyo', 'Mixo Makhubele', 'Nonhle Zondi', 'Rodney Naidu',
    'Samantha Govender', 'Samuel Masubelele', 'Taedi Moletsane', 
    'Thabo Mosweu', 'Thobile Phakhathi'
  ];
  
  const kyalamiSupervisors = [
    'Busisiwe Mabuza', 'Cindy Visser', 'Matimba Ngobeni', 'Mfundo Mdlalose',
    'Mondli Nhlapho', 'Mosima Moshidi', 'Salome Baloyi', 'Shadleigh White', 'Tshepo Moeketsi'
  ];
  
  if (monacoSupervisors.includes(supervisorName)) return 'Monaco';
  if (kyalamiSupervisors.includes(supervisorName)) return 'Kyalami';
  return supervisorName.charCodeAt(0) % 2 === 0 ? 'Monaco' : 'Kyalami';
};

const getPerformanceLevel = (achievementRate) => {
  if (achievementRate >= 120) return 'Superstar';
  if (achievementRate >= 100) return 'Target Achieved';
  if (achievementRate >= 80) return 'On Track';
  if (achievementRate >= 60) return 'Needs Boost';
  return 'Recovery Mode';
};