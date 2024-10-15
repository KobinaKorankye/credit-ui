import { min, max, isToday, isThisWeek, isThisMonth, isThisYear, isWithinInterval, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears, format } from 'date-fns';
import { themePalette } from '../themePalette';
import { quantileSorted } from 'simple-statistics';
import { reversedMappings } from './constants';

export function findQuartile(value, population) {
  // Step 1: Sort the population data
  const sortedPopulation = population.slice().sort((a, b) => a - b);

  // Step 2: Calculate the quartiles
  const Q1 = quantileSorted(sortedPopulation, 0.25);
  const Q2 = quantileSorted(sortedPopulation, 0.50); // Median
  const Q3 = quantileSorted(sortedPopulation, 0.75);

  // Step 3: Determine in which quartile the value lies
  if (value <= Q1) {
    return 'First quartile (Q1)';
  } else if (value <= Q2) {
    return 'Second quartile (Q2)';
  } else if (value <= Q3) {
    return 'Third quartile (Q3)';
  } else {
    return 'Fourth quartile (Q4)';
  }
}

export function personalStatusSexEncoder(form) {
  const { marital_status, sex, ...rest } = form;

  let personal_status_and_sex;

  if (sex === 'male') {
    if (marital_status === 'divorced' || marital_status === 'separated') {
      personal_status_and_sex = 'A91';
    } else if (marital_status === 'single') {
      personal_status_and_sex = 'A93';
    } else if (marital_status === 'married' || marital_status === 'widowed') {
      personal_status_and_sex = 'A94';
    }
  } else if (sex === 'female') {
    if (marital_status === 'divorced' || marital_status === 'separated' || marital_status === 'married') {
      personal_status_and_sex = 'A92';
    } else if (marital_status === 'single') {
      personal_status_and_sex = 'A95';
    }
  }

  return {
    ...rest,
    personal_status_and_sex,
  };
}

export const getPredClass = (response) => {
  if (response?.prediction == "Possible Non Defaulter") {
    return 1;
  } else if (response?.prediction == "Possible Defaulter") {
    return 0;
  }
};

export const getTotalOfColumn = (filteredData, columnName) => {
  let total = 0
  filteredData.forEach((entry) => {
    total += entry[columnName]
  })
  return total
}

export const getApplicantInfoField = (row) =>{
  return row.customer? row.customer: row.nc_info
}

export function transformApplicationToModelApiObject(input) {

  const info = getApplicantInfoField(input)

  const result = {
    id: input.id || null,
    status_of_existing_checking_account: reversedMappings[input.status_of_existing_checking_account],
    duration: input.duration_in_months,
    credit_history: reversedMappings[input.credit_history],
    purpose: reversedMappings[input.purpose],
    credit_amount: input.loan_amount_requested,
    savings_account_bonds: reversedMappings[input.savings_account_bonds],
    present_employment_since: reversedMappings[input.present_employment_since],
    installment_rate_in_percentage_of_disposable_income: input.installment_rate_in_percentage_of_disposable_income,
    personal_status_and_sex: reversedMappings[input.personal_status_and_sex] || null,
    marital_status: info.marital_status || null,
    sex: info.sex || null,
    other_debtors_guarantors: reversedMappings[input.other_debtors_guarantors],
    present_residence_since: input.present_residence_since,
    property: reversedMappings[input.property],
    age: info.age,
    income: info.income,
    other_installment_plans: reversedMappings[input.other_installment_plans],
    housing: reversedMappings[input.housing],
    number_of_existing_credits_at_this_bank: input.number_of_existing_credits_at_this_bank,
    job: reversedMappings[input.job],
    number_of_people_being_liable_to_provide_maintenance_for: input.number_of_people_being_liable_to_provide_maintenance_for,
    telephone: reversedMappings[info.telephone],
    foreign_worker: reversedMappings[info.foreign_worker]
  };

  // Add the person_id key with a random 6-digit number string
  result.person_id = Math.floor(100000 + Math.random() * 900000).toString();

  return result;
}

