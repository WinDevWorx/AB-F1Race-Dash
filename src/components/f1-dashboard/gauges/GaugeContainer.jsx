import GaugeDisplay from "./GaugeDisplay";
import GaugeMetrics from "./GaugeMetrics";
import styles from "./GaugeContainer.module.css";
import PointsChestView from "./PointsChestView";

export default function GaugeContainer({ data }) {
  if (!data || !data.companyMetrics || !data.pointsData) {
    return null;
  }

  const { companyMetrics } = data;



  // Debug logging to trace the data flow
  console.log("GaugeContainer received data:", data);
  console.log("GaugeContainer companyMetrics:", companyMetrics);
  console.log(
    "Sales values - Actual:",
    companyMetrics.totalSalesActual,
    "Target:",
    companyMetrics.totalSalesTarget
  );

  // Prepare data for 4 gauges
  const gaugeData = [
    {
      title: "Credit",
      currentValue:
        companyMetrics.totalSalesActual || companyMetrics.currentValue || 0,
      targetValue:
        companyMetrics.totalSalesTarget ||
        companyMetrics.targetValue ||
        240000000,
      averageAchievement:
        companyMetrics.salesAchievement ||
        companyMetrics.overallAchievement ||
        0,
    },
    /* NEW GAUGES AND VALUES*/
    {
      title: "MyWorld",
      currentValue:  companyMetrics.totalMyWorldFunded || 0,
      targetValue: companyMetrics.totalMyWorldTarget || 0,
      averageAchievement: companyMetrics.myWorldAchievement || 0,
    },
    {
      title: "Funeral",
      currentValue: companyMetrics.totalFuneralVol || 0,
      targetValue: companyMetrics.totalFuneralTarget || 0,
      averageAchievement: companyMetrics.funeralAchievement || 0,
    },

    /* New Gauge NO DATA YET  */
    {
      title: "Investments",
      currentValue: 0 || 0,
      targetValue: 115,
      averageAchievement: 5 || 0,
    },
  ];

  return (
    <>
      <h2 className={`${styles.title} ${styles.Slackey}`}>PERFORMANCE TARGET OVERVIEW</h2>
      <div className={styles.container}>
        <div className={styles.header}>
     
        </div>

        {/* Always use 2x2 grid, but adjust sizing based on screen size */}
        <div className={styles.gaugesGrid}>
          {gaugeData.map((gauge, index) => (
            <div key={index} className={styles.gaugeItem}>
              <GaugeDisplay
                title={gauge.title}
                currentValue={gauge.currentValue}
                targetValue={gauge.targetValue}
                averageAchievement={gauge.averageAchievement}
              />
            </div>
          ))}
        </div>


      </div>

      <h3 className={`${styles.title} ${styles.Slackey}`}> Championship Pool</h3>
      <div className={styles.container}>
        <PointsChestView pointsData={data.pointsData} />
      </div>
    </>
  );
}
