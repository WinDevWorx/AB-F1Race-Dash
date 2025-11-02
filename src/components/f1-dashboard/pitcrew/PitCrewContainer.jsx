import PitCrewHighlights from './PitCrewHighlights';
import PitCreView from './PitCrewView';
import styles from './PitCrewContainer.module.css';

export default function PitCrewContainer({ data }) {
  if (!data || !data.consultants) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>PIT CREW HIGHLIGHTS</h2>
      </div>
      
      <PitCrewHighlights consultants={data.consultants} />
    </div>
  );
}