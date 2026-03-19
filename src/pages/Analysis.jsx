import { useEffect, useState, useRef } from "react";
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
import { convertArrayOfObjectsToDictionary, findQuartile, getPredClass } from "../helpers";
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
import { format } from "date-fns";
import Card from "../components/Card";
import { getRiskLevel, getRiskColor } from "../hooks/useRiskThresholds";

export default function Analysis() {
  const [numColumn, setNumColumn] = useState("credit_amount");
  const [catColumn, setCatColumn] = useState(
    "status_of_existing_checking_account"
  );
  const { response, modelBody, readableBody } = useLocation().state;
  const [data, setData] = useState({})

  const [showHist4NumGType, setShowHist4NumGType] = useState(false);
  const [globalFI, setGlobalFI] = useState(false);
  const navItems = ["Applicant Details", "Data Analytics", "Feature Importances", "Risk Parameters", "Application Report"];
  const [selectedNav, setSelectedNav] = useState(navItems[0]);
  const [showNumGraph, setShowNumGraph] = useState(true);
  const [recoveries, setRecoveries] = useState(0)
  const [fullScreenReport, setFullScreenReport] = useState(false)
  const [loading, setLoading] = useState(false)

  const printRef = useRef();

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
    <SideNavLayout>
      <div className="flex flex-col h-screen bg-background">
      <Modal isOpen={fullScreenReport}>
        <div onClick={() => setFullScreenReport(false)} className="w-screen h-screen flex flex-col items-center bg-black/50">
          <div ref={printRef} onClick={(e) => { e.stopPropagation() }} className="bg-white w-[50%] h-full overflow-y-auto">
            <div className="flex justify-between text-xl uppercase  font-bold px-16 mt-10">
              <div>{selectedNav}</div>
            </div>
            <div className="px-4 lg:px-16 mt-6 lg:mt-10">
              {/* Personal Information - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-10">
                <div className="text-sm lg:text-base">Name: <span className="font-semibold ml-1">{readableBody.full_name}</span></div>
                <div className="text-sm lg:text-base">Age: <span className="font-semibold ml-1">{readableBody.age}</span></div>
                <div className="text-sm lg:text-base">Sex: <span className="font-semibold ml-1">{readableBody.marital_status}</span></div>
                <div className="text-sm lg:text-base">Foreign worker: <span className="font-semibold ml-1">{readableBody.foreign_worker}</span></div>
              </div>

              <div className="uppercase font-semibold mt-5 mb-1 text-primary text-sm lg:text-base">Loan Terms</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-10">
                <div className="text-sm lg:text-base">Loan Amount: <span className="font-semibold ml-1">GH₵ {numeral(readableBody.loan_amount).format("0,0.00")}</span></div>
                <div className="text-sm lg:text-base">Duration (months): <span className="font-semibold ml-1">{readableBody.duration_in_months}</span></div>
                <div className="text-sm lg:text-base">Purpose: <span className="font-semibold ml-1">{readableBody.purpose}</span></div>
              </div>
              <div className="uppercase font-semibold mt-5 mb-1 text-primary ">KEY MEASURES</div>
              <div className="flex flex-col gap-1">
                <div className="whitespace-nowrap overflow-visible">Debt Service Coverage Ratio: <span className="font-semibold text-base ml-1">{((readableBody.income * readableBody.duration_in_months) / readableBody.loan_amount).toFixed(2)}</span></div>
                <div className="whitespace-nowrap overflow-visible">Probability of Default (PD): <span className="font-semibold text-base ml-1">{numeral(response.default_proba).format('0.00%')}</span></div>
                <div className="whitespace-nowrap overflow-visible">Exposure at Default (EAD): <span className="font-semibold text-base ml-1">GH₵{numeral(readableBody.loan_amount).format('0,0.00')}</span></div>
                <div className="whitespace-nowrap overflow-visible">Loss Given Default (LGD): <span className="font-semibold text-base ml-1">{numeral((readableBody.loan_amount - recoveries) / readableBody.loan_amount).format('0.00%')}</span></div>
              </div>
              <div className="uppercase font-semibold mt-5 mb-1 text-primary ">HISTORY</div>
              <div className="flex flex-col gap-1">
                <div className="whitespace-nowrap overflow-visible">Number of Existing Loans at this bank: <span className="font-semibold text-base ml-1">{readableBody.number_of_existing_credits_at_this_bank}</span></div>
                <div className="whitespace-nowrap overflow-visible">Repayment record: <span className="font-semibold text-base ml-1">{readableBody.other_installment_plans}</span></div>
              </div>
              <div className="uppercase font-semibold mt-5 mb-1 text-primary ">STATISTICS</div>
              <div className="flex flex-col gap-1">
                {Object.keys(data).length !== 0 &&
                  <>
                    <div className="">Loan amount of <span className="font-semibold text-base ml-1">GH₵{numeral(readableBody.loan_amount).format('0,0.00')}</span> falls in the <span className="font-semibold text-base ml-1">{findQuartile(readableBody.loan_amount, data.credit_amount)}</span></div>
                    <div className="">Applicant's age of <span className="font-semibold text-base ml-1">{readableBody.age} years</span> falls in the <span className="font-semibold text-base ml-1">{findQuartile(readableBody.age, data.age)}</span></div>
                  </>
                }
              </div>
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
              <FormPage />
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
                      value={`GH₵${numeral(readableBody.loan_amount).format('0,0.00')}`}
                    />
                    <RiskItem
                      icon={LuFramer}
                      name="Loss Given Default (LGD)"
                      value={`${numeral((readableBody.loan_amount - recoveries) / readableBody.loan_amount).format('0.00%')}`}
                    />
                    <RiskItem
                      icon={LuTrendingDown}
                      name="Expected Loss (EL)"
                      value={`GH₵${numeral(
                        response.default_proba *
                        readableBody.loan_amount *
                        ((readableBody.loan_amount - recoveries) / readableBody.loan_amount)
                      ).format('0,0.00')}`}
                    />
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
                          max={readableBody.loan_amount}
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
                        <span className="text-sm text-muted-foreground">Loan Amount</span>
                        <div className="font-semibold text-foreground text-lg">GH₵ {numeral(readableBody.loan_amount).format("0,0.00")}</div>
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
                          GH₵{numeral(response.default_proba * readableBody.loan_amount * ((readableBody.loan_amount - recoveries) / readableBody.loan_amount)).format('0,0.00')}
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
                          {((readableBody.income * readableBody.duration_in_months) / readableBody.loan_amount).toFixed(2)}
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
                          {((readableBody.loan_amount / (readableBody.income * 12)) * 100).toFixed(1)}%
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
                          <div className="text-sm text-muted-foreground mb-1">Loan Amount</div>
                          <div className="font-semibold text-lg">GH₵{numeral(readableBody.loan_amount).format('0,0.00')}</div>
                          <div className="text-sm text-muted-foreground mt-2">
                            Falls in the <span className="font-medium text-foreground">{findQuartile(readableBody.loan_amount, data.credit_amount)}</span> of historical loan amounts
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

                {/* Final Outcome */}
                <Card title="Final Outcome">
                  <div className="flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className={`inline-flex items-center px-6 py-3 rounded-lg font-bold text-lg border-2 ${
                        readableBody.outcome
                          ? 'border-green-500 text-green-700 bg-green-50 dark:bg-green-950/20'
                          : 'border-red-500 text-red-700 bg-red-50 dark:bg-red-950/20'
                      }`}>
                        {["DEFAULTED", "REPAID"][readableBody.outcome]}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Final outcome as of {format(new Date(readableBody?.date_updated), "dd MMM yyyy")}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </SideNavLayout>
  );
}