export function transformModelApiObject(input) {

  const result = {
    id: input.id || null,
    status_of_existing_checking_account: reversedMappings[input.status_of_existing_checking_account],
    duration: input.duration_in_months,
    credit_history: reversedMappings[input.credit_history],
    purpose: reversedMappings[input.purpose],
    credit_amount: input.loan_amount,
    savings_account_bonds: reversedMappings[input.savings_account_bonds],
    present_employment_since: reversedMappings[input.present_employment_since],
    installment_rate_in_percentage_of_disposable_income: input.installment_rate_in_percentage_of_disposable_income,
    personal_status_and_sex: reversedMappings[input.personal_status_and_sex] || null,
    marital_status: input.marital_status || null,
    sex: input.sex || null,
    other_debtors_guarantors: reversedMappings[input.other_debtors_guarantors],
    present_residence_since: input.present_residence_since,
    property: reversedMappings[input.property],
    age: input.age,
    income: input.income,
    other_installment_plans: reversedMappings[input.other_installment_plans],
    housing: reversedMappings[input.housing],
    number_of_existing_credits_at_this_bank: input.number_of_existing_credits_at_this_bank,
    job: reversedMappings[input.job],
    number_of_people_being_liable_to_provide_maintenance_for: input.number_of_people_being_liable_to_provide_maintenance_for,
    telephone: reversedMappings[input.telephone],
    foreign_worker: reversedMappings[input.foreign_worker]
  };

  // Add the person_id key with a random 6-digit number string
  result.person_id = Math.floor(100000 + Math.random() * 900000).toString();

  return result;
}

const firstNames = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
  "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
  // Add more first names as needed
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  // Add more last names as needed
];

const middleInitials = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => `${letter}.`);

export function generateName(id) {
  const firstName = firstNames[id % firstNames.length];
  const middleInitial = middleInitials[Math.floor(id / firstNames.length) % middleInitials.length];
  const lastName = lastNames[Math.floor(id / (firstNames.length * middleInitials.length)) % lastNames.length];
  return `${firstName} ${middleInitial} ${lastName}`;
}

export const getPredictionMUI = async (params, event, details) => {
  const body = transformModelApiObject(params.row);
  setLoading(true);
  try {
    const { data } = await client.post("/predict", body);
    console.log(body);
    //   toast.success("Sent Successfully", {
    //     position: "top-left",
    //   });
    navigate("/analysis", { state: { formEntry: body, response: data[0] } });
    console.log(data);
  } catch (error) {
    toast.error("Failed", {
      position: "top-left",
    });
    console.log(error);
  }
  setLoading(false);
};

export function convertArrayOfObjectsToDictionary(arrayOfObjects, keys) {
  const result = {};

  arrayOfObjects.forEach(obj => {
    Object.keys(obj).forEach(key => {
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(obj[key]);
    });
  });

  if (Object.keys(result).length === 0) {
    keys.forEach((key) => {
      result[key] = []
    })
  }

  return result;
}

export function convertDictionaryToArrayOfObjects(dictionaryOfArrays) {
  const keys = Object.keys(dictionaryOfArrays);
  const length = dictionaryOfArrays[keys[0]].length; // Assuming all arrays have the same length

  const result = [];

  for (let i = 0; i < length; i++) {
    const obj = {};
    keys.forEach(key => {
      obj[key] = dictionaryOfArrays[key][i];
    });
    result.push(obj);
  }

  return result;
}

export function filterByDate(data, column, options = {}, isDict = false) {
  const { date, startDate, endDate, filterType } = options;
  const data_ = isDict ? convertDictionaryToArrayOfObjects(data) : data

  return data_.filter(item => {
    const itemDate = parseISO(item[column]); // Parse date from ISO string format

    if (filterType) {
      switch (filterType) {
        case 'all':
          return true;  // No filtering, return all items

        case 'today':
          return isToday(itemDate);

        case 'week':
          return isThisWeek(itemDate, { weekStartsOn: 1 }); // Week starts on Monday (0 for Sunday)

        case 'month':
          return isThisMonth(itemDate);

        case 'year':
          return isThisYear(itemDate);

        case 'date':
          const parsedDate = parseISO(date);
          return isWithinInterval(itemDate, {
            start: startOfDay(parsedDate),
            end: endOfDay(parsedDate),
          });

        case 'date_range':
          const parsedStartDate = parseISO(startDate);
          const parsedEndDate = parseISO(endDate);

          return isWithinInterval(itemDate, {
            start: startOfDay(parsedStartDate),
            end: endOfDay(parsedEndDate),
          });
      }
    }

    return false;
  });
}

