import styles from "../styles/Scripts.module.css";
import Link from "next/link";
import ProductPageHeader from "../components/ProductPageHeader";

export default function Products() {
  return (
    <>
      <ProductPageHeader />

      <div id="LOANS" className={styles.open_section}>
        <h1 className={styles.headline}>
          <mark className={styles.mark}>LOAN PRODUCTS</mark>
        </h1>
      </div>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h2>Personal Loan</h2>
          <h4>
            <u>Personal Loan Features</u>
          </h4>
          <ul>
            <li>Personal Loans Up To R350 000</li>
            <br />
            <li>
              We deposit your Loan straight into your own secure MyWorld
              account.
            </li>
            <br />
            <li>You can choose to repay your loan over 7 to 72 months</li>
            <br />
            <li>You know exactly how much you will be repaying each month</li>
            <br />
            <li>
              You can choose to apply online, over the phone or you can choose
              to visit your nearest branch.
            </li>
            <br />
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Consolidation Loan</h2>
          <h4>
            <u>Consolidation Loan Features</u>
          </h4>
          <ul>
            <li>
              Lock interest on your loans with a fixed interest rate and less
              fees on one loan repayment.
            </li>
            <br />
            <li>Consolidation Loan Up To R350 000</li>
            <br />
            <li>
              Improve your cash flow, repayment terms from 12 to 72 months.
            </li>
            <br />
            <li>
              No settlement quotes are required. Proof of payment that your
              loans have been settled.
            </li>
            <br />
            <li>
              We deposit your Loan straight into your secure own MyWorld
              account.
            </li>
            <br />
            <li>You can choose to repay your loan over 7 to 72 months.</li>
            <br />
            <li>You know exactly how much you will be repaying each month.</li>
            <br />
            <li>
              You can choose to apply online, over the phone or you can choose
              to visit your nearest branch.
            </li>
            <br />
          </ul>
        </div>

        <div className={styles.card}>
          <h2>12% Interest Loan</h2>
          <h4>
            <u>12% Interest Loan Features</u>
          </h4>
          <ul>
            <li>
              Improve your cash flow, repayment terms from 9 to 24 months.
            </li>
            <br />
            <li>
              This allows you to budget accurately and know exactly how much you
              will be repaying from month to month
            </li>
            <br />
            <li>
              You can choose to apply online, over the phone or you can choose
              to visit your nearest branch.
            </li>
            <br />
            <li>
              Your 12% Loan will be deposited straight into your bank account.
            </li>
            <br />
            <li>
              We deposit your Loan straight into your secure own MyWorld
              account.
            </li>

            <br />
          </ul>
        </div>
      </div>

      <div id="CREDITCARD" className={styles.open_section}>
        <h1 className={styles.headline}>
          <mark className={styles.mark}>CREDIT CARD</mark>
        </h1>
      </div>
      <br />
      <div className={styles.cards}>
        <div className={styles.card}>
          <h2>BLACK CREDIT CARD | FEATURES AND BENEFITS</h2>
          <p>
            Your African Bank Credit Card allows you more convenience and peace
            of mind with the following features:
          </p>
          <ul>
            <li>
              Your personalised embossed Card is issued instantly at any African
              Bank Branch.
            </li>
            <br />
            <li>
              Accepted globally at all merchants and ATM's displaying the Visa
              logo.
            </li>
            <br />
            <li>Using your Card is safer than carrying cash.</li>
            <br />
            <li>
              Simply Tap, Dip or Swipe, then enter your PIN to complete any
              transaction.
            </li>
            <br />
            <li>
              Online (Card Not Present) transactions are secure with
              participating merchants.
              <br />
              An OTP (One Time PIN) will be sent to the cardholder to authorise
              the transaction.
            </li>
            <br />
            <li>
              Cash withdrawals at POS (Point of Sale, or till points) at
              participating merchants,
              <br />
              for example, Checkers, Shoprite, Spar and Pick n Pay.
            </li>
            <br />
            <li>Free SMS notifications on all successful transactions.</li>
            <br />
            <li>
              Set your own personalised transaction limits.
              <br />
              <br />
              (If you have not set your personalised limits,the African Bank
              discretionary default limits will apply).
            </li>
            <br />

            <li>
              Up to 62 days interest-free credit on POS and online purchases, if
              you settle your outstanding balance in full by the due date.
            </li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>CREDIT APPLICATION PROCESS:</h2>
          <ul>
            <li>
              Step 1: The application process includes a request that you
              provide African Bank with all information about your monthly
              income and
              <br />
              expenses so that the bank can determine whether you can afford the
              loan.
            </li>
            <br />
            <li>
              Step 2: Our consultants use the above information along with
              information from the credit bureau to analyse your monthly
              expenses and
              <br />
              calculate the instalment you can afford to pay.
              <br /> We want to make sure you do not experience financial
              difficulty while repaying your loan.
            </li>
          </ul>
          <p>
            If your application for credit is unsuccessful, you may ask for
            written reasons as to why your application was declined. If your
            credit application is declined because of information recorded on
            the credit bureau, African Bank will provide you with the details
            and contact information that will enable you to make an enquiry at
            the credit bureau. If you fail to inform African Bank of your
            inability to pay the instalments or if you provide incorrect
            information, you may not be fully protected by the NCA (National
            Credit Act 34 of 2005).
          </p>
        </div>
      </div>

      <div id="TECHDEALS" className={styles.open_section}>
        <h1 className={styles.headline}>
          <mark className={styles.mark}>TECH DEALS</mark>
        </h1>
      </div>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h2>Tech Deals</h2>
          <h4>
            <u>Teach Deal Features</u>
          </h4>
          <p>
            <b>Why apply for a Tech Deal from African Bank?</b>
          </p>
          <p>
            We offer our customers a range of devices with the best value A
            simple,
            <br />
            secure online application process,via our banking App or Online
            Banking
            <br />
            You get a fixed interest rate of only 12%, payable over 24 months.
          </p>
          <p>
            <b>How to apply for a Tech Deal?</b>
          </p>
          <p>
            Download our banking App or register for our Online Banking
            <br />
            Once logged in, select the “Apply” button and follow the easy steps
          </p>
          <br />

          <p>
            <b>What will you need to apply for a Tech Deal?</b>
            <br />
            To get a Tech Deal suited to your lifestyle, you will need to
            <br /> have the following documents on hand:
          </p>
          {/* <p>

                    We offer our customers a range of devices with the best value
                    A simple,<br />
                     secure online application process, via our banking App or Online Banking
                     <br />
                    You get a fixed interest rate of only 12%, payable over 24 months.
                    <br />
                    <p><b>How to apply for a Tech Deal?</b></p>
                    Download our banking App or register for our Online Banking
                    <br />
                    Once logged in, select the “Apply” button and follow the easy steps
                    <br />
                    What will you need to apply for a Tech Deal?
                    To get a Tech Deal 
                    <br />
                    suited to your lifestyle, you will need to have the following documents on hand:</p> */}
        </div>
        <div className={styles.card}>
          <div className={styles.main_img}>
            <img src="/techdeal1.jpeg" alt="pic here" />
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.main_img}>
            <img src="/techdeal2.jpeg" alt="pic here" />
          </div>
        </div>
      </div>
    </>
  );
}
