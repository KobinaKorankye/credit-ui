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