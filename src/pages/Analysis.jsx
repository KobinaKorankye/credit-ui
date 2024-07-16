import { useEffect, useState } from "react";
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
import { getPredClass } from "../helpers";
import HistogramChart from "../components/HistogramChart";
import ReactSwitch from "react-switch";
import TopNav from "../components/TopNav";
import SideNavLayout from "../layouts/SideNavLayout";
import FormPage from "../sections/FormPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Analysis() {
  const [numColumn, setNumColumn] = useState("credit_amount");
  const [catColumn, setCatColumn] = useState(
    "status_of_existing_checking_account"
  );
  const [show, setShow] = useState("graph");

  const { response, formEntry } = useLocation().state;
  const navigate = useNavigate();

  const data = useSelector((state) => state.graphData.data);

  const dispatch = useDispatch();
  const status = useSelector((state) => state.graphData.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGraphData());
    }
  }, [dispatch]);

  const [showHist4NumGType, setShowHist4NumGType] = useState(false);
  const [globalFI, setGlobalFI] = useState(false);
  const navItems = ["Form", "Plots", "Feature Importances", "Decision"];
  const [selectedNav, setSelectedNav] = useState(navItems[0]);
  const [showNumGraph, setShowNumGraph] = useState(true);

  return (
    <SideNavLayout>
      <div className="bg-white rounded">
        <FontAwesomeIcon
          onClick={() => navigate(-1, { state: { formEntry: formEntry } })}
          className="m-5 cursor-pointer"
          size="lg"
          icon={faArrowLeft}
        />
        <TopNav
          navItems={navItems}
          selected={selectedNav}
          setSelected={setSelectedNav}
        />
        {Object.keys(response).length != 0 && selectedNav == "Form" && (
          <FormPage />
        )}

        {Object.keys(response).length != 0 && selectedNav == "Plots" && (
          <div className="bg-white w-full h-full flex md:p-10 md:px-32 flex-col items-center overflow-y-scroll">
            <div className="w-full gap-5">
              {showNumGraph ? (
                <div className="flex flex-col">
                  <div className="text-2xl text-center text-gray-900 font-bold my-2">
                    Loan Assessment Data Analytics
                  </div>
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
                        className={`flex-1 cursor-pointer ${
                          showNumGraph
                            ? "bg-teal-600 text-white"
                            : "bg-slate-200 text-black"
                        } h-10 flex items-center justify-center text-sm rounded-l-lg`}
                      >
                        Numeric
                      </div>
                      <div
                        onClick={() => setShowNumGraph(false)}
                        className={`flex-1 cursor-pointer ${
                          !showNumGraph
                            ? "bg-teal-600 text-white"
                            : "bg-slate-200 text-black"
                        } h-10 flex items-center justify-center text-sm rounded-r-lg`}
                      >
                        Categorical
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-5 w-full mt-10 mb-8 scale-[.8]">
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
                    <KDEChart
                      title={COLUMN_LABELS[numColumn]}
                      columnName={numColumn}
                      height={500}
                      showInfo
                      highlightPoint={formEntry[numColumn]}
                      columnArray={[...data[numColumn], formEntry[numColumn]]}
                      classArray={[...data["class"], getPredClass(response)]}
                    />
                  ) : (
                    <HistogramChart
                      title={COLUMN_LABELS[numColumn]}
                      columnName={numColumn}
                      numBins={8}
                      height={500}
                      showInfo
                      highlightPoint={formEntry[numColumn]}
                      columnArray={[...data[numColumn], formEntry[numColumn]]}
                      classArray={[...data["class"], getPredClass(response)]}
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="text-2xl text-center text-gray-900 font-bold my-2">
                    Loan Assessment Data Analytics
                  </div>
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
                        className={`flex-1 cursor-pointer ${
                          showNumGraph
                            ? "bg-teal-600 text-white"
                            : "bg-slate-200 text-black"
                        } h-10 flex items-center justify-center text-sm rounded-l-lg`}
                      >
                        Numeric
                      </div>
                      <div
                        onClick={() => setShowNumGraph(false)}
                        className={`flex-1 cursor-pointer ${
                          !showNumGraph
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
                      title={COLUMN_LABELS[catColumn]}
                      highlightPoint={mappings[formEntry[catColumn]]}
                      columnArray={[
                        ...data[catColumn],
                        mappings[formEntry[catColumn]],
                      ]}
                      classArray={[...data["class"], getPredClass(response)]}
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
            <div className="bg-white w-full h-full flex md:p-10 md:px-32 flex-col items-center overflow-y-scroll">
              <div className="text-xl text-gray-900 font-bold my-2">
                {globalFI
                  ? "Global Feature Importances"
                  : "Feature Influences on Prediction"}
              </div>
              <div className="flex gap-5 w-full mt-10 mb-8 scale-[.8]">
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
                  <BarChart global data={response.global_importances} />
                ) : (
                  <BarChart
                    data={response.shap_explanation}
                    bias={response.base_value}
                  />
                )}
              </div>
            </div>
          )}
      </div>

      <div className="w-full flex flex-col items-center mb-10 bg-white rounded-b pb-10">
        <div className="text-xl text-gray-700 font-bold my-2">
          Model Prediction: {response.prediction}
          <br />
          Probability: {parseFloat(response.proba.toFixed(4)) * 100}%
        </div>
      </div>
      {/* {Object.keys(response).length != 0 && show == "global" && (
        <div className="bg-white w-full h-full flex p-10 flex-col items-center overflow-y-scroll">
          <div className="text-xl text-gray-900 font-bold my-2">
            Global Feature Importances
          </div>
          <div className="w-full">
            <BarChart global data={response.global_importances} />
          </div>

          <div className="text-xl text-gray-700 font-bold my-2">
            Prediction: {response.prediction}
            <br />
            Probability: {parseFloat(response.proba.toFixed(4)) * 100}%
          </div>
          <div
            className="mt-5 text-red-400 hover:underline cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Exit
          </div>
        </div>
      )} */}
    </SideNavLayout>
  );
}
