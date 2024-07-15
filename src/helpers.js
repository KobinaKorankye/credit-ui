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

export   const getPredClass = (response) => {
    if (response?.prediction == "Possible Non Defaulter") {
      return 1;
    } else if (response?.prediction == "Possible Defaulter") {
      return 0;
    }
  };

export function transformModelApiObject(input) {
    const keys = [
      "status_of_existing_checking_account",
      "duration",
      "credit_history",
      "purpose",
      "credit_amount",
      "savings_account_bonds",
      "present_employment_since",
      "installment_rate_in_percentage_of_disposable_income",
      "personal_status_and_sex",
      "marital_status",
      "sex",
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
      "foreign_worker"
    ];
  
    // Create the resulting object
    const result = {};
  
    // Extract the specified keys
    keys.forEach(key => {
      result[key] = input[key];
    });
  
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

  export   const getPredictionMUI = async (params, event, details) => {
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