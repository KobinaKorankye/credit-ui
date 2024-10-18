import { useEffect, useState, useRef } from "react";
import React from "react";
import RegularSelect from "../components/RegularSelect";
import BarChart from "../components/BarChart";
import KDEChart from "../components/KDEChart";
import NormalBarChart from "../components/NormalBarChart";
import {
  catColumns,
  COLUMN_LABELS,
  mappings,
  numericColumns,
} from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchGraphData } from "../store/graphDataSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { convertArrayOfObjectsToDictionary, findQuartile, generateName, getPredClass } from "../helpers";
import ReactSwitch from "react-switch";
import MiniSideNav from "../components/MiniSideNav";
import SideNavLayout from "../layouts/SideNavLayout";
import FormPage from "../sections/FormPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import { LuCoins, LuFramer, LuPackageOpen, LuPercent, LuTrendingDown } from "react-icons/lu";
import { FaMoneyBill, FaRegMoneyBillAlt } from "react-icons/fa";
import RiskItem from "../components/RiskItem";
import numeral from "numeral";
import ProbDensityChart from "../components/charts/ProbDensityChart";
import { getColumnRangeHistogramData, getKDEData } from "../components/charts/helpers";
import Histogram from "../components/HistogramChart";
import HistogramChart from "../components/charts/HistogramChart";
import Modal from "../components/modals/Modal";
import { useReactToPrint } from 'react-to-print';
import client from "../api/client";
import { toast } from "react-toastify";

