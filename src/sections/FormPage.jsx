import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Submit from "../components/formik/Submit";
import client from "../api/client";
import { toast } from "react-toastify";
import React from "react";
import FormInput from "../components/formik/FormInput";
import BarChart from "../components/BarChart";
import RegularInput from "../components/RegularInput";
import RegularSelect from "../components/RegularSelect";
import KDEChart from "../components/KDEChart";
// import data from "../data/data.json";
import NormalBarChart from "../components/NormalBarChart";
import { mappings } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchGraphData } from "../store/graphDataSlice";
import { useLocation } from "react-router-dom";
import { generateName, getApplicantInfoField } from "../helpers";

export default function FormPage({ forApplicants }) {
  const { readableBody } = useLocation().state;

  const initialValues = forApplicants
    ? { ...readableBody, ...getApplicantInfoField(readableBody) }
    : readableBody;
  return (
    <div className="bg-white w-full overflow-y-auto px-16">
      <Formik initialValues={initialValues}>
        <>
          <div className="tracking-wider font-serif text-sm font-bold pt-10 pb-2">Personal Details</div>

          <div className="w-full grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <FormInput
              disabled
              label="Full Name"
              name={"full_name"}
              type="text"
            />
            <FormInput disabled name="age" type="number" />
            <FormInput disabled name="telephone" />
            <FormInput
              disabled
              label="Marital Status"
              name="marital_status"
            />
            <FormInput disabled label="Sex" name="sex" />
            <FormInput disabled label="Foreign Worker" name="foreign_worker" />
          </div>
          <hr className="w-full mt-20 border-t-50 border-black" />
          <div className="tracking-wider font-serif text-sm font-bold pt-10 pb-2">Financial Details</div>
          <div className="w-full grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {!forApplicants && (
              <FormInput
                disabled
                label="Customer ID"
                name={"customer_id"}
                type="text"
              />
            )}
            <FormInput disabled name="job" />
            <FormInput disabled name="present_employment_since" />
            <FormInput
              disabled
              name="number_of_people_being_liable_to_provide_maintenance_for"
              type="number"
            />
            <FormInput disabled name="status_of_existing_checking_account" />
            <FormInput disabled name="savings_account_bonds" />
            <FormInput disabled name="housing" />
            <FormInput disabled name="present_residence_since" type="number" />
            <FormInput disabled name="property" />
          </div>

          <hr className="w-full mt-20 border-t-50 border-black" />
          <div className="tracking-wider font-serif text-sm font-bold pt-10 pb-5">Loan Details</div>
          <div className="w-full grid lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-20">
            <FormInput disabled name={!forApplicants ? "loan_amount" : "loan_amount_requested"} label={'Loan amount'} type="number" />
            <FormInput disabled name="purpose" />
            <FormInput
              disabled
              name="installment_rate_in_percentage_of_disposable_income"
              type="number"
            />
            <FormInput disabled name="duration_in_months" label={'Loan duration (months)'} type="number" />
            <FormInput
              disabled
              name="number_of_existing_credits_at_this_bank"
              type="number"
            />
            <FormInput disabled name="credit_history" />
            <FormInput disabled name="other_installment_plans" />
            <FormInput disabled name="other_debtors_guarantors" />
          </div>
        </>
      </Formik>
    </div>
  );
}
