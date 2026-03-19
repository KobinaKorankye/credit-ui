import { useContext, useState } from "react";
import client from "../api/client";
import { toast } from "react-toastify";
import { getRiskLevel, getRiskColor } from "../hooks/useRiskThresholds";
import RegularInput from "../components/RegularInput";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import numeral from "numeral";
import { BsArrowRight } from "react-icons/bs";
import { LuRefreshCw, LuSave, LuCheck, LuX, LuInfo } from "react-icons/lu";
import DataContext from "../contexts/DataContext";
import RegularTextArea from "../components/RegularTextArea";
import UserContext from "../contexts/UserContext";
import { format } from "date-fns";
import Card from "../components/Card";

export default function TermsAdjustmentPage() {
  const { response, setResponse, modelBody, setModelBody, readableBody, setReadableBody } = useContext(DataContext);
  const { user } = useContext(UserContext);
  const saved_credit_amount = readableBody.loan_amount_requested
  const saved_duration = readableBody.duration_in_months
  const [credit_amount, setCreditAmount] = useState(readableBody.loan_amount_requested)
  const [duration, setDuration] = useState(readableBody.duration_in_months)
  const [default_proba, setDefaultProba] = useState(response.default_proba)
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState(readableBody[`${user.role}_notes`])
  const navigate = useNavigate()

  const getPrediction = async () => {
    setLoading(true);
    try {
      const { data } = await client.post("/predict", { ...modelBody, duration, credit_amount });
      setDefaultProba(data[0].default_proba)
    } catch (error) {
      toast.error("Failed", {
        position: "top-right",
      });
    }
    setLoading(false);
  };

  const makeDecision = async (decision) => {
    setLoading(true);
    try {
      const { data } = await client.put(`/loan-applications/decision/${readableBody.id}`, { decision, user_id: user.id, [`${user.role}_notes`]: notes });
      navigate('/applicants')
    } catch (error) {
      toast.error("Failed", {
        position: "top-right",
      });
    }
    setLoading(false);
  };

  const updateApplication = async () => {
    setLoading(true);
    try {
      const { data: d } = await client.post("/predict", { ...modelBody, duration, credit_amount });
      const { data } = await client.put(`/loan-applications/${readableBody.id}`, { duration_in_months: duration, loan_amount_requested: credit_amount, [`${user.role}_notes`]: notes });
      setResponse(d[0])
      setModelBody({ ...modelBody, credit_amount, duration })
      setReadableBody({ ...readableBody, duration_in_months: duration, loan_amount_requested: credit_amount, [`${user.role}_notes`]: notes })
    } catch (error) {
      toast.error("Failed", {
        position: "top-right",
      });
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
    <div className="space-y-6">
      {/* Loan Terms Adjustment */}
      <Card title="Loan Terms Adjustment">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <RegularInput
              disabled={user.role !== 'officer'}
              onChange={(e) => setCreditAmount(e.target.value)}
              value={credit_amount}
              label={'Loan Amount (GH₵)'}
              type="number"
            />
            <RegularInput
              disabled={user.role !== 'officer'}
              onChange={(e) => setDuration(e.target.value)}
              value={duration}
              label={'Loan Duration (months)'}
              type="number"
            />
            <div className="flex items-end gap-2">
              {((credit_amount != readableBody.loan_amount_requested) || (duration != readableBody.duration_in_months)) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCreditAmount(readableBody.loan_amount_requested);
                    setDuration(readableBody.duration_in_months);
                    setDefaultProba(response.default_proba)
                  }}
                  className="flex items-center gap-2"
                >
                  <LuRefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {user.role !== 'officer' && (
            <div className="p-3 bg-muted/30 rounded-lg border border-muted">
              <p className="text-sm text-muted-foreground">
                <LuInfo className="inline h-4 w-4 mr-1" />
                Only loan officers can modify loan terms
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Changes Summary */}
      {((credit_amount != saved_credit_amount) || (duration != saved_duration)) && (
        <Card title="Proposed Changes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(credit_amount != saved_credit_amount) && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Loan Amount</h4>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">GH₵{numeral(saved_credit_amount).format('0,0.00')}</span>
                  <BsArrowRight className="text-muted-foreground" />
                  <span className="font-medium text-primary">GH₵{numeral(credit_amount).format('0,0.00')}</span>
                </div>
              </div>
            )}
            {(duration != saved_duration) && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Loan Duration</h4>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">{saved_duration} months</span>
                  <BsArrowRight className="text-muted-foreground" />
                  <span className="font-medium text-primary">{duration} months</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Risk Assessment */}
      <Card title="Risk Assessment">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Probability of Default</span>
            <div className={`text-2xl font-bold ${getRiskColor(default_proba)}`}>
              {numeral(default_proba).format('0.00%')}
            </div>
            <div className={`text-sm font-medium ${getRiskColor(default_proba)}`}>
              {getRiskLevel(default_proba).label}
            </div>
          </div>

          {((credit_amount != saved_credit_amount) || (duration != saved_duration)) && (
            <Button
              onClick={getPrediction}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <LuRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Re-evaluating...' : 'Re-evaluate Risk'}
            </Button>
          )}
        </div>
      </Card>

      {/* Notes and Comments */}
      <div className="space-y-6">
        {/* Officer Notes */}
        <Card title="Officer Notes">
          <RegularTextArea
            disabled={user.role !== 'officer'}
            value={user.role === 'officer' ? notes : readableBody[`officer_notes`]}
            label={'Comments and Analysis'}
            placeholder={'Enter detailed notes about the application assessment...'}
            onChange={(e) => { setNotes(e.target.value) }}
            rows={4}
          />
        </Card>

        {/* Reviewer Notes */}
        {user.role !== 'officer' && (
          <Card title="Reviewer Notes">
            <RegularTextArea
              disabled={user.role !== 'reviewer'}
              value={user.role === 'reviewer' ? notes : readableBody[`reviewer_notes`]}
              label={'Review Comments'}
              placeholder={'Enter review comments and recommendations...'}
              onChange={(e) => { setNotes(e.target.value) }}
              rows={4}
            />
          </Card>
        )}

        {/* Approver Notes */}
        {user.role === 'approver' && (
          <Card title="Approver Notes">
            <RegularTextArea
              disabled={readableBody['decision_date']}
              value={user.role === 'approver' ? notes : readableBody[`approver_notes`]}
              label={'Final Decision Comments'}
              placeholder={'Enter final approval/rejection reasoning...'}
              onChange={(e) => { setNotes(e.target.value) }}
              rows={4}
            />
          </Card>
        )}
      </div>

      {/* Decision Actions */}
      <Card title="Decision Actions">
        {!readableBody['decision_date'] ? (
          <div className="space-y-4">
            {((credit_amount != saved_credit_amount) || (duration != saved_duration) || (notes && notes != readableBody[`${user.role}_notes`])) ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={updateApplication}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <LuSave className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <p className="text-sm text-muted-foreground flex items-center">
                  Save changes before making final decision
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="destructive"
                  onClick={() => { makeDecision(decisions[user.role].rejected) }}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <LuX className="h-4 w-4" />
                  Reject Application
                </Button>
                <Button
                  onClick={() => { makeDecision(decisions[user.role].approved) }}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <LuCheck className="h-4 w-4" />
                  Approve Application
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Final Decision</h4>
              <div className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm border-2 ${
                readableBody['decision'] === 'approved'
                  ? 'border-green-500 text-green-700 bg-green-50 dark:bg-green-950/20'
                  : 'border-red-500 text-red-700 bg-red-50 dark:bg-red-950/20'
              }`}>
                {readableBody['decision'] === 'approved' ? (
                  <LuCheck className="h-4 w-4 mr-2" />
                ) : (
                  <LuX className="h-4 w-4 mr-2" />
                )}
                {readableBody['decision'].toUpperCase()}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Decision Date</h4>
              <p className="text-foreground">
                {readableBody['decision_date'] ? format(new Date(readableBody['decision_date']), "do MMMM, yyyy h:mm a") : ''}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
