export const mappings = {
  A11: "Less than 0 GHS",
  A12: "Between 0 and 200 GHS",
  A13: "200 or more GHS",
  A14: "No account",
  A30: "No credits all paid",
  A31: "All credits paid here",
  A32: "Credits paid till now",
  A33: "Delay in past",
  A34: "Critical other credits",
  A40: "Car new",
  A41: "Car used",
  A42: "Furniture/equipment",
  A43: "Radio/TV",
  A44: "Domestic appliances",
  A45: "Repairs",
  A46: "Education",
  A47: "Vacation",
  A48: "Retraining",
  A49: "Business",
  A410: "Others",
  A61: "Less than 100 GHS",
  A62: "Between 100 and 500 GHS",
  A63: "Between 500 and 1000 GHS",
  A64: "1000 or more GHS",
  A65: "Unknown/no savings",
  A71: "Unemployed",
  A72: "Less than 1 year",
  A73: "Between 1 and 4 years",
  A74: "Between 4 and 7 years",
  A75: "7 or more years",
  A91: "male : divorced/separated",
  A92: "female : divorced/separated/married",
  A93: "male : single",
  A94: "male : married/widowed",
  A95: "female : single",
  A101: "None",
  A102: "Co-applicant",
  A103: "Guarantor",
  A121: "Real estate",
  A122: "Building/savings life insurance",
  A123: "Car/other",
  A124: "Unknown/no property",
  A141: "Bank",
  A142: "Stores",
  A143: "None",
  A151: "Rent",
  A152: "Own",
  A153: "For free",
  A171: "Unemployed/unskilled non-resident",
  A172: "Unskilled resident",
  A173: "Skilled employee/official",
  A174: "Management/self-employed/high qualified",
  A191: "None",
  A192: "Yes, registered",
  A201: "Yes",
  A202: "No",
};

export const reversedMappings = {
  "Less than 0 GHS": "A11",
  "Between 0 and 200 GHS": "A12",
  "200 or more GHS": "A13",
  "No account": "A14",
  "No credits all paid": "A30",
  "All credits paid here": "A31",
  "Credits paid till now": "A32",
  "Delay in past": "A33",
  "Critical other credits": "A34",
  "Car new": "A40",
  "Car used": "A41",
  "Furniture/equipment": "A42",
  "Radio/TV": "A43",
  "Domestic appliances": "A44",
  "Repairs": "A45",
  "Education": "A46",
  "Vacation": "A47",
  "Retraining": "A48",
  "Business": "A49",
  "Others": "A410",
  "Less than 100 GHS": "A61",
  "Between 100 and 500 GHS": "A62",
  "Between 500 and 1000 GHS": "A63",
  "1000 or more GHS": "A64",
  "Unknown/no savings": "A65",
  "Unemployed": "A71",
  "Less than 1 year": "A72",
  "Between 1 and 4 years": "A73",
  "Between 4 and 7 years": "A74",
  "7 or more years": "A75",
  "None": "A101",
  "Co-applicant": "A102",
  "Guarantor": "A103",
  "Real estate": "A121",
  "Building/savings life insurance": "A122",
  "Car/other": "A123",
  "Unknown/no property": "A124",
  "Bank": "A141",
  "Stores": "A142",
  "Rent": "A151",
  "Own": "A152",
  "For free": "A153",
  "Unemployed/unskilled non-resident": "A171",
  "Unskilled resident": "A172",
  "Skilled employee/official": "A173",
  "Management/self-employed/high qualified": "A174",
  "Yes, registered": "A192",
  "Yes": "A201",
  "No": "A202"
};

export const columns = [
  "status_of_existing_checking_account",
  "duration",
  "credit_history",
  "purpose",
  "credit_amount",
  "savings_account_bonds",
  "present_employment_since",
  "installment_rate_in_percentage_of_disposable_income",
  "personal_status_and_sex",
  "other_debtors_guarantors",
  "present_residence_since",
  "property",
  "age",
  "other_installment_plans",
  "housing",
  "number_of_existing_credits_at_this_bank",
  "job",
  "number_of_people_being_liable_to_provide_maintenance_for",
  "telephone",
  "foreign_worker",
];