export function calculateAverageApplicants(numOfApplications, options = {}) {
  if (numOfApplications === 0) return { message: "No data available." };

  let startDate, endDate;

  // Determine the start and end dates based on the specified time frame
  switch (options.filterType) {
    case 'today':
      startDate = startOfDay(new Date());
      endDate = endOfDay(new Date());
      break;
    case 'week':
      startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
      endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
      break;
    case 'month':
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
      break;
    case 'year':
      startDate = startOfYear(new Date());
      endDate = endOfYear(new Date());
      break;
    case 'date_range':
      startDate = parseISO(options.startDate);
      endDate = parseISO(options.endDate);
      break;
    default:
      return { message: "Invalid or missing filterType" };
  }

  // Calculate time differences for the specified time frame
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const totalWeeks = differenceInWeeks(endDate, startDate) + 1;
  const totalMonths = differenceInMonths(endDate, startDate) + 1;
  const totalYears = differenceInYears(endDate, startDate) + 1;

  // Initialize result object
  const result = {};

  // Calculate average daily applications
  result.averageDaily = numOfApplications / totalDays;

  // Calculate average weekly applications if relevant
  if (totalWeeks > 1) {
    result.averageWeekly = numOfApplications / totalWeeks;
  }

  // Calculate average monthly applications if relevant
  if (totalMonths > 1) {
    result.averageMonthly = numOfApplications / totalMonths;
  }

  // Calculate average yearly applications if relevant
  if (totalYears > 1) {
    result.averageYearly = numOfApplications / totalYears;
  }

  // Return the appropriate message based on the filter type
  switch (options.filterType) {
    case 'all':
      result.message = 'Average applications over the entire data range';
      break;
    case 'today':
      result.message = 'Average applications for today';
      break;
    case 'week':
      result.message = 'Average daily applications for the current week';
      break;
    case 'month':
      result.message = 'Average daily and weekly applications for the current month';
      break;
    case 'year':
      result.message = 'Average daily, weekly, monthly, and yearly applications for the current year';
      break;
    case 'date_range':
      result.message = 'Average applications within the specified date range';
      break;
    default:
      result.message = 'Invalid time frame selected';
  }

  return result;
}

// export function calculateAverageApplicants(filteredData, column, options = {}) {
//   if (filteredData.length === 0) return { message: "No data available." };

//   let startDate, endDate;

//   // Determine the start and end dates based on the specified time frame
//   switch (options.filterType) {
//     case 'all':
//       const dates = filteredData.map(item => parseISO(item[column]));
//       startDate = min(dates);
//       endDate = max(dates);
//       break;
//     case 'today':
//       startDate = startOfDay(new Date());
//       endDate = endOfDay(new Date());
//       break;
//     case 'week':
//       startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
//       endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
//       break;
//     case 'month':
//       startDate = startOfMonth(new Date());
//       endDate = endOfMonth(new Date());
//       break;
//     case 'year':
//       startDate = startOfYear(new Date());
//       endDate = endOfYear(new Date());
//       break;
//     case 'date_range':
//       startDate = parseISO(options.startDate);
//       endDate = parseISO(options.endDate);
//       break;
//     default:
//       return { message: "Invalid or missing filterType" };
//   }

//   // Number of applicants in the pre-filtered data
//   const totalApplications = filteredData.length;

//   // Calculate time differences for the specified time frame
//   const totalDays = differenceInDays(endDate, startDate) + 1;
//   const totalWeeks = differenceInWeeks(endDate, startDate) + 1;
//   const totalMonths = differenceInMonths(endDate, startDate) + 1;
//   const totalYears = differenceInYears(endDate, startDate) + 1;

//   // Initialize result object
//   const result = {};

//   // Calculate average daily applications
//   result.averageDaily = totalApplications / totalDays;

//   // Calculate average weekly applications if relevant
//   if (totalWeeks > 1) {
//     result.averageWeekly = totalApplications / totalWeeks;
//   }

//   // Calculate average monthly applications if relevant
//   if (totalMonths > 1) {
//     result.averageMonthly = totalApplications / totalMonths;
//   }

//   // Calculate average yearly applications if relevant
//   if (totalYears > 1) {
//     result.averageYearly = totalApplications / totalYears;
//   }

//   // Return the appropriate message based on the filter type
//   switch (options.filterType) {
//     case 'all':
//       result.message = 'Average applications over the entire data range';
//       break;
//     case 'today':
//       result.message = 'Average applications for today';
//       break;
//     case 'week':
//       result.message = 'Average daily applications for the current week';
//       break;
//     case 'month':
//       result.message = 'Average daily and weekly applications for the current month';
//       break;
//     case 'year':
//       result.message = 'Average daily, weekly, monthly, and yearly applications for the current year';
//       break;
//     case 'date_range':
//       result.message = 'Average applications within the specified date range';
//       break;
//     default:
//       result.message = 'Invalid time frame selected';
//   }

//   return result;
// }

// export function getRechartsDataForPlot(filteredData, column, options) {
//   // Calculate average applicants over the full range using the previously defined function
//   const averages = calculateAverageApplicants(filteredData, column, options);

//   // Initialize Recharts data structure with 0s for all time frames
//   const rechartsData = [
//     { name: 'Daily Average', value: averages.averageDaily || 0, color: themePalette.alt },
//     { name: 'Weekly Average', value: averages.averageWeekly || 0, color: themePalette.primary },
//     { name: 'Monthly Average', value: averages.averageMonthly || 0, color: themePalette.secondary },
//     { name: 'Yearly Average', value: averages.averageYearly || 0, color: themePalette['surface-light'] }
//   ];

