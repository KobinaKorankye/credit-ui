import { Formik } from "formik";
import FormInput from "../components/formik/FormInput";
import { useLocation } from "react-router-dom";
import { getApplicantInfoField } from "../helpers";
import Card from "../components/Card";

export default function FormPage({ forApplicants }) {
  const locationState = useLocation().state;
  const readableBody = locationState?.readableBody || {};

  const initialValues = forApplicants
    ? { ...readableBody, ...getApplicantInfoField(readableBody) }
    : readableBody;

  return (
    <div className="space-y-6">
      <Formik initialValues={initialValues}>
        <>
          {/* Personal Details Section */}
          <Card title="Personal Details">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
              <FormInput disabled label="Email" name="email" type="email" />
              <FormInput disabled label="Mobile" name="mobile" type="text" />
              <FormInput disabled label="Sex" name="sex" />
              <FormInput disabled label="Foreign Worker" name="foreign_worker" />
            </div>
          </Card>
          {/* Financial Details Section */}
          <Card title="Financial Details">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
          </Card>

          {/* Loan Details Section */}
          <Card title="Loan Details">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
          </Card>
        </>
      </Formik>
    </div>
  );
}