export const filterAttributes = {
  "status_of_existing_checking_account": "Checking Account Status",
  "income": "Monthly Income",
  // "credit_history": "Loan History",
  "savings_account_bonds": "Amount in Savings Account/Bonds",
  "marital_status": "Marital Status",
  "sex": "Sex",
  "age": "Age (years)",
  "telephone": "Telephone Availability",
  "foreign_worker": "Foreign Worker Status"
}
export const COLUMN_LABELS = {
  "status_of_existing_checking_account": "Checking Account Status",
  "duration": "Loan Duration (months)",
  "credit_history": "Loan History",
  "purpose": "Loan Purpose",
  "credit_amount": "Loan Amount",
  "savings_account_bonds": "Amount in Savings Account/Bonds",
  "present_employment_since": "Employment Duration",
  "installment_rate_in_percentage_of_disposable_income": "Installment Rate (% of Income)",
  "personal_status_and_sex": "Personal Status & Gender",
  "other_debtors_guarantors": "Other Debtors/Guarantors",
  "present_residence_since": "Years at Current Residence",
  "property": "Property Ownership",
  "age": "Age (years)",
  "other_installment_plans": "Other Installment Plans",
  "housing": "Housing Situation",
  "number_of_existing_credits_at_this_bank": "Number of Existing Loans",
  "job": "Job Type",
  "number_of_people_being_liable_to_provide_maintenance_for": "Dependents",
  "telephone": "Telephone Availability",
  "foreign_worker": "Foreign Worker Status"
}


export const columnNames = [
  "Status Of Existing Checking Account",
  "Duration",
  "Credit History",
  "Purpose",
  "Credit Amount",
  "Savings Account/Bonds",
  "Present Employment Since",
  "Installment Rate In Percentage Of Disposable Income",
  "Personal Status And Sex",
  "Other Debtors / Guarantors",
  "Present Residence Since",
  "Property",
  "Age",
  "Other Installment Plans",
  "Housing",
  "Number Of Existing Credits At This Bank",
  "Job",
  "Number Of People Being Liable To Provide Maintenance For",
  "Telephone",
  "Foreign Worker",
];

export const numericColumns = [
  "duration",
  "credit_amount",
  "installment_rate_in_percentage_of_disposable_income",
  "present_residence_since",
  "age",
  "number_of_existing_credits_at_this_bank",
];

export const attributeMapping = {
  status_of_existing_checking_account: [
    { value: "A11", label: "Less than 0 GHS" },
    { value: "A12", label: "Between 0 and 200 GHS" },
    { value: "A13", label: "200 or more GHS" },
    { value: "A14", label: "No account" },
  ],
  credit_history: [
    { value: "A30", label: "No credits all paid" },
    { value: "A31", label: "All credits paid here" },
    { value: "A32", label: "Credits paid till now" },
    { value: "A33", label: "Delay in past" },
    { value: "A34", label: "Critical other credits" },
  ],
  purpose: [
    { value: "A40", label: "Car new" },
    { value: "A41", label: "Car used" },
    { value: "A42", label: "Furniture/equipment" },
    { value: "A43", label: "Radio/TV" },
    { value: "A44", label: "Domestic appliances" },
    { value: "A45", label: "Repairs" },
    { value: "A46", label: "Education" },
    { value: "A47", label: "Vacation" },
    { value: "A48", label: "Retraining" },
    { value: "A49", label: "Business" },
    { value: "A410", label: "Others" },
  ],
  savings_account_bonds: [
    { value: "A61", label: "Less than 100 GHS" },
    { value: "A62", label: "Between 100 and 500 GHS" },
    { value: "A63", label: "Between 500 and 1000 GHS" },
    { value: "A64", label: "1000 or more GHS" },
    { value: "A65", label: "Unknown/no savings" },
  ],
  present_employment_since: [
    { value: "A71", label: "Unemployed" },
    { value: "A72", label: "Less than 1 year" },
    { value: "A73", label: "Between 1 and 4 years" },
    { value: "A74", label: "Between 4 and 7 years" },
    { value: "A75", label: "7 or more years" },
  ],
  marital_status: [
    { value: "divorced", label: "divorced" },
    { value: "separated", label: "separated" },
    { value: "single", label: "single" },
    { value: "married", label: "married" },
    { value: "widowed", label: "widowed" },
  ],
  sex: [
    { value: "male", label: "male" },
    { value: "female", label: "female" },
  ],
  other_debtors_guarantors: [
    { value: "A101", label: "None" },
    { value: "A102", label: "Co-applicant" },
    { value: "A103", label: "Guarantor" },
  ],
  property: [
    { value: "A121", label: "Real estate" },
    { value: "A122", label: "Building/savings life insurance" },
    { value: "A123", label: "Car/other" },
    { value: "A124", label: "Unknown/no property" },
  ],
  other_installment_plans: [
    { value: "A141", label: "Bank" },
    { value: "A142", label: "Stores" },
    { value: "A143", label: "None" },
  ],
  housing: [
    { value: "A151", label: "Rent" },
    { value: "A152", label: "Own" },
    { value: "A153", label: "For free" },
  ],
  job: [
    { value: "A171", label: "Unemployed/unskilled non-resident" },
    { value: "A172", label: "Unskilled resident" },
    { value: "A173", label: "Skilled employee/official" },
    { value: "A174", label: "Management/self-employed/high qualified" },
  ],
  telephone: [
    { value: "A191", label: "None" },
    { value: "A192", label: "Yes, registered" },
  ],
  foreign_worker: [
    { value: "A201", label: "Yes" },
    { value: "A202", label: "No" },
  ],
};

