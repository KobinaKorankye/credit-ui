import { useEffect, useState } from "react";
import FormInput from "../components/formik/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import Submit from "../components/formik/Submit";
import client from "../api/client";
import { toast } from "react-toastify";
import React from "react";
import FormSelect from "../components/formik/FormSelect";
import { useDispatch, useSelector } from "react-redux";
import { fetchGraphData } from "../store/graphDataSlice";
import SideNavLayout from "../layouts/SideNavLayout";
import Loader from "../loader/Loader";
import { useNavigate } from "react-router-dom";

const attributeMapping = {
    status_of_existing_checking_account: [
        { value: "Less than 0 GHS", label: "Less than 0 GHS" },
        { value: "Between 0 and 200 GHS", label: "Between 0 and 200 GHS" },
        { value: "200 or more GHS", label: "200 or more GHS" },
        { value: "No account", label: "No account" },
    ],
    credit_history: [
        { value: "No credits all paid", label: "No credits all paid" },
        { value: "All credits paid here", label: "All credits paid here" },
        { value: "Credits paid till now", label: "Credits paid till now" },
        { value: "Delay in past", label: "Delay in past" },
        { value: "Critical other credits", label: "Critical other credits" },
    ],
    purpose: [
        { value: "Car new", label: "Car new" },
        { value: "Car used", label: "Car used" },
        { value: "Furniture/equipment", label: "Furniture/equipment" },
        { value: "Radio/TV", label: "Radio/TV" },
        { value: "Domestic appliances", label: "Domestic appliances" },
        { value: "Repairs", label: "Repairs" },
        { value: "Education", label: "Education" },
        { value: "Vacation", label: "Vacation" },
        { value: "Retraining", label: "Retraining" },
        { value: "Business", label: "Business" },
        { value: "Others", label: "Others" },
    ],
    savings_account_bonds: [
        { value: "Less than 100 GHS", label: "Less than 100 GHS" },
        { value: "Between 100 and 500 GHS", label: "Between 100 and 500 GHS" },
        { value: "Between 500 and 1000 GHS", label: "Between 500 and 1000 GHS" },
        { value: "1000 or more GHS", label: "1000 or more GHS" },
        { value: "Unknown/no savings", label: "Unknown/no savings" },
    ],
    present_employment_since: [
        { value: "Unemployed", label: "Unemployed" },
        { value: "Less than 1 year", label: "Less than 1 year" },
        { value: "Between 1 and 4 years", label: "Between 1 and 4 years" },
        { value: "Between 4 and 7 years", label: "Between 4 and 7 years" },
        { value: "7 or more years", label: "7 or more years" },
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
        { value: "None", label: "None" },
        { value: "Co-applicant", label: "Co-applicant" },
        { value: "Guarantor", label: "Guarantor" },
    ],
    property: [
        { value: "Real estate", label: "Real estate" },
        { value: "Building/savings life insurance", label: "Building/savings life insurance" },
        { value: "Car/other", label: "Car/other" },
        { value: "Unknown/no property", label: "Unknown/no property" },
    ],
    other_installment_plans: [
        { value: "Bank", label: "Bank" },
        { value: "Stores", label: "Stores" },
        { value: "None", label: "None" },
    ],
    housing: [
        { value: "Rent", label: "Rent" },
        { value: "Own", label: "Own" },
        { value: "For free", label: "For free" },
    ],
    job: [
        { value: "Unemployed/unskilled non-resident", label: "Unemployed/unskilled non-resident" },
        { value: "Unskilled resident", label: "Unskilled resident" },
        { value: "Skilled employee/official", label: "Skilled employee/official" },
        { value: "Management/self-employed/high qualified", label: "Management/self-employed/high qualified" },
    ],
    telephone: [
        { value: "None", label: "None" },
        { value: "Yes, registered", label: "Yes, registered" },
    ],
    foreign_worker: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ],
};


