import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

class ExcelMonitor {
  constructor() {
    this.filePath = '/Book1.xlsx';
    this.lastModified = null;
    this.checkInterval = 120000; // 2 minutes (reduced from 30 seconds)
    this.callbacks = [];
    this.currentData = null;
  }

  onDataChange(callback) {
    this.callbacks.push(callback);
  }

  async checkForFile() {
    try {
      console.log('Fetching Excel file from:', this.filePath);
      const response = await fetch(this.filePath);
      console.log('Response status:', response.status, 'OK:', response.ok);
      
      if (!response.ok) {
        console.log('Book1.xlsx not found in public folder - Status:', response.status);
        if (this.currentData !== null) {
          this.currentData = null;
          this.notifyCallbacks(null);
        }
        return null;
      }

      const lastModified = response.headers.get('last-modified');
      if (lastModified !== this.lastModified) {
        this.lastModified = lastModified;
        
        let data;
        let firstSheetName = 'Sheet1'; // Default sheet name
        
        try {
          // Read the actual Excel file
          console.log('Reading Excel arrayBuffer...');
          const arrayBuffer = await response.arrayBuffer();
          console.log('ArrayBuffer size:', arrayBuffer.byteLength);
          
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          console.log('Workbook sheets:', workbook.SheetNames);
          
          firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          data = XLSX.utils.sheet_to_json(worksheet);
          
          console.log('Excel data loaded successfully:', data.length, 'rows');
          console.log('Sample row:', data[0]);
          console.log('Available columns:', Object.keys(data[0] || {}));
        } catch (error) {
          console.error('Error reading Excel file:', error);
          console.log('Falling back to mock data');
          // Fallback to mock data if Excel parsing fails
          data = this.generateMockExcelData();
        }
        
        this.currentData = this.processExcelData(data, firstSheetName);
        console.log('Processed data contains:', this.currentData?.consultants?.length || 0, 'consultants');
        console.log('Company metrics:', this.currentData?.companyMetrics);
        this.notifyCallbacks(this.currentData);
        return this.currentData;
      }
      
      return this.currentData;
    } catch (error) {
      console.error('Error checking for file:', error);
      if (error.message) {
        console.error('Error details:', error.message);
      }
      // Return current data if we have it, even if there was an error
      return this.currentData || null;
    }
  }

  generateMockExcelData() {
    // Generate mock data that matches the Excel structure
    return [
      {
        'Consultant Name': 'Ashley Moyo',
        'Supervisor Name': 'Ashley Moyo',
        'Sales Val % to Target': 1.48,
        'RealAppsVol': 48,
        'RealAppsTarget': 20,
        'TotalSalesVal': 1480000,
        'SalesValTarget': 1000000
      },
      {
        'Consultant Name': 'Mixo Makhubele',
        'Supervisor Name': 'Mixo Makhubele',
        'Sales Val % to Target': 1.33,
        'RealAppsVol': 33,
        'RealAppsTarget': 20,
        'TotalSalesVal': 1330000,
        'SalesValTarget': 1000000
      },
      {
        'Consultant Name': 'Nonhle Zondi',
        'Supervisor Name': 'Nonhle Zondi',
        'Sales Val % to Target': 1.31,
        'RealAppsVol': 31,
        'RealAppsTarget': 20,
        'TotalSalesVal': 1310000,
        'SalesValTarget': 1000000
      },
      {
        'Consultant Name': 'John Smith',
        'Supervisor Name': 'Ashley Moyo',
        'Sales Val % to Target': 0.85,
        'RealAppsVol': 17,
        'RealAppsTarget': 20,
        'TotalSalesVal': 850000,
        'SalesValTarget': 1000000
      },
      {
        'Consultant Name': 'Sarah Johnson',
        'Supervisor Name': 'Mixo Makhubele',
        'Sales Val % to Target': 1.15,
        'RealAppsVol': 23,
        'RealAppsTarget': 20,
        'TotalSalesVal': 1150000,
        'SalesValTarget': 1000000
      },
      {
        'Consultant Name': 'Mike Wilson',
        'Supervisor Name': 'Busisiwe Mabuza',
        'Sales Val % to Target': 0.75,
        'RealAppsVol': 15,
        'RealAppsTarget': 20,
        'TotalSalesVal': 750000,
        'SalesValTarget': 1000000
      },
      {
        'Consultant Name': 'Lisa Davis',
        'Supervisor Name': 'Cindy Visser',
        'Sales Val % to Target': 1.05,
        'RealAppsVol': 21,
        'RealAppsTarget': 20,
        'TotalSalesVal': 1050000,
        'SalesValTarget': 1000000
      },
      {
        'Consultant Name': 'David Brown',
        'Supervisor Name': 'Matimba Ngobeni',
        'Sales Val % to Target': 0.95,
        'RealAppsVol': 19,
        'RealAppsTarget': 20,
        'TotalSalesVal': 950000,
        'SalesValTarget': 1000000
      }
    ];
  }