export default function Analysis() {
  const [numColumn, setNumColumn] = useState("credit_amount");
  const [catColumn, setCatColumn] = useState(
    "status_of_existing_checking_account"
  );
  const [show, setShow] = useState("graph");

  const { response, modelBody, readableBody } = useLocation().state;
  const [data, setData] = useState({})

  const navigate = useNavigate();

  const [showHist4NumGType, setShowHist4NumGType] = useState(false);
  const [globalFI, setGlobalFI] = useState(false);
  const navItems = ["Applicant Details", "Data Analytics", "Feature Importances", "Risk Parameters", "Application Report", "Decision"];
  const [selectedNav, setSelectedNav] = useState(navItems[0]);
  const [showNumGraph, setShowNumGraph] = useState(true);
  const [recoveries, setRecoveries] = useState(0)
  const [fullScreenReport, setFullScreenReport] = useState(false)
  const [loading, setLoading] = useState(false)

  const printRef = useRef();

  console.log(useLocation().state)

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const getLoanees = async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/loanees");
      // toast.success("Loaded Successfully", {
      //   position: "top-left",
      // });
      console.log('Dataa:', data)
      setData(convertArrayOfObjectsToDictionary(data));
    } catch (error) {
      toast.error("Failed", {
        position: "top-left",
      });
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getLoanees();
  }, [])

  return (
    <SideNavLayout>
      <Modal isOpen={fullScreenReport}>
        <div onClick={() => setFullScreenReport(false)} className="w-screen h-screen flex flex-col items-center bg-black/50">
          <div ref={printRef} onClick={(e) => { e.stopPropagation() }} className="bg-white w-[50%] h-full overflow-y-auto">
            <div className="flex justify-between text-xl uppercase font-serif font-bold px-16 mt-10">
              <div>{selectedNav}</div>
            </div>
            <div className="px-16 mt-10">
              <div className="grid grid-cols-3 gap-x-10">
                <div className="whitespace-nowrap overflow-visible">Name: <span className="font-semibold text-base ml-1">{readableBody.full_name}</span></div>
                <div className="whitespace-nowrap overflow-visible">Age: <span className="font-semibold text-base ml-1">{readableBody.age}</span></div>
                <div className="whitespace-nowrap overflow-visible">Sex: <span className="font-semibold text-base ml-1">{readableBody.marital_status}</span></div>
                <div className="whitespace-nowrap overflow-visible">Foreign worker: <span className="font-semibold text-base ml-1">{readableBody.foreign_worker}</span></div>
              </div>
              <div className="uppercase font-semibold mt-5 mb-1 text-primary font-serif">Loan Terms</div>
              <div className="grid grid-cols-3 gap-10">
                <div className="whitespace-nowrap overflow-visible">Loan Amount: <span className="font-semibold text-base ml-1">GH₵ {numeral(readableBody.loan_amount).format("0,0.00")}</span></div>
                <div className="whitespace-nowrap overflow-visible">Duration (months): <span className="font-semibold text-base ml-1">{readableBody.duration_in_months}</span></div>
                <div className="whitespace-nowrap overflow-visible">Purpose: <span className="font-semibold text-base ml-1">{readableBody.purpose}</span></div>
              </div>
              <div className="uppercase font-semibold mt-5 mb-1 text-primary font-serif">KEY MEASURES</div>
              <div className="flex flex-col gap-1">
                <div className="whitespace-nowrap overflow-visible">Debt Service Coverage Ratio: <span className="font-semibold text-base ml-1">{((readableBody.income * readableBody.duration_in_months) / readableBody.loan_amount).toFixed(2)}</span></div>
                <div className="whitespace-nowrap overflow-visible">Probability of Default (PD): <span className="font-semibold text-base ml-1">{numeral(response.proba).format('0.00%')}</span></div>
                <div className="whitespace-nowrap overflow-visible">Exposure at Default (EAD): <span className="font-semibold text-base ml-1">GH₵{numeral(readableBody.loan_amount).format('0,0.00')}</span></div>
                <div className="whitespace-nowrap overflow-visible">Loss Given Default (LGD): <span className="font-semibold text-base ml-1">{numeral((readableBody.loan_amount - recoveries) / readableBody.loan_amount).format('0.00%')}</span></div>
              </div>
              <div className="uppercase font-semibold mt-5 mb-1 text-primary font-serif">HISTORY</div>
              <div className="flex flex-col gap-1">
                <div className="whitespace-nowrap overflow-visible">Number of Existing Loans at this bank: <span className="font-semibold text-base ml-1">{readableBody.number_of_existing_credits_at_this_bank}</span></div>
                <div className="whitespace-nowrap overflow-visible">Repayment record: <span className="font-semibold text-base ml-1">{readableBody.other_installment_plans}</span></div>
              </div>
              <div className="uppercase font-semibold mt-5 mb-1 text-primary font-serif">STATISTICS</div>
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
      <div className={`flex flex-1`}>
        <div className="flex-[1] flex items-start">
          <MiniSideNav
            navItems={navItems}
            selected={selectedNav}
            setSelected={setSelectedNav}
          />
        </div>
        <div className="flex-[5] flex flex-col w-full h-full shadow bg-white">
          <div className="flex justify-between items-center px-16 mt-10">
            <div className="text-surface-light/80 text-lg uppercase font-serif font-bold ">{selectedNav}</div>
            {
              selectedNav === "Application Report" &&
              <div onClick={() => setFullScreenReport(true)} className="rounded-lg bg-primary text-white cursor-pointer text-xs py-1 px-2">Full Screen</div>
            }
          </div>
          {Object.keys(response).length != 0 && selectedNav == "Applicant Details" && (
            <FormPage />
          )}

          {Object.keys(response).length != 0 && selectedNav == "Data Analytics" && (
            <div className="bg-white border-primary w-full h-full flex px-16 flex-col items-center">
              <div className="w-full gap-5">
                {showNumGraph ? (
                  <div className="flex flex-col">
                    {/* <div className="text-2xl text-center text-gray-900 font-bold my-2">
                      Loan Assessment Data Analytics
                    </div> */}
                    <div className="flex gap-5">
                      <RegularSelect
                        label={"Select numerical feature to plot"}
                        value={numColumn}
                        options={numericColumns}
                        labelsMap={COLUMN_LABELS}
                        onChange={(e) => setNumColumn(e.target.value)}
                      />

                      <div className="flex w-[180px] text-white items-end justify-center">
                        <div
                          onClick={() => setShowNumGraph(true)}
                          className={`flex-1 cursor-pointer ${showNumGraph
                            ? "bg-teal-600 text-white"
                            : "bg-slate-200 text-black"
                            } h-10 flex items-center justify-center text-sm rounded-l-lg`}
                        >
                          Numeric
                        </div>
                        <div
                          onClick={() => setShowNumGraph(false)}
                          className={`flex-1 cursor-pointer ${!showNumGraph
                            ? "bg-teal-600 text-white"
                            : "bg-slate-200 text-black"
                            } h-10 flex items-center justify-center text-sm rounded-r-lg`}
                        >
                          Categorical
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-5 w-full h-[10] text-sm items-center mt-8 mb-10">
                      <ReactSwitch
                        onChange={(nextChecked) =>
                          setShowHist4NumGType(nextChecked)
                        }
                        checked={showHist4NumGType}
                        offColor="#888"
                        onColor="#0c6"
                        checkedIcon={false}
                        uncheckedIcon={false}
                      />
                      {showHist4NumGType
                        ? "Showing Histogram"
                        : "Showing Probabilty Density Plot"}
                    </div>
                    {!showHist4NumGType ? (
                      <>
                        {/* <ProbDensityChart height={300} grid data={getKDEData(data, numColumn)} /> */}
                        <KDEChart
                          title={COLUMN_LABELS[numColumn]}
                          columnName={numColumn}
                          height={300}
                          showInfo
                          highlightPoint={modelBody[numColumn]}
                          columnArray={[...data[numColumn], modelBody[numColumn]]}
                          classArray={[...(data["class"] || data["class_"]), getPredClass(response)]}
                        />
                      </>
                    ) : (
                      <>
                        {/* <HistogramChart height={300}
                          grid data={getColumnRangeHistogramData(data, numColumn, 8)}
                        /> */}
                        <Histogram
                          title={COLUMN_LABELS[numColumn]}
                          columnName={numColumn}
                          numBins={8}
                          height={300}
                          showInfo
                          highlightPoint={modelBody[numColumn]}
                          columnArray={[...data[numColumn], modelBody[numColumn]]}
                          classArray={[...(data["class"] || data["class_"]), getPredClass(response)]}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {/* <div className="text-2xl text-center text-gray-900 font-bold my-2">
                      Loan Assessment Data Analytics
                    </div> */}
                    <div className="flex gap-5">
                      <RegularSelect
                        labelsMap={COLUMN_LABELS}
                        label={"Select categorical feature to plot"}
                        value={catColumn}
                        options={catColumns}
                        onChange={(e) => setCatColumn(e.target.value)}
                      />
                      <div className="flex w-[180px] text-white items-end justify-center">
                        <div
                          onClick={() => setShowNumGraph(true)}
                          className={`flex-1 cursor-pointer ${showNumGraph
                            ? "bg-teal-600 text-white"
                            : "bg-slate-200 text-black"
                            } h-10 flex items-center justify-center text-sm rounded-l-lg`}
                        >
                          Numeric
                        </div>
                        <div
                          onClick={() => setShowNumGraph(false)}
                          className={`flex-1 cursor-pointer ${!showNumGraph
                            ? "bg-teal-600 text-white"
                            : "bg-slate-200 text-black"
                            } h-10 flex items-center justify-center text-sm rounded-r-lg`}
                        >
                          Categorical
                        </div>
                      </div>
                    </div>
                    <div className="mt-16">
                      <NormalBarChart
                        showInfo
                        height={300}
                        title={COLUMN_LABELS[catColumn]}
                        highlightPoint={mappings[modelBody[catColumn]]}
                        columnArray={[
                          ...(data[catColumn].map((val) => mappings[val])),
                          mappings[modelBody[catColumn]],
                        ]}
                        classArray={[...(data["class"] || data["class_"]), getPredClass(response)]}
                        columnTitle={catColumn}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {Object.keys(response).length != 0 &&
            selectedNav == "Feature Importances" && (
              <div className="bg-white w-full h-full flex px-16 flex-col items-center">
                {/* <div className="text-2xl text-gray-900 font-bold my-2">
                  {globalFI
                    ? "Global Feature Importances"
                    : "Feature Influences on Prediction"}
                </div> */}
                <div className="flex gap-5 w-full mt-10 mb-8">
                  <ReactSwitch
                    onChange={(nextChecked) => setGlobalFI(nextChecked)}
                    checked={globalFI}
                    offColor="#888"
                    onColor="#0c6"
                    checkedIcon={false}
                    uncheckedIcon={false}
                  />
                  {globalFI
                    ? "Showing Global Feature Importances"
                    : "Showing Local Feature Importances"}
                </div>
                <div className="w-full">
                  {globalFI ? (
                    <BarChart height={500} global data={response.global_importances} />
                  ) : (
                    <BarChart height={500}
                      data={response.shap_explanation}
                      bias={response.base_value}
                    />
                  )}
                </div>
              </div>
            )}
          {Object.keys(response).length != 0 && selectedNav == "Risk Parameters" && (
            <div className="flex-1 flex flex-col justify-center w-full px-16 items-center">
              <div className="grid grid-cols-2 gap-8">
                <RiskItem icon={LuPercent}
                  name={`Probability of Default (PD)`}
                  value={`${numeral(response.proba).format('0.00%')}`} />
                <RiskItem icon={LuPackageOpen}
                  name={`Exposure at Default (EAD)`}
                  value={`GH₵${numeral(readableBody.loan_amount).format('0,0.00')}`} />
                <RiskItem icon={LuFramer}
                  name={`Loss Given Default (LGD)`}
                  value={`${numeral((readableBody.loan_amount - recoveries) / readableBody.loan_amount).format('0.00%')}`} />
                <RiskItem icon={LuTrendingDown}
                  name={`Expected Loss (EL)`}
                  value={`GH₵${numeral(
                    response.proba *
                    readableBody.loan_amount *
                    ((readableBody.loan_amount - recoveries) / readableBody.loan_amount)).format('0,0.00')}`} />
              </div>
              <div className="flex flex-col bg-white items-center justify-center gap-3 py-8 px-12">
                <div className="text-base text-teal-600 font-bold">Base Parameters (Editable)</div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold">Recovery Amount</label>
                  <input className="focus:outline-none px-3 py-2 bg-gray-100" value={recoveries} onChange={(e) => setRecoveries(e.target.value)} type="number" />
                </div>
              </div>
            </div>
          )}
          {Object.keys(response).length != 0 && selectedNav == "Application Report" && (
            <div className="flex-1 relative overflow-y-auto px-16 pb-20 pt-5">
              {/* <div className="absolute top-0 pt-5"> */}
              <div className="grid grid-cols-3 gap-x-10">
                <div className="">Name of applicant: <span className="font-semibold text-base ml-1">{readableBody.full_name}</span></div>
                <div className="">Age: <span className="font-semibold text-base ml-1">{readableBody.age}</span></div>
                <div className="">Sex: <span className="font-semibold text-base ml-1">{readableBody.marital_status}</span></div>
                <div className="">Foreign worker: <span className="font-semibold text-base ml-1">{readableBody.foreign_worker}</span></div>
              </div>
              <div className="uppercase font-semibold mt-5 mb-1 text-primary font-serif">Loan Terms</div>
              <div className="grid grid-cols-3 gap-10">
                <div className="">Loan Amount: <span className="font-semibold text-base ml-1">GH₵ {numeral(readableBody.loan_amount).format("0,0.00")}</span></div>
                <div className="">Duration (months): <span className="font-semibold text-base ml-1">{readableBody.duration_in_months}</span></div>
                <div className="">Purpose: <span className="font-semibold text-base ml-1">{readableBody.purpose}</span></div>
              </div>
              <div className="uppercase font-semibold mt-5 mb-1 text-primary font-serif">KEY MEASURES</div>
              <div className="flex flex-col gap-1">
                <div className="">Debt Service Coverage Ratio: <span className="font-semibold text-base ml-1">{((readableBody.income * readableBody.duration_in_months) / readableBody.loan_amount).toFixed(2)}</span></div>
                <div className="">Probability of Default (PD): <span className="font-semibold text-base ml-1">{numeral(response.proba).format('0.00%')}</span></div>
                <div className="">Exposure at Default (EAD): <span className="font-semibold text-base ml-1">GH₵{numeral(readableBody.loan_amount).format('0,0.00')}</span></div>
                <div className="">Loss Given Default (LGD): <span className="font-semibold text-base ml-1">{numeral((readableBody.loan_amount - recoveries) / readableBody.loan_amount).format('0.00%')}</span></div>
              </div>
              <div className="uppercase font-semibold mt-5 mb-1 text-primary font-serif">HISTORY</div>
              <div className="flex flex-col gap-1">
                <div className="">Number of Existing Loans at this bank: <span className="font-semibold text-base ml-1">{readableBody.number_of_existing_credits_at_this_bank}</span></div>
                <div className="">Repayment record: <span className="font-semibold text-base ml-1">{readableBody.other_installment_plans}</span></div>
              </div>
              <div className="uppercase font-semibold mt-5 mb-1 text-primary font-serif">STATISTICS</div>
              <div className="flex flex-col gap-1">
                {Object.keys(data).length !== 0 &&
                  <>
                    <div className="">Loan amount of <span className="font-semibold text-base ml-1">GH₵{numeral(readableBody.loan_amount).format('0,0.00')}</span> falls in the <span className="font-semibold text-base ml-1">{findQuartile(readableBody.loan_amount, data.credit_amount)}</span></div>
                    <div className="">Applicant's age of <span className="font-semibold text-base ml-1">{readableBody.age} years</span> falls in the <span className="font-semibold text-base ml-1">{findQuartile(readableBody.age, data.age)}</span></div>
                  </>
                }
              </div>
              {/* </div> */}
            </div>
          )}

          {Object.keys(response).length != 0 && selectedNav == "Decision" && (
            <div className="flex justify-center gap-3 bg-white py-28">
              <Button text={'Reject'} className={'bg-red-600 hover:scale-[.9] duration-300 text-white px-6 rounded-lg'} />
              <Button text={'Approve'} className={'bg-green-600 hover:scale-[.9] duration-300 text-white px-6 rounded-lg'} />
            </div>
          )}
        </div>


      </div>
    </SideNavLayout>
  );
}
