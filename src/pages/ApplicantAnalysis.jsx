import { useEffect, useState, useRef, useMemo } from "react";
import RegularSelect from "../components/RegularSelect";
import BarChart from "../components/BarChart";
import KDEChart from "../components/KDEChart";
import NormalBarChart from "../components/NormalBarChart";
import { ChartLoader } from "../components/CustomLoader";
import {
  catColumns,
  COLUMN_LABELS,
  mappings,
  numericColumns,
} from "../constants";
import { useLocation } from "react-router-dom";
import { convertArrayOfObjectsToDictionary, findQuartile, getApplicantInfoField, getPredClass } from "../helpers";
import StickyTopNav from "../components/StickyTopNav";
import SideNavLayout from "../layouts/SideNavLayout";
import FormPage from "../sections/FormPage";
import Button from "../components/Button";
import { LuFramer, LuPackageOpen, LuPercent, LuTrendingDown, LuPrinter } from "react-icons/lu";
import RiskItem from "../components/RiskItem";
import numeral from "numeral";
import Histogram from "../components/HistogramChart";
import Modal from "../components/modals/Modal";
import { useReactToPrint } from 'react-to-print';
import client from "../api/client";
import { toast } from "react-toastify";
import TermsAdjustmentPage from "../sections/TermsAdjustmentPage";
import DataContext from "../contexts/DataContext";
import Card from "../components/Card";
import { getRiskLevel, getRiskColor, getRiskThresholds } from "../hooks/useRiskThresholds";