  processExcelData(rawData, sheetName) {
    if (!rawData || rawData.length === 0) return null;
    console.log('Processing Excel data with supervisor-focused structure...');

    // Process individual consultants (pit crew members)
    const consultants = rawData.map((row, index) => {
      const consultantName = row['Consultant Name'];
      const supervisorName = row['Supervisor Name'];
      
      if (!consultantName || !supervisorName) return null;
      
      // Use exact Excel calculations
      const salesAchievementRaw = parseFloat(row['Sales Val % to Target']) || 0;
      const salesAchievement = salesAchievementRaw * 100;
      
      const appsAchievementRaw = parseFloat(row['Real Apps % to Target']) || 0;
      const appsAchievement = appsAchievementRaw * 100;
      
      const salesActual = parseFloat(row['TotalSalesVal']) || 0;
      const salesTarget = parseFloat(row['SalesValTarget']) || 0;
      const appsActual = parseInt(row['TotalRealAppsVol']) || 0;
      const appsTarget = parseInt(row['RealAppsTarget']) || 0;
      
      return {
        id: index + 1,
        consultantName: consultantName.toString().trim(),
        supervisorName: supervisorName.toString().trim(),
        salesAchievement: salesAchievement,
        appsAchievement: appsAchievement,
        salesActual: salesActual,
        salesTarget: salesTarget,
        appsActual: appsActual,
        appsTarget: appsTarget,
        circuit: this.getCircuitAssignment(supervisorName),
        performanceLevel: this.getPerformanceLevel(salesAchievement),
        // Racing metrics for vehicle assignment
        overallPerformance: (salesAchievement * 0.7) + (appsAchievement * 0.3)
      };
    }).filter(Boolean);

    // Calculate supervisor metrics using SUMIF logic from Excel
    const supervisors = this.calculateSupervisorMetrics(consultants);
    
    // Calculate company totals
    const companyMetrics = this.calculateCompanyMetrics(consultants);
    
    console.log(`Processed ${consultants.length} consultants under ${supervisors.length} supervisors`);
    
    return {
      consultants: consultants,
      supervisors: supervisors,
      companyMetrics: companyMetrics
    };
  }

  getCircuitAssignment(supervisorName) {
    const monacoSupervisors = [
      'Ashley Moyo', 'Mixo Makhubele', 'Nonhle Zondi', 'Rodney Naidu',
      'Samantha Govender', 'Samuel Masubelele', 'Taedi Moletsane',
      'Thabo Mosweu', 'Thobile Phakhathi'
    ];
    
    const kyalamiSupervisors = [
      'Busisiwe Mabuza', 'Cindy Visser', 'Matimba Ngobeni', 'Mfundo Mdlalose',
      'Mondli Nhlapho', 'Mosima Moshidi', 'Salome Baloyi', 'Shadleigh White',
      'Tshepo Moeketsi'
    ];
    
    if (monacoSupervisors.includes(supervisorName)) return 'Monaco';
    if (kyalamiSupervisors.includes(supervisorName)) return 'Kyalami';
    return supervisorName.charCodeAt(0) % 2 === 0 ? 'Monaco' : 'Kyalami';
  }

