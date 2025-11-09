import React from 'react';
import styles from './PointsChest.module.css';

export default function PointsChestView() {
  const chestData = [
    { title: "Credit Loans", points: 500 },
    { title: "Credit Card", points: 350 },
    { title: "MyWorld", points: 800 },
    { title: "Funeral Cover", points: 250 },
    { title: "Investments", points: 600 }
  ];

  return (
    <div className={styles.container}>
      {chestData.map((item, index) => (
        <div key={index} className={styles.gridItem}>
          <h2 className={styles.itemTitle}>{item.title}</h2>
          
          <div className={styles.chestWrapper}>
            <div className={styles.chestIcon}>
              <img 
                src="/treasure-chest.png" 
                alt="Treasure Chest" 
                className={styles.chestImage}
              />
            </div>
            
            {/* Animated Coins 
            <div
              className={`${styles.coin} ${styles.coinAnimated}`}
              style={{
                '--coin-to-x': 'calc(-100px + 32px)',
                '--coin-to-y': 'calc(-105px + 32px)',
                '--coin-delay': '0.3s'
              }}
            ></div> 
            {/* <div
              className={`${styles.coin} ${styles.coinAnimated}`}
              style={{
                '--coin-to-x': 'calc(-70px + 32px)',
                '--coin-to-y': '-90px',
                '--coin-delay': '0.1s'
              }}
            ></div>
            <div
              className={`${styles.coin} ${styles.coinAnimated}`}
              style={{
                '--coin-to-x': 'calc(-30px + 32px)',
                '--coin-to-y': '-125px',
                '--coin-delay': '0s'
              }}
            ></div> 
            {/* <div
              className={`${styles.coin} ${styles.coinAnimated}`}
              style={{
                '--coin-to-x': 'calc(10px + 32px)',
                '--coin-to-y': '-130px',
                '--coin-delay': '0.2s'
              }}
            ></div>
            <div
              className={`${styles.coin} ${styles.coinAnimated}`}
              style={{
                '--coin-to-x': 'calc(30px + 32px)',
                '--coin-to-y': '-100px',
                '--coin-delay': '0.1s'
              }}
            ></div>
            <div
              className={`${styles.coin} ${styles.coinAnimated}`}
              style={{
                '--coin-to-x': 'calc(70px + 32px)',
                '--coin-to-y': '-95px',
                '--coin-delay': '0.4s'
              }}
            ></div> 
            {/* <div
              className={`${styles.coin} ${styles.coinAnimated}`}
              style={{
                '--coin-to-x': 'calc(100px + 32px)',
                '--coin-to-y': '-100px',
                '--coin-delay': '0.2s'
              }}
            ></div> */}
          </div>
          
          <div className={styles.pointsDisplay}>{item.points} Points</div>
        </div>
      ))}
    </div>
  );
}