//   // Logic to determine which values to plot
//   // If date range spans less than a week, set weekly, monthly, and yearly to 0

//   return rechartsData;
// }
export function getRechartsDataForPlot(numOfApplications, options) {
  // Calculate average applicants over the full range using the previously defined function
  const averages = calculateAverageApplicants(numOfApplications, options);

  // Initialize Recharts data structure with 0s for all time frames
  const rechartsData = [
    { name: 'Daily Average', value: averages.averageDaily || 0, color: themePalette.alt },
    { name: 'Weekly Average', value: averages.averageWeekly || 0, color: themePalette.primary },
    { name: 'Monthly Average', value: averages.averageMonthly || 0, color: themePalette.secondary },
    { name: 'Yearly Average', value: averages.averageYearly || 0, color: themePalette['surface-light'] }
  ];

  // Logic to determine which values to plot
  // If date range spans less than a week, set weekly, monthly, and yearly to 0

  return rechartsData;
}

export function dateRangeStartAndEnd(option) {
  const now = new Date(); // Get the current date and time

  let startDate, endDate;

  switch (option) {
    case 'today':
      startDate = startOfDay(now);
      endDate = endOfDay(now);
      break;

    case 'week':
      startDate = startOfWeek(now, { weekStartsOn: 1 }); // Week starting on Monday
      endDate = endOfWeek(now, { weekStartsOn: 1 });
      break;

    case 'month':
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;

    case 'year':
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      break;

    default:
      throw new Error('Invalid option. Please use "day", "week", "month", or "year".');
  }

  return {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
  };
}

export function evaluateFilter(filter, data) {
  if (filter.and) {
    return filter.and.every(f => evaluateFilter(f, data)); // Handle 'and'
  } else if (filter.or) {
    return filter.or.some(f => evaluateFilter(f, data)); // Handle 'or'
  } else if (filter.not) {
    return !evaluateFilter(filter.not[0], data); // Handle 'not'
  } else {
    // This handles a single filter condition directly
    const { attribute, operation, operand } = filter;
    const value = data[attribute];

    switch (operation) {
      case 'eq': return value === operand;
      case 'lt': return value < operand;
      case 'lte': return value <= operand;
      case 'gt': return value > operand;
      case 'gte': return value >= operand;
      default: throw new Error(`Unknown operation: ${operation}`);
    }
  }
}

export function filterToString(filter) {
  if (filter.and) {
    // For 'and', join each condition with 'AND'
    return '(' + filter.and.map(f => filterToString(f)).join(' AND ') + ')';
  } else if (filter.or) {
    // For 'or', join each condition with 'OR'
    return '(' + filter.or.map(f => filterToString(f)).join(' OR ') + ')';
  } else if (filter.not) {
    // For 'not', prefix the condition with 'NOT'
    return 'NOT (' + filterToString(filter.not[0]) + ')';
  } else {
    // For single conditions, construct the comparison string
    const { attribute, operation, operand } = filter;

    let opString;
    switch (operation) {
      case 'eq': opString = '=='; break;
      case 'neq': opString = '!='; break;
      case 'lt': opString = '<'; break;
      case 'lte': opString = '<='; break;
      case 'gt': opString = '>'; break;
      case 'gte': opString = '>='; break;
      default: opString = operation; // Fallback in case of unknown operation
    }

    return `${attribute} ${opString} ${operand}`;
  }
}

export function isValidFilter(filter) {
  if (filter.and) {
    // Recursively check all conditions in the 'and' array
    return filter.and.every(f => isValidFilter(f));
  } else if (filter.or) {
    // Recursively check all conditions in the 'or' array
    return filter.or.every(f => isValidFilter(f));
  } else if (filter.not) {
    // Recursively check the 'not' condition
    return isValidFilter(filter.not[0]);
  } else {
    // Check if it's an atomic filter
    const { attribute, operation, operand } = filter;

    // Validate that attribute is not falsy, not null, not an empty string, and not a string with only whitespace
    if (!attribute || attribute.trim() === '') {
      return false;
    }

    if (!operation || operation.trim() === '') {
      return false;
    }

    if (!operand || operand.trim() === '') {
      return false;
    }

    // You can add additional validation here for `operation` and `operand` if needed
    return true;
  }
}


export const operationDescriptions = {
  eq: 'equals',
  neq: 'not equal to',
  lt: 'less than',
  lte: 'less than or equal to',
  gt: 'greater than',
  gte: 'greater than or equal to'
};

