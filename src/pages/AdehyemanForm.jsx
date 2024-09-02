import { useEffect, useMemo, useState } from "react";
import FormInput from "../components/formik/FormInput";
import * as Yup from "yup";
import { Formik } from "formik";
import Submit from "../components/formik/Submit";
import client from "../api/client";
import { toast } from "react-toastify";
import React from "react";
import FormSelect from "../components/formik/FormSelect";
import BarChart from "../components/BarChart";
import RegularInput from "../components/RegularInput";
import RegularSelect from "../components/RegularSelect";
import KDEChart from "../components/KDEChart";
// import data from "../data/data.json";
import NormalBarChart from "../components/NormalBarChart";
import {
  attributeMapping,
  catColumns,
  mappings,
  numericColumns,
} from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchGraphData } from "../store/graphDataSlice";
import SideNavLayout from "../layouts/SideNavLayout";
import Loader from "../loader/Loader";
import {
  getPredClass,
  personalStatusSexEncoder,
  transformModelApiObject,
} from "../helpers";
import { useNavigate } from "react-router-dom";


export default function AdehyemanForm() {
  const [show, setShow] = useState("graph");
  const [closePop, setClosePop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [formEntry, setFormEntry] = useState({});
  const navigate = useNavigate();
  const data = useSelector((state)=>state.graphData.data)

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
      .matches(
        /^[a-zA-Z0-9]{6}$/,
        "Person ID must be exactly 6 alphanumeric characters"
      )
      .required()
      .label("Person ID"),
    age: Yup.number().required().positive().integer().label("Age"),
    telephone: Yup.string().required().label("Telephone"),
    sex: Yup.string().required().label("Sex"),
    marital_status: Yup.string().required().label("Marital Status"),
    foreign_worker: Yup.string().required().label("Foreign Worker"),
    }),
    Yup.object().shape({
    job: Yup.string().required().label("Job"),
    present_employment_since: Yup.string()
      .required()
      .label("Present Employment Since"),
    number_of_people_being_liable_to_provide_maintenance_for: Yup.number()
      .required()
      .label("Number of People Being Liable to Provide Maintenance For"),     
    status_of_existing_checking_account: Yup.string()
      .required()
      .label("Status of Existing Checking Account"),
    savings_account_bonds: Yup.string()
      .required()
      .label("Savings Account/Bonds"),
    housing: Yup.string().required().label("Housing"),
    present_residence_since: Yup.number()
    .required()
    .positive()
    .integer()
    .label("Present Residence Since"),
    property: Yup.string().required().label("Property"),
    }),
    Yup.object().shape({
    purpose: Yup.string().required().label("Purpose"),
    credit_amount: Yup.number()
      .required()
      .positive()
      .integer()
      .label("Credit Amount"),
    installment_rate_in_percentage_of_disposable_income: Yup.number()
      .min(0, "The installment rate must be a non-negative number.") // Ensures the number is not negative.
      .max(1, "The installment rate must not exceed 1.") // Ensures the number does not exceed 1.
      .required()
      .label("Installment Rate in Percentage of Disposable Income"),  
    duration: Yup.number().required().positive().integer().label("Duration"),
    number_of_existing_credits_at_this_bank: Yup.number()
    .required()
    .label("Number of Existing Credits at This Bank"),
    credit_history: Yup.string().required().label("Credit History"),   
    other_installment_plans: Yup.string()
      .required()
      .label("Other Installment Plans"),
    }),
    Yup.object().shape({
      other_debtors_guarantors: Yup.string()
      .required()
      .label("Other Debtors/Guarantors"),
    })  
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


  const onSubmit = async (form, { resetForm }) => {
    setLoading(true);
    const saveableData = personalStatusSexEncoder(form);
    try {
      const { data } = await client.post("/gapplicants", saveableData);
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
      navigate("/analysis", { state: { formEntry: form, response: data[0], fullRow: {} } });
      console.log(data);
    } catch (error) {
      toast.error("Failed", {
        position: "top-left",
      });
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <>
      <SideNavLayout>
        {loading ? (
          <div className="bg-white flex flex-col items-center justify-center w-full h-full overflow-scroll">
            <Loader height={200} width={200} />
            <div className="font-semibold">Analyzing...</div>
          </div>
        ) : (
          <div className="bg-white flex flex-col items-start w-full pt-10 h-full overflow-y-scroll px-20">
            <div className="text-xl py-2 font-semibold my-5 text-sky-600">
              Loan Application Form
            </div>
            <Formik
              initialValues={formEntry || initialValues}
              validationSchema={validationSchema[step]}
              onSubmit={onSubmit}
            >
              {({ errors, validateForm, handleSubmit }) => (
                <>
                  {step === 0 && (
                    <><h2 className="text=2xl font-bold pt-1 pb-2">Personal Details</h2>
                    <div className="w-full grid md:grid-cols-2 gap-4">
                        <FormInput
                          label="Person ID"
                          name="person_id"
                          type="text" />
                        <RegularInput label="First Name" type="text" />
                        <RegularInput label="Middle Names" type="text" />
                        <RegularInput label="Last Name" type="text" />
                        <FormInput label="Age" name="age" type="number" />
                        <FormSelect
                          name="telephone"
                          options={attributeMapping.telephone} />
                        <RegularInput label="Email" type="text" />
                        <RegularSelect label="ID Type" options={["Ghana Card", "Passport", "Voter's ID", "Driver's License"]} />
                        <RegularInput label="ID Number" type="text" />
                        <RegularInput label="Nationality" type="text" />
                        <RegularInput label="Residential Address" type="text" />
                        <FormSelect
                          label="Sex"
                          name="sex"
                          options={attributeMapping.sex} />
                        <FormSelect
                          label="Marital Status"
                          name="marital_status"
                          options={attributeMapping.marital_status} />
                        <FormSelect
                          name="foreign_worker"
                          options={attributeMapping.foreign_worker} />
                      </div></>
                  )}
                  {step === 1 && (                      
                    <><h2 className="font-bold pt-1 pb-2">Financial Details</h2><div className="w-full grid md:grid-cols-2 gap-4">
                        <RegularInput label="Customer ID/Account Number" type="text" />
                        <RegularInput label="Monthly Income" type="text" />
                        <RegularInput label="Occupation" type="text" />
                        <FormSelect name="job" options={attributeMapping.job} />
                        <RegularInput label="Employer Name" type="text" />
                        <RegularInput label="Employer Address" type="text" />
                        <RegularSelect label="Field of Employment" options={["Agriculture", "Arts", "Education", "Emergency Services", "Engineering", "Finance", "Health", "Information Technology", "Law Enforcement", "Law", "Legal", "Military", "Retail", "Other"]} />
                        <RegularInput label="If you selected Other, please specify:" type="text" />
                        <FormSelect
                          name="present_employment_since"
                          options={attributeMapping.present_employment_since} />
                        <FormInput
                          name="number_of_people_being_liable_to_provide_maintenance_for"
                          type="number" />
                        <FormSelect
                          name="status_of_existing_checking_account"
                          options={attributeMapping.status_of_existing_checking_account} />
                        <FormSelect
                          name="savings_account_bonds"
                          options={attributeMapping.savings_account_bonds} />
                        <RegularSelect label="Do you have any Bonds or other investments?" options={["Yes", "No"]} />
                        <RegularSelect label="Do you have any Forex Account?" options={["Yes", "No"]} />
                        <FormSelect
                          name="housing"
                          options={attributeMapping.housing} />
                        <FormInput name="present_residence_since" type="number" />
                        <FormSelect
                          name="property"
                          options={attributeMapping.property} />



                      </div></>
                  )}
                  {step === 2 && (
                    <><h2 className="font-bold pt-1 pb-2">Loan Details</h2><div className="w-full grid md:grid-cols-2 gap-4">
                        <FormSelect
                          name="purpose"
                          options={attributeMapping.purpose} />
                        <FormInput
                          label="Credit Amount"
                          name="credit_amount"
                          type="number" />
                        <FormInput
                          name="installment_rate_in_percentage_of_disposable_income"
                          type="number" />
                        <FormInput
                          label="Duration"
                          name="duration"
                          type="number" />
                        <FormInput
                          name="number_of_existing_credits_at_this_bank"
                          type="number" />
                        <RegularSelect label="Have you defaulted on a loan before?" options={["Yes", "No"]} />
                        <FormSelect
                          name="credit_history"
                          options={attributeMapping.credit_history} />
                        <FormSelect
                          name="other_installment_plans"
                          options={attributeMapping.other_installment_plans} />
                        <RegularSelect label="Mode of Loan Payment" options={["Cash", "Mobile Money", "Bank Transfer", "Salary Deduction", "Cheque"]} />
                        <FormSelect
                          name="other_debtors_guarantors"
                          options={attributeMapping.other_debtors_guarantors} />

                      </div></>
                  )}
                  {step === 3 && (
                    <><h3 className="font-bold pt-1 pb-3">Guarantors Information</h3>
                    <h4 className="font-bold pt-1 pb-2">Guarantor 1</h4>
                        <div className="w-full grid md:grid-cols-2 gap-4">

                          <RegularInput label="Surname" type="text" />
                          <RegularInput label="First Name" type="text" />
                          <RegularInput label="Middle Names" type="text" />
                          <RegularInput label="Date of Birth" type="calendar" />
                          <RegularSelect label="ID Type" options={["Ghana Card", "Passport", "Voter's ID", "Driver's License"]} />
                          <RegularInput label="ID Number" type="text" />
                          <RegularInput label="Nationality" type="text" />
                          <RegularInput label="Phone Number" type="text" />
                          <RegularInput label="Email" type="text" />
                          <RegularInput label="Residential Address" type="text" />
                          <RegularInput label="Relationship to Applicant" type="text" />
                          <RegularInput label="Employer Name" type="text" />
                          <RegularInput label="Occupation" type="text" />
                        </div>
                      <h4 className="font-bold pt-8 pb-2">Guarantor 2</h4>
                        <div className="w-full grid md:grid-cols-2 gap-4">
                          <RegularInput label="Surname" type="text" />
                          <RegularInput label="First Name" type="text" />
                          <RegularInput label="Middle Names" type="text" />
                          <RegularInput label="Date of Birth" type="calendar" />
                          <RegularSelect label="ID Type" options={["Ghana Card", "Passport", "Voter's ID", "Driver's License"]} />
                          <RegularInput label="ID Number" type="text" />
                          <RegularInput label="Nationality" type="text" />
                          <RegularInput label="Phone Number" type="text" />
                          <RegularInput label="Email" type="text" />
                          <RegularInput label="Residential Address" type="text" />
                          <RegularInput label="Relationship to Applicant" type="text" />
                          <RegularInput label="Employer Name" type="text" />
                          <RegularInput label="Occupation" type="text" />

                        </div></>
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
                        className={
                          "bg-amber-100 w-64 py-4 text-sm px-4 text-amber-600 hover:bg-amber-600 hover:text-white font-semibold rounded"
                        }
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
