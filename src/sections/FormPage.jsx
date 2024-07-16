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
import { generateName } from "../helpers";

export default function FormPage() {
  const { formEntry, fullRow } = useLocation().state;

  const fromTable = Object.keys(fullRow).length > 0;
  const initialValues = fromTable
    ? {
        ...Object.fromEntries(
          Object.entries(fullRow).map(([key, value]) => [
            key,
            mappings[value] || value,
          ])
        ),
        fullName: generateName(fullRow.id),
      }
    : {
        ...Object.fromEntries(
          Object.entries(formEntry).map(([key, value]) => [
            key,
            mappings[value] || value,
          ])
        ),
      };
  return (
    <div className="bg-white w-full h-screen overflow-y-scroll px-44">
      <Formik initialValues={initialValues}>
        <>
          <div className="text=2xl font-bold pt-10 pb-2">Personal Details</div>

          <div className="w-full grid md:grid-cols-3 gap-4">
            {fromTable && (
              <FormInput
                disabled
                label="Full Name"
                name={"fullName"}
                type="text"
              />
            )}
            <FormInput disabled name="age" type="number" />
            <FormInput disabled name="telephone" />
            {fromTable ? (
              <>
                <FormInput disabled name="personal_status_and_sex" />
              </>
            ) : (
              <>
                <FormInput
                  disabled
                  label="Marital Status"
                  name="marital_status"
                />
                <FormInput disabled label="Sex" name="sex" />
              </>
            )}
            <FormInput disabled label="Foreign Worker" name="foreign_worker" />
          </div>

          <hr className="w-full mt-20 border-t-50 border-black" />
          <h2 className="font-bold pt-10 pb-2">Financial Details</h2>
          <div className="w-full grid md:grid-cols-3 gap-4">
            {fromTable && (
              <FormInput
                disabled
                label="Customer ID"
                name={"_id"}
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
          <h2 className="font-bold pt-10 pb-5">Loan Details</h2>
          <div className="w-full grid md:grid-cols-3 gap-4">
            <FormInput disabled name="credit_amount" type="number" />
            <FormInput disabled name="purpose" />
            <FormInput
              disabled
              name="installment_rate_in_percentage_of_disposable_income"
              type="number"
            />
            <FormInput disabled name="duration" type="number" />
            <FormInput
              disabled
              name="number_of_existing_credits_at_this_bank"
              type="number"
            />
            <FormInput disabled name="credit_history" />
            <FormInput disabled name="other_installment_plans" />
            <FormInput disabled name="other_debtors_guarantors" />
          </div>

          <hr className="w-full mt-20 border-t-50 border-black" />
        </>
      </Formik>
    </div>
  );
}