export default function ApplicantAnalysis() {
  const [numColumn, setNumColumn] = useState("credit_amount");
  const [catColumn, setCatColumn] = useState(
    "status_of_existing_checking_account"
  );
  const { response: r, modelBody: m, readableBody: rb } = useLocation().state;
  const [data, setData] = useState({})

  const [showHist4NumGType, setShowHist4NumGType] = useState(false);
  const [globalFI, setGlobalFI] = useState(false);
  const navItems = ["Applicant Details", "Data Analytics", "Feature Importances", "Risk Parameters", "Application Report", "Decision"];
  const [selectedNav, setSelectedNav] = useState(navItems[0]);
  const [showNumGraph, setShowNumGraph] = useState(true);
  const [recoveries, setRecoveries] = useState(0)
  const [fullScreenReport, setFullScreenReport] = useState(false)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(r)
  const [modelBody, setModelBody] = useState(m)
  const [readableBody, setReadableBody] = useState(rb)

  const printRef = useRef();

  const readable_info = useMemo(() => {
    return getApplicantInfoField(readableBody);
  }, [readableBody]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const getLoanees = async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/loanees");
      setData(convertArrayOfObjectsToDictionary(data));
    } catch (error) {
      toast.error("Failed to load loanees", {
        position: "top-right",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getLoanees();
  }, [])

  return (
    <DataContext.Provider value={{ response, setResponse, modelBody, setModelBody, readableBody, setReadableBody }}>
      <SideNavLayout>
        <Modal isOpen={fullScreenReport}>
          <div
            onClick={() => setFullScreenReport(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <div
              ref={printRef}
              onClick={(e) => { e.stopPropagation() }}
              className="bg-background w-full max-w-4xl h-full max-h-[90vh] overflow-y-auto rounded-lg shadow-lg"
            >
              <div className="sticky top-0 bg-background border-b border-border p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl lg:text-2xl font-bold text-foreground">{selectedNav}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFullScreenReport(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <div className="p-4 lg:p-6 space-y-6">
                {/* Personal Information */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <div className="font-semibold text-foreground">{readable_info.full_name}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Age:</span>
                      <div className="font-semibold text-foreground">{readable_info.age}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Marital Status:</span>
                      <div className="font-semibold text-foreground">{readable_info.marital_status}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Foreign worker:</span>
                      <div className="font-semibold text-foreground">{readable_info.foreign_worker}</div>
                    </div>
                  </div>
                </div>

                {/* Loan Terms */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">Loan Terms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Requested Loan Amount:</span>
                      <div className="font-semibold text-foreground">GH₵ {numeral(readableBody.loan_amount_requested).format("0,0.00")}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Proposed Duration (months):</span>
                      <div className="font-semibold text-foreground">{readableBody.duration_in_months}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Purpose:</span>
                      <div className="font-semibold text-foreground">{readableBody.purpose}</div>
                    </div>
                  </div>
                </div>

                {/* Key Measures */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">Key Measures</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Debt Service Coverage Ratio:</span>
                      <div className="font-semibold text-foreground">{((readable_info.income * readableBody.duration_in_months) / readableBody.loan_amount_requested).toFixed(2)}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Probability of Default (PD):</span>
                      <div className="font-semibold text-foreground">{numeral(response.default_proba).format('0.00%')}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Exposure at Default (EAD):</span>
                      <div className="font-semibold text-foreground">GH₵{numeral(readableBody.loan_amount_requested).format('0,0.00')}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Loss Given Default (LGD):</span>
                      <div className="font-semibold text-foreground">{numeral((readableBody.loan_amount_requested - recoveries) / readableBody.loan_amount_requested).format('0.00%')}</div>
                    </div>
                  </div>
                </div>

                {/* History */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Number of Existing Loans at this bank:</span>
                      <div className="font-semibold text-foreground">{readableBody.number_of_existing_credits_at_this_bank}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Repayment record:</span>
                      <div className="font-semibold text-foreground">{readableBody.other_installment_plans}</div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                {Object.keys(data).length !== 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-primary">Statistics</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Loan amount comparison:</span>
                        <div className="font-semibold text-foreground">
                          GH₵{numeral(readableBody.loan_amount_requested).format('0,0.00')} falls in the {findQuartile(readableBody.loan_amount_requested, data.credit_amount)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Age comparison:</span>
                        <div className="font-semibold text-foreground">
                          {readableBody.age} years falls in the {findQuartile(readableBody.age, data.age)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>

        {/* Sticky Top Navigation */}
        <StickyTopNav
          navItems={navItems}
          selected={selectedNav}
          setSelected={setSelectedNav}
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="responsive-container py-6 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{selectedNav}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedNav === "Applicant Details" && "Review and manage applicant personal and financial information"}
                  {selectedNav === "Data Analytics" && "Analyze loan assessment data with interactive visualizations"}
                  {selectedNav === "Feature Importances" && "Understand model predictions through feature analysis"}
                  {selectedNav === "Risk Parameters" && "Review key risk metrics and adjust parameters"}
                  {selectedNav === "Application Report" && "Comprehensive application summary and analysis"}
                  {selectedNav === "Decision" && "Make final loan decisions and adjust terms"}
                </p>
              </div>
              {selectedNav === "Application Report" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFullScreenReport(true)}
                  className="flex items-center gap-2"
                >
                  <LuPrinter className="h-4 w-4" />
                  <span className="hidden sm:inline">Full Screen</span>
                </Button>
              )}
            </div>
            {/* Applicant Details Section */}
            {Object.keys(response).length !== 0 && selectedNav ==="Applicant Details" && (
              <FormPage forApplicants />
            )}

            {/* Data Analytics Section */}
            {Object.keys(response).length !== 0 && selectedNav ==="Data Analytics" && (
              <div className="space-y-6">
                {/* Controls Section */}
                <Card title="Chart Controls">
                  <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-6">
                      <div className="flex-1">
                        <RegularSelect
                          label={showNumGraph ? "Select numerical feature to plot" : "Select categorical feature to plot"}
                          value={showNumGraph ? numColumn : catColumn}
                          options={showNumGraph ? numericColumns : catColumns}
                          labelsMap={COLUMN_LABELS}
                          onChange={(e) => showNumGraph ? setNumColumn(e.target.value) : setCatColumn(e.target.value)}
                        />
                      </div>

                      {/* Chart Type Toggle */}
                      <div className="inline-flex bg-muted rounded-lg p-1">
                        <button
                          onClick={() => setShowNumGraph(true)}
                          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            showNumGraph
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Numeric
                        </button>
                        <button
                          onClick={() => setShowNumGraph(false)}
                          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            !showNumGraph
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Categorical
                        </button>
                      </div>
                    </div>

                    {/* Chart Display Options for Numeric */}
                    {showNumGraph && (
                      <div className="inline-flex bg-muted rounded-lg p-1">
                        <button
                          onClick={() => setShowHist4NumGType(false)}
                          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            !showHist4NumGType
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Density Plot
                        </button>
                        <button
                          onClick={() => setShowHist4NumGType(true)}
                          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            showHist4NumGType
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Histogram
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
                {/* Chart Visualization */}
                <Card title={`${showNumGraph ? COLUMN_LABELS[numColumn] : COLUMN_LABELS[catColumn]} Analysis`}>
                  <div className="h-[400px] lg:h-[500px]">
                    {loading ? (
                      <ChartLoader height={500} />
                    ) : showNumGraph ? (
                      !showHist4NumGType ? (
                        <KDEChart
                          title={COLUMN_LABELS[numColumn]}
                          columnName={numColumn}
                          height={500}
                          showInfo
                          highlightPoint={modelBody[numColumn]}
                          columnArray={[...data[numColumn], modelBody[numColumn]]}
                          classArray={[...(data["class"] || data["class_"]), getPredClass(response)]}
                        />
                      ) : (
                        <Histogram
                          title={COLUMN_LABELS[numColumn]}
                          columnName={numColumn}
                          numBins={8}
                          height={500}
                          showInfo
                          highlightPoint={modelBody[numColumn]}
                          columnArray={[...data[numColumn], modelBody[numColumn]]}
                          classArray={[...(data["class"] || data["class_"]), getPredClass(response)]}
                        />
                      )
                    ) : (
                      <NormalBarChart
                        showInfo
                        height={500}
                        title={COLUMN_LABELS[catColumn]}
                        highlightPoint={mappings[modelBody[catColumn]]}
                        columnArray={[
                          ...(data[catColumn].map((val) => mappings[val])),
                          mappings[modelBody[catColumn]],
                        ]}
                        classArray={[...(data["class"] || data["class_"]), getPredClass(response)]}
                        columnTitle={catColumn}
                      />
                    )}
                  </div>
                </Card>
              </div>
            )}
            {/* Feature Importances Section */}
            {Object.keys(response).length !== 0 && selectedNav ==="Feature Importances" && (
              <div className="space-y-6">
                {/* Controls Section */}
                <Card title="Feature Importance Settings">
                  <div className="space-y-2">
                    <div className="inline-flex bg-muted rounded-lg p-1">
                      <button
                        onClick={() => setGlobalFI(false)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          !globalFI
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Local
                      </button>
                      <button
                        onClick={() => setGlobalFI(true)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          globalFI
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Global
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {globalFI
                        ? "Shows overall feature importance across all predictions"
                        : "Shows feature influence specific to this applicant"}
                    </p>
                  </div>
                </Card>

                {/* Chart Visualization */}
                <Card title={globalFI ? "Global Feature Importances" : "Local Feature Importances"}>
                  <div className="h-[600px] lg:h-[800px]">
                    {loading ? (
                      <ChartLoader height={globalFI ? 800 : 600} />
                    ) : globalFI ? (
                      <BarChart height={800} global data={response.global_importances} />
                    ) : (
                      <BarChart
                        height={600}
                        data={response.shap_explanation}
                        bias={response.base_value}
                      />
                    )}
                  </div>
                </Card>
              </div>
            )}
            {/* Risk Parameters Section */}
            {Object.keys(response).length !== 0 && selectedNav ==="Risk Parameters" && (
              <div className="space-y-6">
                {/* Risk Metrics Overview */}
                <Card title="Risk Assessment Metrics">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <RiskItem
                      icon={LuPercent}
                      name="Probability of Default (PD)"
                      value={`${numeral(response.default_proba).format('0.00%')}`}
                    />
                    <RiskItem
                      icon={LuPackageOpen}
                      name="Exposure at Default (EAD)"
                      value={`GH₵${numeral(readableBody.loan_amount_requested).format('0,0.00')}`}
                    />
                    <RiskItem
                      icon={LuFramer}
                      name="Loss Given Default (LGD)"
                      value={`${numeral((readableBody.loan_amount_requested - recoveries) / readableBody.loan_amount_requested).format('0.00%')}`}
                    />
                    <RiskItem
                      icon={LuTrendingDown}
                      name="Expected Loss (EL)"
                      value={`GH₵${numeral(
                        response.default_proba *
                        readableBody.loan_amount_requested *
                        ((readableBody.loan_amount_requested - recoveries) / readableBody.loan_amount_requested)
                      ).format('0,0.00')}`}
                    />
                  </div>
                </Card>

                {/* Risk Calculation Details */}
                <Card title="Risk Calculation Breakdown">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Calculation Formula</h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium">Expected Loss (EL) = </span>
                          <span>PD × EAD × LGD</span>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium">Loss Given Default (LGD) = </span>
                          <span>(EAD - Recovery Amount) / EAD</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Current Values</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-muted/20 rounded">
                          <span>Loan Amount:</span>
                          <span className="font-medium">GH₵{numeral(readableBody.loan_amount_requested).format('0,0.00')}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/20 rounded">
                          <span>Recovery Amount:</span>
                          <span className="font-medium">GH₵{numeral(recoveries).format('0,0.00')}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/20 rounded">
                          <span>Default Probability:</span>
                          <span className="font-medium">{numeral(response.default_proba).format('0.00%')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Editable Parameters */}
                <Card title="Adjustable Parameters">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-foreground">Recovery Amount (GH₵)</label>
                      <div className="flex gap-2">
                        <input
                          className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={recoveries}
                          onChange={(e) => setRecoveries(e.target.value)}
                          type="number"
                          placeholder="Enter recovery amount"
                          min="0"
                          max={readableBody.loan_amount_requested}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRecoveries(0)}
                        >
                          Reset
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Adjust the expected recovery amount in case of default. This affects LGD and EL calculations.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            {/* Application Report Section */}
            {Object.keys(response).length !== 0 && selectedNav ==="Application Report" && (
              <div className="space-y-6">
                {/* Application Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Personal Information */}
                  <Card title="Personal Information">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Full Name</span>
                        <div className="font-semibold text-foreground">{readableBody.full_name}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Age</span>
                        <div className="font-semibold text-foreground">{readableBody.age} years</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Marital Status</span>
                        <div className="font-semibold text-foreground">{readableBody.marital_status}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Foreign Worker</span>
                        <div className="font-semibold text-foreground">{readableBody.foreign_worker}</div>
                      </div>
                    </div>
                  </Card>

                  {/* Loan Details */}
                  <Card title="Loan Application">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Requested Amount</span>
                        <div className="font-semibold text-foreground text-lg">GH₵ {numeral(readableBody.loan_amount_requested).format("0,0.00")}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <div className="font-semibold text-foreground">{readableBody.duration_in_months} months</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Purpose</span>
                        <div className="font-semibold text-foreground">{readableBody.purpose}</div>
                      </div>
                    </div>
                  </Card>

                  {/* Risk Summary */}
                  <Card title="Risk Assessment">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Default Probability</span>
                        <div className={`font-semibold text-lg ${getRiskColor(response.default_proba)}`}>
                          {numeral(response.default_proba).format('0.00%')}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Risk Level</span>
                        <div className={`font-semibold ${getRiskColor(response.default_proba)}`}>
                          {getRiskLevel(response.default_proba).label}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Expected Loss</span>
                        <div className="font-semibold text-foreground">
                          GH₵{numeral(response.default_proba * readableBody.loan_amount_requested * ((readableBody.loan_amount_requested - recoveries) / readableBody.loan_amount_requested)).format('0,0.00')}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Financial Metrics */}
                  <Card title="Financial Analysis">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Debt Service Coverage Ratio</span>
                        <div className="font-semibold text-foreground text-lg">
                          {((readableBody.income * readableBody.duration_in_months) / readableBody.loan_amount_requested).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Higher ratios indicate better ability to service debt
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Monthly Income</span>
                        <div className="font-semibold text-foreground">
                          GH₵{numeral(readableBody.income).format('0,0.00')}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Loan-to-Income Ratio</span>
                        <div className="font-semibold text-foreground">
                          {((readableBody.loan_amount_requested / (readableBody.income * 12)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Credit History */}
                  <Card title="Credit History & Background">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Existing Credits</span>
                        <div className="font-semibold text-foreground">
                          {readableBody.number_of_existing_credits_at_this_bank} active loan(s)
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Repayment History</span>
                        <div className="font-semibold text-foreground">{readableBody.other_installment_plans}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Credit History</span>
                        <div className="font-semibold text-foreground">{readableBody.credit_history}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Employment Status</span>
                        <div className="font-semibold text-foreground">{readableBody.job}</div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Comparative Statistics */}
                {Object.keys(data).length !== 0 && (
                  <Card title="Comparative Analysis">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Loan Amount Comparison</h4>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Requested Amount</div>
                          <div className="font-semibold text-lg">GH₵{numeral(readableBody.loan_amount_requested).format('0,0.00')}</div>
                          <div className="text-sm text-muted-foreground mt-2">
                            Falls in the <span className="font-medium text-foreground">{findQuartile(readableBody.loan_amount_requested, data.credit_amount)}</span> of historical loan amounts
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Age Demographics</h4>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Applicant Age</div>
                          <div className="font-semibold text-lg">{readableBody.age} years</div>
                          <div className="text-sm text-muted-foreground mt-2">
                            Falls in the <span className="font-medium text-foreground">{findQuartile(readableBody.age, data.age)}</span> of applicant ages
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Recommendation Summary */}
                <Card title="Assessment Summary">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Risk Assessment</h4>
                      <div className={`p-4 rounded-lg border-l-4 ${
                        getRiskLevel(response.default_proba).label === 'High Risk'
                          ? 'bg-red-50 border-red-500 dark:bg-red-950/20'
                          : getRiskLevel(response.default_proba).label === 'Medium Risk'
                            ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-950/20'
                            : 'bg-green-50 border-green-500 dark:bg-green-950/20'
                      }`}>
                        <div className="font-medium">
                          {getRiskLevel(response.default_proba).label} Application
                        </div>
                        <div className="text-sm mt-1">
                          Default probability: {numeral(response.default_proba).format('0.00%')}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Key Factors</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Debt Service Coverage:</span>
                          <span className="font-medium">{((readableBody.income * readableBody.duration_in_months) / readableBody.loan_amount_requested).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Credit History:</span>
                          <span className="font-medium">{readableBody.credit_history}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Existing Credits:</span>
                          <span className="font-medium">{readableBody.number_of_existing_credits_at_this_bank}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Decision Section */}
            {Object.keys(response).length !== 0 && selectedNav ==="Decision" && (
              <TermsAdjustmentPage />
            )}
          </div>
        </div>
      </SideNavLayout>
    </DataContext.Provider>
  );
}
