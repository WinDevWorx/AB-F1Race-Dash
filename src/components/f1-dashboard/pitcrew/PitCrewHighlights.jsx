import { useMemo } from 'react';
import styles from './PitCrewHighlights.module.css';



export default function PitCrewHighlights({ consultants }) {
  const performanceCategories = useMemo(() => {
    if (!consultants || consultants.length === 0) return [];

    const today = new Date().getDate();


    

    const categories = [
      {
        id: 'podium-pushers',
        name: 'Podium Pushers',
        description: 'Elite Performers (120%+)',
        icon: '🏆',
        color: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        filter: (c) => (c.salesAchievement || c.achievementRate || 0) >= 120,
        carColor: '#22c55e'
      },
      {
        id: 'pit-masters',
        name: 'Pit Masters', 
        description: 'Target Achievers (100-119%)',
        icon: '🏁',
        color: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        filter: (c) => {
          const achievement = c.salesAchievement || c.achievementRate || 0;
          return achievement >= 100 && achievement < 120;
        },
        carColor: '#3b82f6'
      },
      {
        id: 'pit-stabilizers',
        name: 'Pit Crew Stabilizers',
        description: 'On Track (80-99%)',
        icon: '🛣️',
        color: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        filter: (c) => {
          const achievement = c.salesAchievement || c.achievementRate || 0;
          return achievement >= 80 && achievement < 100;
        },
        carColor: '#f59e0b'
      },
      {
        id: 'boost-needed',
        name: 'Boost Needed',
        description: 'Needs Support (60-79%)',
        icon: '⛽',
        color: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        filter: (c) => {
          const achievement = c.salesAchievement || c.achievementRate || 0;
          return achievement >= 60 && achievement < 80;
        },
        carColor: '#f97316'
      },
      {
        id: 'recovery-mode',
        name: 'Recovery Mode',
        description: 'Critical Support (<60%)',
        icon: '🛠️',
        color: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        // filter: (c) => (c.salesAchievement || c.achievementRate || 0) < 60,
        // ADD RANGE HERE TO EXCLUDE UPER BOUND VALUES OF THE BELOW CAT. achievement >= 60 && achievement 
        filter: (c) => {  const achievement = c.salesAchievement || c.achievementRate  ; return achievement < 60;},
        carColor: '#ef4444'
      },
      {
        id: 'starting-Block',
        name: 'Starting Block',
        description: 'Starting Block(<35%) ',
        icon: '🧱',
        color: '#a642f8ff',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        // ADD A RANGE HERE 
        filter: (c) => { if (today <= 7 ) return false; const achievement = c.salesAchievement || c.achievementRate || 0 ; return achievement < 10;},
        carColor: '#ef4444'
      }
    ];

    return categories.map(category => {
      {/* 
        var dateNow = new Date()
        var dateThreshold = new Date(MM-DD-YY)

        */}
      const members = consultants.filter(category.filter);
      const avgPerformance = members.length > 0 
        ? members.reduce((sum, m) => sum + (m.salesAchievement || m.achievementRate || 0), 0) / members.length 
        : 0;
      
      return {
        ...category,
        count: members.length,
        members: members.slice(0, 6), // Show top 2 performers
        avgPerformance
      };
    });
  }, [consultants]);

  return (
    <div className={styles.container}>
      {performanceCategories.map(category => (
        <div 
          key={category.id}
          className={styles.categoryCard}
          style={{ 
            backgroundColor: category.backgroundColor,
            borderColor: category.color
          }}
          data-testid={`category-${category.id}`}
        >
          <div className={styles.cardHeader}>
            <div className={styles.iconSection}>
              <span 
                className={styles.carIcon}
                style={{ color: category.carColor }}
              >
                {category.icon}
              </span>
              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryDescription}>{category.description}</p>
              </div>
            </div>
            
            <div className={styles.countBadge}>
              <span className={styles.countNumber}>{category.count}</span>
              <span className={styles.countLabel}>Consultants</span>
            </div>
          </div>

          <div className={styles.performanceBar}>
            <div className={styles.barTrack}>
              <div 
                className={styles.barFill}
                style={{ 
                  width: `${Math.min(category.avgPerformance, 100)}%`,
                  backgroundColor: category.color
                }}
              />
            </div>
            <div className={styles.performanceText}>
              Avg: {category.avgPerformance.toFixed(1)}%
            </div>
          </div>

          {category.members.length > 0 && (
            <div className={styles.membersList}>
              {category.members.filter(member => member && (member.consultantName || member.name)).map((member, index) => {
                const memberName = member.consultantName || member.name || 'Unknown';
                const achievement = member.salesAchievement || member.achievementRate || 0;
                
                return (
                  <div key={member.id || index} className={styles.memberTag}>
                    <span className={styles.memberName}>
                      {memberName.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <span 
                      className={styles.memberPerformance}
                      style={{ color: category.color }}
                    >
                      {achievement.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
              {/* {category.count > 2 && (
                <div className={styles.moreMembers}>
                  +{category.count - 2} more
                </div>
              )} */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}