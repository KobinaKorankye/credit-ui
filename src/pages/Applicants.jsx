import React, { useEffect, useState } from "react";
import dbClient from "../api/dbClient";
import { toast } from "react-toastify";
import Table from "../components/Table";
import SideNavLayout from "../layouts/SideNavLayout";
import { columnNames, columns } from "../constants";
import client from "../api/client";
import { getPredictionMUI, transformModelApiObject } from "../helpers";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "../components/MUITable";
import Loader from "../loader/Loader";

export default function Applicants() {
  const [gApplicants, setGApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const navigate = useNavigate();

  const getGApplicants = async () => {
    setLoading(true);
    try {
      const { data } = await dbClient.get("/users/gapplicants");
      //   toast.success("Loaded Successfully", {
      //     position: "top-left",
      //   });
      setGApplicants(data.reverse());
      console.log(data);
    } catch (error) {
      toast.error("Failed", {
        position: "top-left",
      });
      console.log(error);
    }
    setLoading(false);
  };

  const getPrediction = async (row) => {
    const body = transformModelApiObject(row);
    setLoading(true);
    try {
      const { data } = await client.post("/predict", body);
      console.log(body);
      //   toast.success("Sent Successfully", {
      //     position: "top-left",
      //   });
      setResponse(data[0]);
      navigate("/analysis", { state: { formEntry: body, response: data[0] } });
      console.log(data);
    } catch (error) {
      toast.error("Failed", {
        position: "top-left",
      });
      console.log(error);
    }
    setLoading(false);
  };

  const getPredictionMUI = async (params, event, details) => {
    const body = transformModelApiObject(params.row);
    setLoading(true);
    try {
      const { data } = await client.post("/predict", body);
      console.log(body);
      //   toast.success("Sent Successfully", {
      //     position: "top-left",
      //   });
      navigate("/analysis", { state: { formEntry: body, response: data[0], fullRow: params.row } });
      console.log(data);
    } catch (error) {
      toast.error("Failed", {
        position: "top-left",
      });
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getGApplicants();
  }, []);

  return (
    <SideNavLayout>
      {!loading && (
        <div className="my-5 font-bold px-5 text-lg text-cyan-600">
          Loan Applicants
        </div>
      )}
      <div className="mt-5 col-span-2">
        <div className="flex flex-col bg-white rounded">
          {/* <div className="flex gap-5 items-center">
            <div className="md:w-[50%]">
              <SearchBar
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                // placeholder={`Type to search by ${filter}`}
              />
            </div>
          </div> */}
          {loading ? (
            <div className="bg-white h-[623px] flex flex-col items-center justify-center w-full overflow-scroll">
            <Loader height={200} width={200} />
            <div className="font-semibold">Loading...</div>
          </div>
          ) : (
            <>
              {/* <Table
                onRowClick={getPrediction}
                columnNames={["id", ...columnNames]}
                columns={["_id", ...columns]}
                rows={gApplicants}
              /> */}
              <div className="h-[623px]">
                <MUIDataTable
                  pageSize={10}
                  onRowClick={getPredictionMUI}
                  rows={gApplicants}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </SideNavLayout>
  );
}
