import styles from './TeamRacingView.module.css';

export default function TeamRacingView({ circuit, supervisors, consultants, allSupervisors = [] }) {
  const getPerformanceColor = (achievement) => {
    if (achievement >= 100) return '#22c55e';
    if (achievement >= 80) return '#3b82f6'; 
    if (achievement >= 60) return '#f59e0b';
    if (achievement >= 40) return '#f97316';
    return '#ef4444';
  };

  const getStatusBadge = (achievement) => {
    if (achievement >= 100) return { text: '100%+', color: '#22c55e' };
    if (achievement >= 80) return { text: `${achievement.toFixed(1)}%`, color: '#3b82f6' };
    if (achievement >= 60) return { text: `${achievement.toFixed(1)}%`, color: '#f59e0b' };
    if (achievement >= 40) return { text: `${achievement.toFixed(1)}%`, color: '#f97316' };
    return { text: `${achievement.toFixed(1)}%`, color: '#ef4444' };
  };

  // Show Championship Standings table if we have all supervisors data
  if (circuit === 'Championship' && allSupervisors && allSupervisors.length > 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.circuitName}>
            🏆 Complete Championship Standings
          </h3>
          <p className={styles.subtitle}>All supervisors ranked by performance</p>
        </div>

        <div className={styles.championshipTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Position</div>
            <div className={styles.headerCell}>Driver (Supervisor)</div>
            <div className={styles.headerCell}>Circuit</div>
            <div className={styles.headerCell}>Team Size</div>
            <div className={styles.headerCell}>Achievement</div>
            <div className={styles.headerCell}>Sales</div>
            <div className={styles.headerCell}>Target</div>
            <div className={styles.headerCell}>Vehicle</div>
          </div>
          
          <div className={styles.tableBody}>
            {allSupervisors.map((supervisor, index) => {
              const supervisorName = supervisor.supervisorName || supervisor.supervisor_name || supervisor.name || 'Unknown';
              const achievement = supervisor.salesAchievement || supervisor.team_achievement_rate || 0;
              const teamSize = supervisor.teamSize || supervisor.team_size || 0;
              const salesActual = supervisor.totalSalesActual || supervisor.total_sales || supervisor.totalSalesVal || 0;
              const salesTarget = supervisor.totalSalesTarget || supervisor.team_target || supervisor.salesValTarget || 1;
              const circuit = supervisor.circuit || 'Unknown';
              
              return (
                <div 
                  key={supervisor.id || index}
                  className={styles.tableRow}
                  data-testid={`championship-row-${index}`}
                >
                  <div className={styles.tableCell}>
                    <div className={styles.positionContainer}>
                      <span 
                        className={styles.positionNumber}
                        style={{ color: getPerformanceColor(achievement) }}
                      >
                        {index + 1}
                      </span>
                      {index < 3 && <span className={styles.trophy}>🏆</span>}
                    </div>
                  </div>
                  <div className={styles.tableCell}>
                    <div className={styles.driverInfo}>
                      <div className={styles.driverName}>{supervisorName}</div>
                      <div className={styles.teamMeta}>
                        Team Size: {teamSize} | Avg: {achievement.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className={styles.tableCell}>
                    <span 
                      className={styles.circuitBadge}
                      style={{ 
                        color: circuit.toLowerCase() === 'monaco' ? '#FF6B35' : '#4ECDC4'
                      }}
                    >
                      {circuit}
                    </span>
                  </div>
                  <div className={styles.tableCell}>
                    <span>{teamSize}</span>
                  </div>
                  <div className={styles.tableCell}>
                    <span 
                      className={styles.achievementRate}
                      style={{ color: getPerformanceColor(achievement) }}
                    >
                      {achievement.toFixed(1)}%
                    </span>
                  </div>
                  <div className={styles.tableCell}>
                    <span className={styles.salesAmount}>
                      R{(salesActual / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className={styles.tableCell}>
                    <span className={styles.targetAmount}>
                      R{(salesTarget / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className={styles.tableCell}>
                    <span className={styles.vehicleIcon}>⚽</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Show circuit-specific racing view
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.trackInfo}>
          <h3 className={styles.circuitName}>
            🏁 Live Positions - {circuit} Circuit
          </h3>
          <div className={styles.liveTiming}>
            <span className={styles.liveIndicator}>●</span>
            Live Timing
          </div>
        </div>
      </div>

      <div className={styles.racingBoard}>
        {(supervisors || []).map((supervisor, index) => {
          const supervisorName = supervisor.supervisorName || supervisor.supervisor_name || supervisor.name || 'Unknown';
          const achievement = supervisor.salesAchievement || supervisor.team_achievement_rate || 0;
          const teamSize = supervisor.teamSize || supervisor.team_size || 0;
          const salesActual = supervisor.totalSalesActual || supervisor.total_sales || supervisor.totalSalesVal || 0;
          const salesTarget = supervisor.totalSalesTarget || supervisor.team_target || supervisor.salesValTarget || 1;
          const status = getStatusBadge(achievement);
          
          return (
            <div 
              key={supervisor.id || index}
              className={styles.driverRow}
              data-testid={`driver-row-${index}`}
            >
              <div className={styles.positionSection}>
                <div className={styles.positionNumber}>
                  {index + 1}
                </div>
              </div>

              <div className={styles.driverInfo}>
                <div className={styles.driverName}>
                  {supervisorName}
                </div>
                <div className={styles.teamInfo}>
                  Team Size: {teamSize} | Avg: {achievement.toFixed(1)}%
                </div>
              </div>

              <div className={styles.performanceBar}>
                <div 
                  className={styles.progressFill}
                  style={{ 
                    width: `${Math.min(achievement, 100)}%`,
                    backgroundColor: getPerformanceColor(achievement)
                  }}
                >
                  <span 
                    className={styles.performanceBadge}
                    style={{ backgroundColor: status.color }}
                  >
                    {status.text}
                  </span>
                </div>
                <div 
                  className={styles.vehiclePosition}
                  style={{ 
                    left: `${Math.min(achievement, 100)}%`
                  }}
                >
                  <span className={styles.vehicleIcon}>⚽</span>
                </div>
              </div>

              <div className={styles.salesData}>
                <div className={styles.currentSales}>
                  R{(salesActual / 1000000).toFixed(1)}M
                </div>
                <div className={styles.targetSales}>
                  Target: R{(salesTarget / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.finishLine}>
        <div className={styles.finishText}>
          🏁 FINISH LINE - 100% TARGET 🏁
        </div>
      </div>

      {(!supervisors || supervisors.length === 0) && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⚽</div>
          <p className={styles.emptyText}>No drivers on {circuit} circuit</p>
        </div>
      )}
    </div>
  );
}