import { useEffect, useState } from "react";
import React from "react";
import RegularSelect from "../components/RegularSelect";
import BarChart from "../components/BarChart";
import KDEChart from "../components/KDEChart";
import NormalBarChart from "../components/NormalBarChart";
import { catColumns, mappings, numericColumns } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchGraphData } from "../store/graphDataSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getPredClass } from "../helpers";


export default function Analysis() {
  const [numColumn, setNumColumn] = useState("credit_amount");
  const [catColumn, setCatColumn] = useState(
    "status_of_existing_checking_account"
  );
  const [show, setShow] = useState("graph");

  const { response, formEntry } = useLocation().state;
  const navigate = useNavigate()

  const data = useSelector((state) => state.graphData.data)

  const dispatch = useDispatch()
  const status = useSelector((state) => state.graphData.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchGraphData());
    }
  }, [dispatch]);

  return (
    <>
      {Object.keys(response).length != 0 && show == "graph" && (
        <div className="bg-white w-full h-full flex md:p-10 md:px-32 flex-col items-center overflow-y-scroll">
          <div className="w-full grid grid-cols-2 gap-5">
            <div className="flex flex-col">
              <div className="text-xl text-gray-900 font-bold my-2">
                Population Distributions for Numeric Features
              </div>
              <div className="w-64 mb-20">
                <RegularSelect
                  label={"Select numerical feature to plot"}
                  value={numColumn}
                  options={numericColumns}
                  onChange={(e) => setNumColumn(e.target.value)}
                />
              </div>
              <KDEChart
                title={numColumn}
                highlightPoint={formEntry[numColumn]}
                columnArray={[...data[numColumn], formEntry[numColumn]]}
                classArray={[...data["class"], getPredClass(response)]}
              />
            </div>
            <div className="flex flex-col">
              <div className="text-xl text-gray-900 font-bold my-2">
                Population Counts for Categorical Features
              </div>
              <div className="w-64 mb-20">
                <RegularSelect
                  label={"Select categorical feature to plot"}
                  value={catColumn}
                  options={catColumns}
                  onChange={(e) => setCatColumn(e.target.value)}
                />
              </div>
              <NormalBarChart
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
          <div className="text-xl text-gray-700 font-bold my-2">
            Prediction: {response.prediction}
            <br />
            Probability: {parseFloat(response.proba.toFixed(4)) * 100}%
          </div>
          <div className="flex gap-5">
            <div
              className="bg-green-700 text-white cursor-pointer px-2 py-1 my-2 rounded"
              onClick={() => setShow("global")}
            >
              Show global importances
            </div>
            <div
              className="bg-green-700 text-white cursor-pointer px-2 py-1 my-2 rounded"
              onClick={() => setShow("local")}
            >
              Show local importances
            </div>
          </div>
          <div
            className="mt-5 text-red-400 hover:underline cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Exit
          </div>
        </div>
      )}
      {Object.keys(response).length != 0 && show == "local" && (
        <div className="bg-white w-full h-full flex p-10 flex-col items-center overflow-y-scroll">
          <div className="text-xl text-gray-900 font-bold my-2">
            Feature Influences on Prediction
          </div>
          <div className="w-full">
            <BarChart
              data={response.shap_explanation}
              bias={response.base_value}
            />
          </div>

          <div className="text-xl text-gray-700 font-bold my-2">
            Prediction: {response.prediction}
            <br />
            Probability: {parseFloat(response.proba.toFixed(4)) * 100}%
          </div>
          <div className="flex gap-5">
            <div
              className="bg-green-700 text-white cursor-pointer px-2 py-1 my-2 rounded"
              onClick={() => setShow("global")}
            >
              Show global importances
            </div>
            <div
              className="bg-green-700 text-white cursor-pointer px-2 py-1 my-2 rounded"
              onClick={() => setShow("graph")}
            >
              Show graphs
            </div>
          </div>
          <div
            className="mt-5 text-red-400 hover:underline cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Exit
          </div>
        </div>
      )}
      {Object.keys(response).length != 0 && show == "global" && (
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
          <div className="flex gap-5">
            <div
              className="bg-green-700 text-white cursor-pointer px-2 py-1 my-2 rounded"
              onClick={() => setShow("local")}
            >
              Show local importances
            </div>
            <div
              className="bg-green-700 text-white cursor-pointer px-2 py-1 my-2 rounded"
              onClick={() => setShow("graph")}
            >
              Show graphs
            </div>
          </div>
          <div
            className="mt-5 text-red-400 hover:underline cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Exit
          </div>
        </div>
      )}
    </>
  );
}
