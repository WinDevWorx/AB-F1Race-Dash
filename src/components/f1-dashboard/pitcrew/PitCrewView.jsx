import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import styles from "../../../styles/RacingComponents.module.css";

export default function PitCrewView({ consultants }) {
  console.log(consultants)
  const groupedConsultants = useMemo(() => {
    if (!consultants || consultants.length === 0) return {};

    // Group consultants by their supervisor (team field)
    return consultants.reduce((groups, consultant) => {
      const supervisorName = consultant.supervisorName || "Unknown Supervisor";
      if (!groups[supervisorName]) {
        groups[supervisorName] = [];
      }
      groups[supervisorName].push(consultant);
      return groups;
    }, {});
  }, [consultants]);

  // add filter By achievement , apps,  add auto scroll to the pit view and main dash

  const getPerformanceIcon = (salesAchievement) => {
    if (salesAchievement >= 120) return "⭐";
    if (salesAchievement >= 100) return "🏆";
    if (salesAchievement >= 80) return "🔥";
    if (salesAchievement >= 60) return "⚡";
    return "🔧";
  };

  const getPerformanceColor = (salesAchievement) => {
    if (salesAchievement >= 120) return "#22c55e"; // green for superstar
    if (salesAchievement >= 100) return "#3b82f6"; // blue for target achieved
    if (salesAchievement >= 80) return "#f59e0b"; // yellow for on track
    if (salesAchievement >= 60) return "#f97316"; // orange for needs boost
    return "#ef4444"; // red for recovery mode
  };

  if (!consultants || consultants.length === 0) {
    return null;
  }

  return (
    <div className={styles.pitCrewView}>

      {/* <h2 className={styles.sectionTitle}>TEAM RACING CHAMPIONSHIP</h2>
      <p className={styles.sectionSubtitle}>Consultant Performance (PIT CREW)</p> */}

      <div className={styles.pitCrewContainer}>
        {Object.entries(groupedConsultants).map(
          ([supervisorName, teamMembers]) => {
            const sortedMembers = [...teamMembers].sort(
              (a, b) => (b.salesAchievement || 0) - (a.salesAchievement || 0),
            );

            return (
              <Card key={supervisorName} className={styles.pitCrewCard}>
                <CardHeader className={styles.pitCrewCardHeader}>
                  <CardTitle>🏎️ Driver: {supervisorName}</CardTitle>
                  <div className={styles.crewStats}>
                    Pit Crew Size: {teamMembers.length} | Avg Performance:{" "}
                    {(
                      teamMembers.reduce(
                        (sum, m) => sum + (m.salesAchievement || 0),
                        0,
                      ) / teamMembers.length
                    ).toFixed(1)}
                    % | Total Apps:{" "}
                    {teamMembers.reduce(
                      (sum, m) => sum + (m.real_apps_vol || 0),
                      0,
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className={styles.crewGrid}>
                    {sortedMembers.map((consultant, index) => (
                      <div
                        key={consultant.id}
                        className={styles.crewMember}
                        style={{
                          borderColor: getPerformanceColor(
                            consultant.salesAchievement || 0,
                          ),
                          backgroundColor: `${getPerformanceColor(consultant.salesAchievement || 0)}15`,
                        }}
                        data-testid={`crew-member-${consultant.id}`}
                      >
                        <div className={styles.memberHeader}>
                          <span className={styles.memberIcon}>
                            {getPerformanceIcon(
                              consultant.salesAchievement || 0,
                            )}
                          </span>
                          <span className={styles.memberPosition}>
                            #{index + 1}
                          </span>
                        </div>

                        <div className={styles.memberInfo}>
                          <div
                            className={styles.memberName}
                            data-testid={`member-name-${consultant.id}`}
                          >
                            {consultant.consultantName}
                          </div>
                          <div className={styles.memberSales}>
                            Target:R
                            {((consultant.salesTarget || 0) / 1000000).toFixed(1)} M
                          </div>
                          <div className={styles.memberSales}>
                            Real Apps Target: {consultant.appsTarget || "Consultant"}
                          </div>
                          <br />
                          <div className={styles.memberSales}>
                            KRA Financial Metrics
                          </div>
                          <div className={styles.memberSales}>
                            Disbursed Credit Sales:
                          </div>
                          <div
                            className={styles.memberAchievement}
                            style={{
                              color: getPerformanceColor(
                                consultant.salesAchievement || 0,
                              ),
                            }}
                          >
                            {(consultant.salesAchievement || 0).toFixed(1)}%
                          </div>
                        </div>

                        <div className={styles.memberStats}>
                          <div className={styles.memberAchievement}>
                            Real Apps Achievement:
                          </div>
                          <div
                            className={styles.memberAchievement}
                            style={{
                              color: getPerformanceColor(
                                consultant.appsAchievement || 0,
                              ),
                            }}
                          >
                            {(consultant.appsAchievement || 0).toFixed(1)}%
                          </div>
                          <div className={styles.memberSales}>

                          Estimated Weighted Score: 
                          </div>
                          <div className={styles.memberPerformance}>
                            Performance Level: {consultant.performanceLevel || "Unknown"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          },
        )}
      </div>
    </div>
  );
}