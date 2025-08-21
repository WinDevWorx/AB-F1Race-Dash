import styles from './GaugeMetrics.module.css';

export default function GaugeMetrics({ 
  totalConsultants, 
  totalSupervisors, 
  totalRealApps, 
  totalTarget,
  averageAchievement 
}) {
  const metrics = [
    {
      id: 'consultants',
      label: 'Consultants',
      value: totalConsultants || 0,
      icon: '👥',
      color: '#22c55e'
    },
    {
      id: 'supervisors',
      label: 'Supervisors',
      value: totalSupervisors || 0,
      icon: '👨‍💼',
      color: '#3b82f6'
    },
    {
      id: 'real-apps',
      label: 'Real Apps',
      value: totalRealApps || 0,
      icon: '📋',
      color: '#f59e0b'
    },
    {
      id: 'target',
      label: 'Target',
      value: totalTarget || 0,
      icon: '🎯',
      color: '#ef4444'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {metrics.map(metric => (
          <div 
            key={metric.id} 
            className={styles.card}
            data-testid={`metric-${metric.id}`}
          >
            <div className={styles.cardHeader}>
              <span 
                className={styles.icon}
                style={{ color: metric.color }}
              >
                {metric.icon}
              </span>
              <span className={styles.label}>{metric.label}</span>
            </div>
            
            <div 
              className={styles.value}
              style={{ color: metric.color }}
            >
              {metric.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Overall Performance</span>
          <span 
            className={styles.summaryValue}
            style={{ 
              color: averageAchievement >= 100 ? '#22c55e' : 
                     averageAchievement >= 80 ? '#f59e0b' : '#ef4444'
            }}
          >
            {averageAchievement?.toFixed(1) || '0.0'}%
          </span>
        </div>
      </div>
    </div>
  );
}