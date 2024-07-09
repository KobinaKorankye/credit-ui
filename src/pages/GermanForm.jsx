import { useEffect, useMemo, useState } from "react";
import FormInput from "../components/formik/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import Submit from "../components/formik/Submit";
import client from "../api/client";
import { toast } from "react-toastify";
import React from "react";
import FormSelect from "../components/formik/FormSelect";
import RegularSelect from "../components/RegularSelect";
import BarChart from "../components/BarChart";
import KDEChart from "../components/KDEChart";
// import data from "../data/data.json";
import NormalBarChart from "../components/NormalBarChart";
import { mappings } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchGraphData } from "../store/graphDataSlice";
import SideNavLayout from "../layouts/SideNavLayout";
import Loader from "../loader/Loader";
import { personalStatusSexEncoder } from "../helpers";
import dbClient from "../api/dbClient";

export default function GermanForm() {
  const [show, setShow] = useState("graph");
  const [closePop, setClosePop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [formEntry, setFormEntry] = useState({});

  const data = useSelector((state) => state.graphData.data)

  const dispatch = useDispatch()
  const status = useSelector((state) => state.graphData.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchGraphData());
    }
  }, [dispatch]);

  const validationSchema = [
    Yup.object().shape({
      person_id: Yup.string()
        .matches(/^[a-zA-Z0-9]{6}$/, "Person ID must be exactly 6 alphanumeric characters")
        .required()
        .label("Person ID"),
      age: Yup.number().required().positive().integer().label("Age"),
      sex: Yup.string().required().label("Sex"),
      marital_status: Yup.string().required().label("Marital Status"),
      telephone: Yup.string().required().label("Telephone"),
      foreign_worker: Yup.string().required().label("Foreign Worker"),
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
      credit_amount: Yup.number()
        .required()
        .positive()
        .integer()
        .label("Credit Amount"),
      duration: Yup.number().required().positive().integer().label("Duration"),
      purpose: Yup.string().required().label("Purpose"),
      other_debtors_guarantors: Yup.string()
        .required()
        .label("Other Debtors/Guarantors"),
      installment_rate_in_percentage_of_disposable_income: Yup.number()
        .min(0, "The installment rate must be a non-negative number.")
        .max(1, "The installment rate must not exceed 1.")
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
    });
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const initialValues = {
    person_id: "",
    status_of_existing_checking_account: "",
    duration: "",
    credit_history: "",
    purpose: "",
    credit_amount: "",
    savings_account_bonds: "",
    present_employment_since: "",
    installment_rate_in_percentage_of_disposable_income: "",
    marital_status: "",
    sex: "",
    other_debtors_guarantors: "",
    present_residence_since: "",
    property: "",
    age: "",
    other_installment_plans: "",
    housing: "",
    number_of_existing_credits_at_this_bank: "",
    job: "",
    number_of_people_being_liable_to_provide_maintenance_for: "",
    telephone: "",
    foreign_worker: "",
  };

  const attributeMapping = {
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

  const catColumns = [
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

  const onSubmit = async (form, { resetForm }) => {
    setLoading(true);
    const saveableData = personalStatusSexEncoder(form)
    try {
      const { data } = await dbClient.post("/users/gapplicants", saveableData);
      toast.success("Saved", {
        position: "top-left",
      });
      console.log(data);
    } catch (error) {
      toast.error("Failed to save", {
        position: "top-left",
      });
      console.log(error);
    }

    try {
      const { data } = await client.post("/predict", form);
      setFormEntry(form);
      console.log(form);
      toast.success("Sent Successfully", {
        position: "top-left",
      });
      setResponse(data[0]);
      setClosePop(false);
      console.log(data);
    } catch (error) {
      toast.error("Failed", {
        position: "top-left",
      });
      console.log(error);
    }
    
    setLoading(false);
  };

  const numericColumns = [
    "duration",
    "credit_amount",
    "installment_rate_in_percentage_of_disposable_income",
    "present_residence_since",
    "age",
    "number_of_existing_credits_at_this_bank",
  ];

  const [numColumn, setNumColumn] = useState("credit_amount");
  const [catColumn, setCatColumn] = useState(
    "status_of_existing_checking_account"
  );

  const getPredClass = () => {
    if (response?.prediction == "Possible Non Defaulter") {
      return 1;
    } else if (response?.prediction == "Possible Defaulter") {
      return 0;
    }
  };

  return (
    <>
      {Object.keys(response).length != 0 && !closePop && show == "graph" && (
        <div className="absolute bg-white w-full h-full flex md:p-10 md:px-32 flex-col items-center overflow-y-scroll">
          <div className="w-full grid grid-cols-2 gap-5">
            <div className="flex flex-col">
              <div className="text-xl text-gray-900 font-bold my-2">
                Population Distributions for Numeric Features
              </div>
              <div className="w-64 mb-20">
                <RegularSelect
                  label={"Select numerical feature to plot"}
                  value={numColumn}
                  options={numericColumns}
                  onChange={(e) => setNumColumn(e.target.value)}
                />
              </div>
              <KDEChart
                title={numColumn}
                highlightPoint={formEntry[numColumn]}
                columnArray={[...data[numColumn], formEntry[numColumn]]}
                classArray={[...data["class"], getPredClass()]}
              />
            </div>
            <div className="flex flex-col">
              <div className="text-xl text-gray-900 font-bold my-2">
                Population Counts for Categorical Features
              </div>
              <div className="w-64 mb-20">
                <RegularSelect
                  label={"Select categorical feature to plot"}
                  value={catColumn}
                  options={catColumns}
                  onChange={(e) => setCatColumn(e.target.value)}
                />
              </div>
              <NormalBarChart
                highlightPoint={mappings[formEntry[catColumn]]}
                columnArray={[
                  ...data[catColumn],
                  mappings[formEntry[catColumn]],
                ]}
                classArray={[...data["class"], getPredClass()]}
                columnTitle={catColumn}
              />
            </div>
          </div>
          <div className="text-xl text-gray-700 font-bold my-2">
            Prediction: {response.prediction}
            <br />
            Probability: {parseFloat(response.proba.toFixed(4)) * 100}%
          </div>
          <div className="flex gap-5">
            <div
              className="bg-green-700 text-white cursor-pointer px-2 py-1 my-2 rounded"
              onClick={() => setShow("global")}
            >
              Show global importances
            </div>
            <div
              className="bg-green-700 text-white cursor-pointer px-2 py-1 my-2 rounded"
              onClick={() => setShow("local")}
            >
              Show local importances
            </div>
          </div>
          <div
            className="mt-5 text-red-400 hover:underline cursor-pointer"
            onClick={() => setClosePop(true)}
          >
            Exit
          </div>
        </div>
      )}
      {Object.keys(response).length != 0 && !closePop && show == "local" && (
        <div className="absolute bg-white w-full h-full flex p-10 flex-col items-center overflow-y-scroll">
          <div className="text-xl text-gray-900 font-bold my-2">
            Feature Influences on Prediction
          </div>
          <div className="w-full">
            <BarChart
              data={response.shap_explanation}
              bias={response.base_value}
            />
          </div>

          <div className="text-xl text-gray-700 font-bold my-2">
            Prediction: {response.prediction}
            <br />
            Probability: {parseFloat(response.proba.toFixed(4)) * 100}%
          </div>
          <div className="flex gap-5">
            <div
              className="bg-green-700 text-white cursor-pointer px-2 py-1 my-2 rounded"
              onClick={() => setShow("global")}
            >
              Show global importances
            </div>
            <div
              className="bg-green-700 text-white cursor-pointer px-2 py-1 my-2 rounded"
              onClick={() => setShow("graph")}
            >
              Show graphs
            </div>
          </div>
          <div
            className="mt-5 text-red-400 hover:underline cursor-pointer"
            onClick={() => setClosePop(true)}
          >
            Exit
          </div>
        </div>
      )}
      {Object.keys(response).length != 0 && !closePop && show == "global" && (
        <div className="absolute bg-white w-full h-full flex p-10 flex-col items-center overflow-y-scroll">
          <div className="text-xl text-gray-900 font-bold my-2">
            Global Feature Importances
          </div>
          <div className="w-full">
            <BarChart global data={response.global_importances} />
          </div>

          <div className="text-xl text-gray-700 font-bold my-2">
            Prediction: {response.prediction}
            <br />
            Probability: {parseFloat(response.proba.toFixed(4)) * 100}%
          </div>
          <div className="flex gap-5">
            <div
              className="bg-green-700 text-white cursor-pointer px-2 py-1 my-2 rounded"
              onClick={() => setShow("local")}
            >
              Show local importances
            </div>
            <div
              className="bg-green-700 text-white cursor-pointer px-2 py-1 my-2 rounded"
              onClick={() => setShow("graph")}
            >
              Show graphs
            </div>
          </div>
          <div
            className="mt-5 text-red-400 hover:underline cursor-pointer"
            onClick={() => setClosePop(true)}
          >
            Exit
          </div>
        </div>
      )}
      <SideNavLayout>
        {
          loading ?
            <div className="bg-white flex flex-col items-center justify-center w-full h-full overflow-scroll">
              <Loader height={200} width={200} />
              <div className="font-semibold">Analyzing...</div>
            </div>
            :
            <div className="bg-white flex flex-col items-start w-full pt-10 h-full overflow-y-scroll px-20">
              <div
                className="text-xl py-2 font-semibold my-5 text-amber-600">
                German Loan Form
              </div>
              <Formik
                initialValues={formEntry || initialValues}
                validationSchema={validationSchema[step]}
                onSubmit={onSubmit}
              >
                {({ errors, validateForm, handleSubmit }) => (
                  <>
                    {step === 0 && (
                      <div className="w-full grid md:grid-cols-2 gap-4">
                        <FormInput label="Person ID" name="person_id" type="text" />
                        <FormInput label="Age" name="age" type="number" />
                        <FormSelect
                          label="Sex"
                          name="sex"
                          options={attributeMapping.sex}
                        />
                        <FormSelect
                          label="Marital Status"
                          name="marital_status"
                          options={attributeMapping.marital_status}
                        />
                        <FormSelect
                          label="Telephone"
                          name="telephone"
                          options={attributeMapping.telephone}
                        />
                        <FormSelect
                          label="Foreign Worker"
                          name="foreign_worker"
                          options={attributeMapping.foreign_worker}
                        />
                        <FormInput
                          label="Present Residence Since"
                          name="present_residence_since"
                          type="number"
                        />
                      </div>
                    )}
                    {step === 1 && (
                      <div className="w-full grid md:grid-cols-2 gap-4">
                        <FormSelect
                          label="Status of Existing Checking Account"
                          name="status_of_existing_checking_account"
                          options={attributeMapping.status_of_existing_checking_account}
                        />
                        <FormSelect
                          label="Savings Account/Bonds"
                          name="savings_account_bonds"
                          options={attributeMapping.savings_account_bonds}
                        />
                        <FormSelect
                          label="Property"
                          name="property"
                          options={attributeMapping.property}
                        />
                        <FormSelect
                          label="Housing"
                          name="housing"
                          options={attributeMapping.housing}
                        />
                        <FormSelect
                          label="Job"
                          name="job"
                          options={attributeMapping.job}
                        />
                        <FormSelect
                          label="Present Employment Since"
                          name="present_employment_since"
                          options={attributeMapping.present_employment_since}
                        />
                      </div>
                    )}
                    {step === 2 && (
                      <div className="w-full grid md:grid-cols-2 gap-4">
                        <FormSelect
                          label="Other Installment Plans"
                          name="other_installment_plans"
                          options={attributeMapping.other_installment_plans}
                        />
                        <FormInput
                          label="Number of Existing Credits at This Bank"
                          name="number_of_existing_credits_at_this_bank"
                          type="number"
                        />
                        <FormInput
                          label="Number of People Being Liable to Provide Maintenance For"
                          name="number_of_people_being_liable_to_provide_maintenance_for"
                          type="number"
                        />
                        <FormSelect
                          label="Credit History"
                          name="credit_history"
                          options={attributeMapping.credit_history}
                        />
                      </div>
                    )}
                    {step === 3 && (
                      <div className="w-full grid md:grid-cols-2 gap-4">
                        <FormInput label="Credit Amount" name="credit_amount" type="number" />
                        <FormInput label="Duration" name="duration" type="number" />
                        <FormSelect
                          label="Purpose"
                          name="purpose"
                          options={attributeMapping.purpose}
                        />
                        <FormSelect
                          label="Other Debtors/Guarantors"
                          name="other_debtors_guarantors"
                          options={attributeMapping.other_debtors_guarantors}
                        />
                        <FormInput
                          label="Installment Rate in Percentage of Disposable Income"
                          name="installment_rate_in_percentage_of_disposable_income"
                          type="number"
                        />
                      </div>
                    )}
                    <div className="flex justify-between mt-20 gap-4 text-sm">
                      {step > 0 && (
                        <button
                          type="button"
                          className="bg-zinc-100 text-zinc-600 py-4 text-sm hover:bg-zinc-600 hover:text-white px-4 rounded"
                          onClick={handlePrevious}
                        >
                          Previous
                        </button>
                      )}
                      {step < validationSchema.length - 1 && (
                        <button
                          type="button"
                          className="bg-blue-100 w-64 py-4 text-sm px-4 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded"
                          onClick={() => handleNext(errors, validateForm)}
                        >
                          Next
                        </button>
                      )}
                      {step === validationSchema.length - 1 && (
                        <Submit
                          className={"bg-amber-100 w-64 py-4 text-sm px-4 text-amber-600 hover:bg-amber-600 hover:text-white font-semibold rounded"}
                          text="Submit"
                        />
                      )}
                    </div>
                  </>
                )}
              </Formik>
            </div>}
      </SideNavLayout>
    </>
  );
}