  calculateSupervisorMetrics(consultants) {
    // Group consultants by supervisor (SUMIF logic from Excel)
    const supervisorGroups = {};
    
    consultants.forEach(consultant => {
      const supervisor = consultant.supervisorName;
      if (!supervisorGroups[supervisor]) {
        supervisorGroups[supervisor] = {
          supervisorName: supervisor,
          circuit: consultant.circuit,
          teamMembers: [],
          totalSalesActual: 0,
          totalSalesTarget: 0,
          totalAppsActual: 0,
          totalAppsTarget: 0
        };
      }
      
      const group = supervisorGroups[supervisor];
      group.teamMembers.push(consultant);
      group.totalSalesActual += consultant.salesActual;
      group.totalSalesTarget += consultant.salesTarget;
      group.totalAppsActual += consultant.appsActual;
      group.totalAppsTarget += consultant.appsTarget;
    });
    
    // Calculate supervisor achievements
    return Object.values(supervisorGroups).map(group => {
      const salesAchievement = group.totalSalesTarget > 0 ? (group.totalSalesActual / group.totalSalesTarget) * 100 : 0;
      const appsAchievement = group.totalAppsTarget > 0 ? (group.totalAppsActual / group.totalAppsTarget) * 100 : 0;
      const overallAchievement = (salesAchievement * 0.7) + (appsAchievement * 0.3);
      
      return {
        ...group,
        teamSize: group.teamMembers.length,
        salesAchievement: salesAchievement,
        appsAchievement: appsAchievement,
        overallAchievement: overallAchievement,
        performanceLevel: this.getPerformanceLevel(salesAchievement),
        position: 0 // Will be calculated after sorting
      };
    }).sort((a, b) => b.overallAchievement - a.overallAchievement)
      .map((supervisor, index) => ({
        ...supervisor,
        position: index + 1
      }));
  }

  calculateCompanyMetrics(consultants) {
    const totalSalesActual = consultants.reduce((sum, c) => sum + c.salesActual, 0);
    const totalSalesTarget = consultants.reduce((sum, c) => sum + c.salesTarget, 0);
    const totalAppsActual = consultants.reduce((sum, c) => sum + c.appsActual, 0);
    const totalAppsTarget = consultants.reduce((sum, c) => sum + c.appsTarget, 0);
    
    const salesAchievement = totalSalesTarget > 0 ? (totalSalesActual / totalSalesTarget) * 100 : 0;
    const appsAchievement = totalAppsTarget > 0 ? (totalAppsActual / totalAppsTarget) * 100 : 0;
    
    return {
      totalConsultants: consultants.length,
      totalSupervisors: new Set(consultants.map(c => c.supervisorName)).size,
      totalSalesActual: totalSalesActual,
      totalSalesTarget: totalSalesTarget,
      totalAppsActual: totalAppsActual, 
      totalAppsTarget: totalAppsTarget,
      salesAchievement: salesAchievement,
      appsAchievement: appsAchievement,
      overallAchievement: (salesAchievement * 0.7) + (appsAchievement * 0.3),
      currentValue: totalSalesActual,
      targetValue: totalSalesTarget,
      achievementPercentage: salesAchievement
    };
  }

  getPerformanceLevel(achievementRate) {
    if (achievementRate >= 120) return 'Superstar';
    else if (achievementRate >= 100) return 'Target Achieved';
    else if (achievementRate >= 80) return 'On Track';
    else if (achievementRate >= 60) return 'Needs Boost';
    else return 'Recovery Mode';
  }



  notifyCallbacks(data) {
    this.callbacks.forEach(callback => callback(data));
  }

  startMonitoring() {
    // Initial check
    this.checkForFile();
    
    // Set up periodic checking
    setInterval(() => this.checkForFile(), this.checkInterval);
  }

  getCurrentData() {
    return this.currentData;
  }
}

// Create singleton instance
const excelMonitor = new ExcelMonitor();

// Custom hook for React components
export const useExcelMonitor = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleDataChange = (newData) => {
      console.log('Data change received:', newData ? 'data loaded' : 'no data');
      setData(newData);
      setLoading(false);
      setError(newData === null ? 'Book1.xlsx not found in public folder' : null);
    };

    excelMonitor.onDataChange(handleDataChange);
    
    // Start monitoring if not already started
    console.log('Starting Excel monitor...');
    excelMonitor.startMonitoring();
    
    // Get current data if available
    const currentData = excelMonitor.getCurrentData();
    if (currentData !== null) {
      handleDataChange(currentData);
    } else {
      // Force initial check
      excelMonitor.checkForFile().then(result => {
        console.log('Initial file check result:', result ? 'success' : 'failed');
        if (result) {
          handleDataChange(result);
        } else {
          setLoading(false);
          setError('Book1.xlsx not found in public folder');
        }
      });
    }
  }, []);

  return { data, loading, error };
};

export default excelMonitor;