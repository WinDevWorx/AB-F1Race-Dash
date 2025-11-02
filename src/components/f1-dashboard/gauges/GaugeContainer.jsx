import GaugeDisplay from './GaugeDisplay';
import GaugeMetrics from './GaugeMetrics';
import styles from './GaugeContainer.module.css';

export default function GaugeContainer({ data }) {
if (!data || !data.companyMetrics) {
return null;
}

const { companyMetrics } = data;

// Debug logging to trace the data flow
console.log('GaugeContainer received data:', data);
console.log('GaugeContainer companyMetrics:', companyMetrics);
console.log('Sales values - Actual:', companyMetrics.totalSalesActual, 'Target:', companyMetrics.totalSalesTarget);

return (
<div className={styles.container}>
<div className={styles.header}>
<h2 className={styles.title}>GOAL SCORING PROGRESS</h2>
<p className={styles.subtitle}>Team Performance Dashboard</p>
</div>
      
  <div className={styles.content}>
    <GaugeDisplay 
      currentValue={companyMetrics.totalSalesActual || companyMetrics.currentValue || 0}
      targetValue={companyMetrics.totalSalesTarget || companyMetrics.targetValue || 240000000}
      averageAchievement={companyMetrics.salesAchievement || companyMetrics.overallAchievement || 0}
    />
    
    <GaugeMetrics 
      totalConsultants={companyMetrics.totalConsultants}
      totalSupervisors={companyMetrics.totalSupervisors}
      totalRealApps={companyMetrics.totalAppsActual}
      totalTarget={companyMetrics.totalAppsTarget}
      totalSales={companyMetrics.totalSalesActual || companyMetrics.currentValue || 0}
      totalSalesTarget={companyMetrics.totalSalesTarget || companyMetrics.targetValue || 240000000}
      averageAchievement={companyMetrics.salesAchievement || companyMetrics.overallAchievement || 0}
    />
  </div>
</div>
  );
}