export default function AddApplicant() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validationSchema = [
        Yup.object().shape({
            full_name: Yup.string().required().label("Full Name"),
            sex: Yup.string().required().label("Sex"),
            age: Yup.number().required().positive().integer().label("Age"),
            marital_status: Yup.string().required().label("Marital Status"),
            income: Yup.number().required().positive().label("Income"),
            telephone: Yup.string().required().label("Telephone"),
            foreign_worker: Yup.string().required().label("Foreign Worker"),
            email: Yup.string().email().required().label("Email"),
            mobile: Yup.string().required().label("Mobile"),
            present_residence_since: Yup.number()
                .required()
                .positive()
                .integer()
                .label("Present Residence Since"),
        }),
        Yup.object().shape({
            status_of_existing_checking_account: Yup.string()
                .required()
                .label("Status of Existing Checking Account"),
            savings_account_bonds: Yup.string()
                .required()
                .label("Savings Account/Bonds"),
            property: Yup.string().required().label("Property"),
            housing: Yup.string().required().label("Housing"),
            job: Yup.string().required().label("Job"),
            present_employment_since: Yup.string()
                .required()
                .label("Present Employment Since"),
        }),
        Yup.object().shape({
            other_installment_plans: Yup.string()
                .required()
                .label("Other Installment Plans"),
            number_of_existing_credits_at_this_bank: Yup.number()
                .required()
                .label("Number of Existing Credits at This Bank"),
            number_of_people_being_liable_to_provide_maintenance_for: Yup.number()
                .required()
                .label("Number of People Being Liable to Provide Maintenance For"),
            credit_history: Yup.string().required().label("Credit History"),
        }),
        Yup.object().shape({
            loan_amount_requested: Yup.number()
                .required()
                .positive()
                .label("Loan Amount Requested"),
            duration_in_months: Yup.number()
                .required()
                .positive()
                .integer()
                .label("Duration in Months"),
            purpose: Yup.string().required().label("Purpose"),
            other_debtors_guarantors: Yup.string()
                .required()
                .label("Other Debtors/Guarantors"),
            installment_rate_in_percentage_of_disposable_income: Yup.number()
                .min(0, "The installment rate must be a non-negative number.")
                .max(100, "The installment rate must not exceed 100%.")
                .required()
                .label("Installment Rate in Percentage of Disposable Income"),
        }),
    ];

    const [step, setStep] = useState(0);

    const handleNext = (errors, validateForm) => {
        validateForm().then((formErrors) => {
            if (Object.keys(formErrors).length === 0) {
                setStep(step + 1);
            }
            // alert(JSON.stringify(formErrors))
        });
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const initialValues = {
        full_name: "",
        sex: "",
        age: "",
        marital_status: "",
        income: "",
        telephone: "",
        email: "",
        mobile: "",
        present_residence_since: 0, // Set to 0 by default
        status_of_existing_checking_account: "",
        savings_account_bonds: "",
        property: "",
        housing: "",
        job: "",
        present_employment_since: "",
        other_installment_plans: "",
        number_of_existing_credits_at_this_bank: 0, // Set to 0 by default
        number_of_people_being_liable_to_provide_maintenance_for: 0, // Set to 0 by default
        credit_history: "",
        loan_amount_requested: 0, // Set to 0 by default
        duration_in_months: 0, // Set to 0 by default
        purpose: "",
        other_debtors_guarantors: "",
        installment_rate_in_percentage_of_disposable_income: 0, // Set to 0 by default
        foreign_worker: "",
    };

    const onSubmit = async (form, { resetForm }) => {
        setLoading(true);

        // Extract fields for `nc_info`
        const {
            full_name, sex, age, marital_status, income,
            telephone, email, mobile, foreign_worker, ...explicitFields
        } = form;

        const replaceZeroWithPrefix = (str) => {
            if (str.startsWith("0")) {
                return "233" + str.slice(1);
            }
            return str;
        }

        const saveableData = {
            ...explicitFields,
            nc_info: {
                full_name,
                sex,
                age,
                marital_status,
                income,
                telephone,
                email,
                mobile: replaceZeroWithPrefix(mobile),
                foreign_worker
            },
        };

        try {
            const { data } = await client.post("/loan-applications", saveableData);
            toast.success("Saved", {
                position: "top-left",
            });
            navigate('/applicants')
        } catch (error) {
            toast.error("Failed to save", {
                position: "top-left",
            });
        }

        setLoading(false);
    };

    return (
        <>
            <SideNavLayout>
                {loading ? (
                    <div className="bg-white flex flex-col items-center justify-center w-full h-full overflow-auto">
                        <Loader height={200} width={200} />
                        <div className="font-semibold">Analyzing...</div>
                    </div>
                ) : (
                    <div className="bg-white flex flex-col items-start w-full h-full overflow-y-auto px-20">
                        <div className="text-xl py-2 font-semibold my-5 text-sky-600">
                            Loan Application Form
                        </div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema[step]}
                            onSubmit={onSubmit}
                        >
                            {({ errors, validateForm, handleSubmit }) => (
                                <>
                                    {step === 0 && (
                                        <div className="w-full grid md:grid-cols-2 gap-4">
                                            <FormInput label="Full Name" name="full_name" type="text" />
                                            <FormSelect label="Sex" name="sex" options={attributeMapping.sex} />
                                            <FormInput label="Age" name="age" type="number" />
                                            <FormSelect label="Marital Status" name="marital_status" options={attributeMapping.marital_status} />
                                            <FormInput label="Income" name="income" type="number" />
                                            <FormSelect
                                                name="telephone"
                                                label={'Telephone'}
                                                options={attributeMapping.telephone}
                                            />
                                            <FormInput label="Email" name="email" type="email" />
                                            <FormInput label="Mobile" name="mobile" type="text" />
                                            <FormSelect
                                                label={"Foreign worker?"}
                                                name="foreign_worker"
                                                options={attributeMapping.foreign_worker}
                                            />
                                            <FormInput name="present_residence_since" type="number" />
                                        </div>
                                    )}
                                    {step === 1 && (
                                        <div className="w-full grid md:grid-cols-2 gap-4">
                                            <FormSelect label="Status of Existing Checking Account" name="status_of_existing_checking_account" options={attributeMapping.status_of_existing_checking_account} />
                                            <FormSelect label="Savings Account/Bonds" name="savings_account_bonds" options={attributeMapping.savings_account_bonds} />
                                            <FormSelect label="Property" name="property" options={attributeMapping.property} />
                                            <FormSelect label="Housing" name="housing" options={attributeMapping.housing} />
                                            <FormSelect label="Job" name="job" options={attributeMapping.job} />
                                            <FormSelect label="Present Employment Since" name="present_employment_since" options={attributeMapping.present_employment_since} />
                                        </div>
                                    )}
                                    {step === 2 && (
                                        <div className="w-full grid md:grid-cols-2 gap-4">
                                            <FormSelect label="Other Installment Plans" name="other_installment_plans" options={attributeMapping.other_installment_plans} />
                                            <FormInput label="Number of Existing Credits at This Bank" name="number_of_existing_credits_at_this_bank" type="number" />
                                            <FormInput label="Number of People Being Liable to Provide Maintenance For" name="number_of_people_being_liable_to_provide_maintenance_for" type="number" />
                                            <FormSelect label="Credit History" name="credit_history" options={attributeMapping.credit_history} />
                                        </div>
                                    )}
                                    {step === 3 && (
                                        <div className="w-full grid md:grid-cols-2 gap-4">
                                            <FormInput label="Loan Amount Requested" name="loan_amount_requested" type="number" />
                                            <FormInput label="Duration in Months" name="duration_in_months" type="number" />
                                            <FormSelect label="Purpose" name="purpose" options={attributeMapping.purpose} />
                                            <FormSelect label="Other Debtors/Guarantors" name="other_debtors_guarantors" options={attributeMapping.other_debtors_guarantors} />
                                            <FormInput label="Installment Rate in Percentage of Disposable Income" name="installment_rate_in_percentage_of_disposable_income" type="number" />
                                        </div>
                                    )}
                                    <div className="flex justify-between mt-10 gap-4 text-sm">
                                        {step > 0 && (
                                            <button
                                                type="button"
                                                className="bg-zinc-100 text-zinc-600 mb-10 py-4 text-sm hover:bg-zinc-600 hover:text-white px-4 rounded"
                                                onClick={handlePrevious}
                                            >
                                                Previous
                                            </button>
                                        )}
                                        {step < validationSchema.length - 1 && (
                                            <button
                                                type="button"
                                                className="bg-blue-100 w-64 mb-10 py-4 text-sm px-4 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded"
                                                onClick={() => handleNext(errors, validateForm)}
                                            >
                                                Next
                                            </button>
                                        )}
                                        {step === validationSchema.length - 1 && (
                                            <Submit
                                                className="bg-amber-100 w-64 mb-10 py-4 text-sm px-4 text-amber-600 hover:bg-amber-600 hover:text-white font-semibold rounded"
                                                text="Submit"
                                            />
                                        )}
                                    </div>
                                </>
                            )}
                        </Formik>
                    </div>
                )}
            </SideNavLayout>
        </>
    );
}