export const attributeObjMapping = {
  status_of_existing_checking_account: {
    A11: "Less than 0 GHS",
    A12: "Between 0 and 200 GHS",
    A13: "200 or more GHS",
    A14: "No account"
  },
  credit_history: {
    A30: "No credits all paid",
    A31: "All credits paid here",
    A32: "Credits paid till now",
    A33: "Delay in past",
    A34: "Critical other credits"
  },
  purpose: {
    A40: "Car new",
    A41: "Car used",
    A42: "Furniture/equipment",
    A43: "Radio/TV",
    A44: "Domestic appliances",
    A45: "Repairs",
    A46: "Education",
    A47: "Vacation",
    A48: "Retraining",
    A49: "Business",
    A410: "Others"
  },
  savings_account_bonds: {
    A61: "Less than 100 GHS",
    A62: "Between 100 and 500 GHS",
    A63: "Between 500 and 1000 GHS",
    A64: "1000 or more GHS",
    A65: "Unknown/no savings"
  },
  present_employment_since: {
    A71: "Unemployed",
    A72: "Less than 1 year",
    A73: "Between 1 and 4 years",
    A74: "Between 4 and 7 years",
    A75: "7 or more years"
  },
  marital_status: {
    divorced: "divorced",
    separated: "separated",
    single: "single",
    married: "married",
    widowed: "widowed"
  },
  sex: {
    male: "male",
    female: "female"
  },
  other_debtors_guarantors: {
    A101: "None",
    A102: "Co-applicant",
    A103: "Guarantor"
  },
  property: {
    A121: "Real estate",
    A122: "Building/savings life insurance",
    A123: "Car/other",
    A124: "Unknown/no property"
  },
  other_installment_plans: {
    A141: "Bank",
    A142: "Stores",
    A143: "None"
  },
  housing: {
    A151: "Rent",
    A152: "Own",
    A153: "For free"
  },
  job: {
    A171: "Unemployed/unskilled non-resident",
    A172: "Unskilled resident",
    A173: "Skilled employee/official",
    A174: "Management/self-employed/high qualified"
  },
  telephone: {
    A191: "None",
    A192: "Yes, registered"
  },
  foreign_worker: {
    A201: "Yes",
    A202: "No"
  }
};


export const catColumns = [
  "status_of_existing_checking_account",
  "credit_history",
  "purpose",
  "savings_account_bonds",
  "present_employment_since",
  "personal_status_and_sex",
  "other_debtors_guarantors",
  "property",
  "other_installment_plans",
  "housing",
  "job",
  "telephone",
  "foreign_worker",
];


export const applicationTypes = {
  approved: 'approved',
  rejected: 'rejected',
  pending: 'pending',
  all: '',
}