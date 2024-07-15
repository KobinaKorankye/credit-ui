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
import dbClient from "../api/dbClient";
import { useNavigate } from "react-router-dom";

export default function GermanForm() {
  const [loading, setLoading] = useState(false);
  const [formEntry, setFormEntry] = useState({});
  const navigate = useNavigate();
  const data = useSelector((state) => state.graphData.data);

  const dispatch = useDispatch();
  const status = useSelector((state) => state.graphData.status);

  useEffect(() => {
    if (status === "idle") {
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

  const onSubmit = async (form, { resetForm }) => {
    setLoading(true);
    const saveableData = personalStatusSexEncoder(form);
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
      navigate("/analysis", { state: { formEntry: form, response: data[0] } });
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
            <div className="text-xl py-2 font-semibold my-5 text-amber-600">
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
                      <FormInput
                        label="Person ID"
                        name="person_id"
                        type="text"
                      />
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
                        name="telephone"
                        options={attributeMapping.telephone}
                      />
                      <FormSelect
                        name="foreign_worker"
                        options={attributeMapping.foreign_worker}
                      />
                      <FormInput name="present_residence_since" type="number" />
                    </div>
                  )}
                  {step === 1 && (
                    <div className="w-full grid md:grid-cols-2 gap-4">
                      <FormSelect
                        name="status_of_existing_checking_account"
                        options={
                          attributeMapping.status_of_existing_checking_account
                        }
                      />
                      <FormSelect
                        name="savings_account_bonds"
                        options={attributeMapping.savings_account_bonds}
                      />
                      <FormSelect
                        name="property"
                        options={attributeMapping.property}
                      />
                      <FormSelect
                        name="housing"
                        options={attributeMapping.housing}
                      />
                      <FormSelect name="job" options={attributeMapping.job} />
                      <FormSelect
                        name="present_employment_since"
                        options={attributeMapping.present_employment_since}
                      />
                    </div>
                  )}
                  {step === 2 && (
                    <div className="w-full grid md:grid-cols-2 gap-4">
                      <FormSelect
                        name="other_installment_plans"
                        options={attributeMapping.other_installment_plans}
                      />
                      <FormInput
                        name="number_of_existing_credits_at_this_bank"
                        type="number"
                      />
                      <FormInput
                        name="number_of_people_being_liable_to_provide_maintenance_for"
                        type="number"
                      />
                      <FormSelect
                        name="credit_history"
                        options={attributeMapping.credit_history}
                      />
                    </div>
                  )}
                  {step === 3 && (
                    <div className="w-full grid md:grid-cols-2 gap-4">
                      <FormInput
                        label="Credit Amount"
                        name="credit_amount"
                        type="number"
                      />
                      <FormInput
                        label="Duration"
                        name="duration"
                        type="number"
                      />
                      <FormSelect
                        name="purpose"
                        options={attributeMapping.purpose}
                      />
                      <FormSelect
                        name="other_debtors_guarantors"
                        options={attributeMapping.other_debtors_guarantors}
                      />
                      <FormInput
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
