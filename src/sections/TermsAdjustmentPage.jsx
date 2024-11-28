import { useContext, useEffect, useMemo, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { generateName, getApplicantInfoField } from "../helpers";
import Button from "../components/Button";
import numeral from "numeral";
import { BsArrowRight } from "react-icons/bs";
import DataContext from "../contexts/DataContext";
import RegularTextArea from "../components/RegularTextArea";
import UserContext from "../contexts/UserContext";
import { format } from "date-fns";

export default function TermsAdjustmentPage({ forApplicants }) {
  const { response, setResponse, modelBody, setModelBody, readableBody, setReadableBody } = useContext(DataContext);
  const { user } = useContext(UserContext);
  const saved_credit_amount = readableBody.loan_amount_requested
  const saved_duration = readableBody.duration_in_months
  const [credit_amount, setCreditAmount] = useState(readableBody.loan_amount_requested)
  const [duration, setDuration] = useState(readableBody.duration_in_months)
  const [default_proba, setDefaultProba] = useState(response.default_proba)
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState(readableBody[`${user.role}_notes`])
  // const [editDisabled, setEditDisabled] = useState(true)

  const navigate = useNavigate()

  // const initialValues = { ...readableBody, ...getApplicantInfoField(readableBody) }
  // console.log('Initial values', initialValues, modelBody);

  const getPrediction = async () => {
    setLoading(true);
    try {
      const { data } = await client.post("/predict", { ...modelBody, duration, credit_amount });
      setDefaultProba(data[0].default_proba)
      console.log(data);
      toast.success("Successful", {
        position: "top-left",
      });
    } catch (error) {
      toast.error("Failed", {
        position: "top-left",
      });
      console.log(error);
    }
    setLoading(false);
  };

  const makeDecision = async (decision) => {
    setLoading(true);
    try {
      const { data } = await client.put(`/loan-applications/decision/${readableBody.id}`, { decision, user_id: user.id, [`${user.role}_notes`]: notes });
      console.log(data);
      toast.success("Successful", {
        position: "top-left",
      });
      navigate('/applicants')
    } catch (error) {
      toast.error("Failed", {
        position: "top-left",
      });
      console.log(error);
    }
    setLoading(false);
  };

  const updateApplication = async () => {
    setLoading(true);
    try {
      const { data: d } = await client.post("/predict", { ...modelBody, duration, credit_amount });
      const { data } = await client.put(`/loan-applications/${readableBody.id}`, { duration_in_months: duration, loan_amount_requested: credit_amount, [`${user.role}_notes`]: notes });
      console.log(data);
      setResponse(d[0])
      setModelBody({ ...modelBody, credit_amount, duration })
      setReadableBody({ ...readableBody, duration_in_months: duration, loan_amount_requested: credit_amount, [`${user.role}_notes`]: notes })
      toast.success("Successful", {
        position: "top-left",
      });
    } catch (error) {
      toast.error("Failed", {
        position: "top-left",
      });
      console.log(error);
    }
    setLoading(false);
  };

  const decisions = {
    officer: {
      rejected: "review-reject",
      approved: "review-approve"
    },
    reviewer: {
      rejected: "finalize-reject",
      approved: "finalize-approve"
    },
    approver: {
      rejected: "rejected",
      approved: "approved"
    },
  }


  return (
    <div className="bg-white w-full overflow-y-auto px-16 pb-10">
      <>
        <div className="tracking-wider font-serif text-sm font-bold pt-10 pb-5 flex gap-1">Loan Terms <div className="text-xs font-normal flex items-end">(Editable)</div></div>
        <div className="w-full grid lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-14">
          <RegularInput disabled={user.role != 'officer'} onChange={(e) => setCreditAmount(e.target.value)} value={credit_amount} label={'Loan amount'} type="number" />
          <RegularInput disabled={user.role != 'officer'} onChange={(e) => setDuration(e.target.value)} value={duration} label={'Loan duration (months)'} type="number" />
          <div className="flex pt-8 gap-4">
            {
              ((credit_amount != readableBody.loan_amount_requested) || (duration != readableBody.duration_in_months)) &&
              <div onClick={() => {
                setCreditAmount(readableBody.loan_amount_requested); setDuration(readableBody.duration_in_months); setDefaultProba(response.default_proba)
              }} className="flex items-center px-4 py-1 rounded bg-[#222] text-white cursor-pointer">Reset</div>
            }
          </div>
        </div>

        {
          ((credit_amount != saved_credit_amount) || (duration != saved_duration)) &&
          <>
            <div className="tracking-wider font-serif text-sm font-bold pb-5 flex gap-1">Changes</div>
            <div className="flex gap-10 mb-10">
              {
                ((credit_amount != saved_credit_amount)) &&
                <div>
                  <div>Loan Amount</div>
                  <div className="flex gap-2">
                    <div>{saved_credit_amount}</div>
                    <div><BsArrowRight size={20} /></div>
                    <div>{credit_amount}</div>
                  </div>
                </div>
              }
              {
                ((duration != saved_duration)) &&
                <div>
                  <div>Loan Duration</div>
                  <div className="flex gap-2">
                    <div>{saved_duration}</div>
                    <div><BsArrowRight size={20} /></div>
                    <div>{duration}</div>
                  </div>
                </div>
              }
            </div>
          </>
        }

        <div className="flex gap-3">
          <div className="tracking-wider font-serif text-sm font-bold">Probability of Default:
            <span className="text-lg ml-2 text-surface-light">{numeral(default_proba).format('0.00%')}</span>
          </div>
          {
            ((credit_amount != saved_credit_amount) || (duration != saved_duration)) &&
            (
              !loading ?
                <div onClick={getPrediction} className="flex px-2 py-1 bg-primary/30 rounded hover:bg-primary hover:text-white cursor-pointer">Re-evaluate</div>
                :
                <div className="flex px-2 py-1 bg-primary/30 rounded">Re-evaluating...</div>
            )
          }
        </div>

        <div className="md:grid mt-20 grid-cols-3">
          <div className="col-span-2">
            <RegularTextArea disabled={user.role != 'officer'} value={user.role == 'officer' ? notes : readableBody[`officer_notes`]} label={'Officer Notes'} placeholder={'Enter notes/comments here'} onChange={(e) => { setNotes(e.target.value) }} />
          </div>
        </div>
        {
          user.role != 'officer' &&
          <div className="md:grid mt-20 grid-cols-3">
            <div className="col-span-2">
              <RegularTextArea disabled={user.role != 'reviewer'} value={user.role == 'reviewer' ? notes : readableBody[`reviewer_notes`]} label={'Reviewer Notes'} placeholder={'Enter notes/comments here'} onChange={(e) => { setNotes(e.target.value) }} />
            </div>
          </div>
        }
        {
          user.role == 'approver' &&
          <div className="md:grid mt-20 grid-cols-3">
            <div className="col-span-2">
              <RegularTextArea disabled={readableBody['decision_date']} value={user.role == 'approver' ? notes : readableBody[`approver_notes`]} label={'Approver Notes'} placeholder={'Enter notes/comments here'} onChange={(e) => { setNotes(e.target.value) }} />
            </div>
          </div>
        }

        <div>
          {!readableBody['decision_date'] ?
            <div className="flex mt-5">
              {
                !loading ?
                  (
                    ((credit_amount != saved_credit_amount) || (duration != saved_duration) || (notes && notes != readableBody[`${user.role}_notes`])) ?
                      <div onClick={updateApplication} className="flex cursor-pointer px-2 py-2 bg-primary text-white rounded">Save Changes</div>
                      :
                      <div className="flex gap-4">
                        <div onClick={() => { makeDecision(decisions[user.role].rejected) }} className="flex px-4 cursor-pointer py-2 bg-secondary text-white rounded">Reject</div>
                        <div onClick={() => { makeDecision(decisions[user.role].approved) }} className="flex px-4 cursor-pointer py-2 bg-surface-light text-white rounded">Approve</div>
                      </div>
                  )
                  :
                  <div className="flex px-4 py-2 bg-gray-300 text-white rounded">Loading...</div>
              }

            </div>
            :
            <>
              <div className="text-base font-bold mt-10">Final Decision</div>
              <div className={'flex mt-3'}>
                <div className={`uppercase py-3 px-14 font-bold border-2 ${readableBody['decision'] == 'approved' ? 'border-surface-light text-surface-light' : 'border-secondary text-secondary'}`}>
                  {readableBody['decision']}
                </div>
              </div>
              <div className="text-base font-bold mt-5">Decision Date</div>
              <div className="text-base">
                {readableBody['decision_date'] ? format(new Date(readableBody['decision_date']), "do MMMM, yyyy h:mm a") : ''}
              </div>
            </>
          }
        </div>

      </>
    </div>
  );
}
