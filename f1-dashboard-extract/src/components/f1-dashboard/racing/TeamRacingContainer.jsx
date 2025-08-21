import { useState } from 'react';
import TeamRacingView from './TeamRacingView';
import styles from './TeamRacingContainer.module.css';

export default function TeamRacingContainer({ data }) {
  const [activeCircuit, setActiveCircuit] = useState('Monaco');

  if (!data || !data.supervisors || !data.consultants) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading Team Racing Data...</p>
        </div>
      </div>
    );
  }

  // Split supervisors by circuits for racing view
  const monacoSupervisors = data.supervisors
    .filter(supervisor => supervisor.circuit === 'Monaco')
    .sort((a, b) => (b.salesAchievement || 0) - (a.salesAchievement || 0));
    
  const kyalamiSupervisors = data.supervisors
    .filter(supervisor => supervisor.circuit === 'Kyalami')
    .sort((a, b) => (b.salesAchievement || 0) - (a.salesAchievement || 0));

  const monacoConsultants = data.consultants
    .filter(consultant => consultant.circuit === 'Monaco')
    .sort((a, b) => (b.salesAchievement || 0) - (a.salesAchievement || 0));
    
  const kyalamiConsultants = data.consultants
    .filter(consultant => consultant.circuit === 'Kyalami')
    .sort((a, b) => (b.salesAchievement || 0) - (a.salesAchievement || 0));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>TEAM RACING CHAMPIONSHIP</h2>
        <p className={styles.subtitle}>Live Circuit Standings • Monaco vs Kyalami</p>
      </div>

      <div className={styles.circuitTabs}>
        <button
          className={`${styles.tabButton} ${activeCircuit === 'Monaco' ? styles.active : ''}`}
          onClick={() => setActiveCircuit('Monaco')}
          data-testid="monaco-tab"
        >
          🏎️ Monaco Circuit
        </button>
        <button
          className={`${styles.tabButton} ${activeCircuit === 'Kyalami' ? styles.active : ''}`}
          onClick={() => setActiveCircuit('Kyalami')}
          data-testid="kyalami-tab"
        >
          🏎️ Kyalami Circuit
        </button>
        <button
          className={`${styles.tabButton} ${activeCircuit === 'Championship' ? styles.active : ''}`}
          onClick={() => setActiveCircuit('Championship')}
          data-testid="championship-tab"
        >
          🏆 Complete Standings
        </button>
      </div>

      {activeCircuit === 'Monaco' && (
        <TeamRacingView
          circuit="Monaco"
          supervisors={monacoSupervisors}
          consultants={monacoConsultants}
        />
      )}

      {activeCircuit === 'Kyalami' && (
        <TeamRacingView
          circuit="Kyalami"
          supervisors={kyalamiSupervisors}
          consultants={kyalamiConsultants}
        />
      )}

      {activeCircuit === 'Championship' && (
        <TeamRacingView
          circuit="Championship"
          allSupervisors={data.supervisors ? [...data.supervisors].sort((a, b) => (b.salesAchievement || 0) - (a.salesAchievement || 0)) : []}
        />
      )}
    </div>
  );
}