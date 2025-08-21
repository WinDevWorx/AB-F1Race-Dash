// Import preprocessed data structures
// This file converts the raw JSON data into importable modules

// Format and export compliance statements
export const complianceStatements = {
  mandatory: {
    regulatory_statements_default: {
      type: "default",
      keywords: [
        "representative working",
        "under supervision",
        "long term insurance",
        "short term deposits",
      ],
      phrases: [
        "I am a representative working under supervision authorised to sell Long Term Insurance including Short- and Long-term deposits.",
      ],
      common_keywords: [
        "financial services",
        "credit provider",
        "calls recorded",
        "professional indemnity",
      ],
    },

    consent_process_share: {
      keywords: [
        "permission process share",
        "credit bureau",
        "underwriter guardrisk",
      ],
      phrases: [
        "Do you give African bank permission to process and share your Personal information with the Credit Bureau and the underwriter Guardrisk?",
      ],
    },

    customer_authentication: {
      keywords: [
        "id number",
        "full names",
        "surname",
        "contact number",
        "phone number",
        "cellphone number",
      ],
      phrases: [
        "Kindly confirm your ID number",
        "Full names & surname",
        "Contact number",
      ],
    },

    marketing_consent: {
      keywords: ["marketing campaigns"],
      phrases: [
        "May African Bank include you in any Marketing campaigns?",
        "Can we include you in any Marketing campaigns?",
      ],
    },

    nca_compliance: {
      keywords: [
        "administration",
        "debt counselling",
        "sequestration",
        "credit check",
      ],
      phrases: [
        "Are you under Administration, Debt Counselling or Sequestration?",
        "Do you give permission to perform a credit check?",
      ],
    },

    banking_details: {
      keywords: [
        "name of bank",
        "cheque savings",
        "account number",
        "bank statement request",
        "receive SMS",
      ],
      phrases: [
        "Kindly provide me with the name of your bank",
        "Is your bank account a cheque or savings account?",
        "Can we kindly request the bank statement on your behalf?",
        "You will receive an SMS from your bank",
      ],
    },

    income_expenses: {
      keywords: ["fully accurately", "total expenses", "true correct"],
      phrases: [
        "Provide information fully accurately and truthfully",
        "Your total living expenses are... is this correct?",
        "Do you declare the Income and Expenses provided is True and Correct?",
      ],
    },

    offer_presentation: {
      keywords: ["provisional offer", "five working days"],
      phrases: [
        "Kindly note that this is a provisional offer valid for 5 working days.",
      ],
    },

    credit_life_standard: {
      keywords: [
        "credit life cover",
        "outstanding balance",
        "death disability",
        "twelve instalments",
        "90 days waiting",
      ],
      phrases: [
        "It covers the outstanding balance...",
        "The waiting period on ALL benefits is 90 days...",
      ],
    },

    information_declaration: {
      keywords: ["declare information", "true correct", "afford credit"],
      phrases: [
        "Do you declare that the information you provided is both true and correct...",
      ],
    },
  },

  conditional: {
    regulatory_registered_rep: {
      trigger_keyword: "registered representative",
      keywords: [
        "registered representative",
        "authorised sell",
        "short long-term deposits",
      ],
      phrases: [
        "I am a registered representative authorised to sell Long Term Insurance including Short and Long-term deposits.",
      ],
      notes: "Replaces default regulatory statement when triggered",
    },

    credit_life_ncr_loan: {
      trigger_keyword: "ncr short term",
      keywords: [
        "ncr short term",
        "no waiting periods",
        "guard risk pay until",
        "outstanding instalment",
      ],
      phrases: [
        "NCR short term loan come with a Credit Life Insurance Cover...",
        "Guard Risk Life will pay until...",
      ],
      exclusions: {
        keywords: ["90 days waiting", "all benefits"],
        notes: "Exclusions only apply to standard credit life",
      },
    },
  },
};

// Format and export keyword chunks
export const keywordChunks = {
  mandatory: {
    regulatory_statements_default: [
      "professional indemnity fidelity",
      "indemnity fidelity insurance",
      "authorised financial services",
      "calls recorded quality",
      "calls quality security",
      "representative working supervision",
      "long term insurance",
      "short term deposits",
    ],

    consent_process_share: [
      "permission process share",
      "process share personal",
      "share credit bureau",
      "bureau underwriter guardrisk",
      "underwriter guardrisk consent",
    ],

    customer_authentication: [
      "confirm id number",
      "id number full",
      "full names surname",
      "contact number provided",
      "phone number verification",
      "cellphone number registered",
    ],

    marketing_consent: [
      "include marketing campaigns",
      "marketing campaigns opt",
      "campaigns opt-in",
      "receive marketing materials",
    ],

    nca_compliance: [
      "under administration sequestration",
      "administration debt counselling",
      "debt counselling status",
      "credit check authorization",
      "national credit act",
    ],

    banking_details: [
      "name your bank",
      "bank account cheque",
      "cheque savings account",
      "account number verification",
      "last three digits",
      "request bank statement",
      "sms notification received",
    ],

    income_expenses: [
      "information fully accurate",
      "fully accurate truthfully",
      "total living expenses",
      "declare income truthfully",
      "affordability verification process",
    ],

    offer_presentation: [
      "provisional offer valid",
      "valid five working",
      "five working days",
    ],

    credit_life_standard: [
      "credit life cover",
      "outstanding balance covered",
      "death permanent disability",
      "retrenchment temporary disability",
      "compulsory unpaid leave",
      "ninety days waiting",
    ],

    information_declaration: [
      "declare information true",
      "information true correct",
      "afford credit applied",
      "accurate financial declaration",
    ],
  },

  conditional: {
    regulatory_registered_rep: [
      "registered representative authorised", // Primary trigger
      "representative authorised sell",
      "sell long term",
      "term deposits registered",
      "short long-term deposits",
    ],

    credit_life_ncr_loan: [
      "ncr short term", // Primary trigger
      "term loan cover",
      "guardrisk pay until",
      "instalment retrenchment cover",
      "no waiting periods",
      "loan repayments end",
    ],
  },
};
