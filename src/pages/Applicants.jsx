import React, { useEffect, useState } from "react";
import dbClient from "../api/dbClient";
import { toast } from "react-toastify";
import Table from "../components/Table";
import SideNavLayout from "../layouts/SideNavLayout";
import { columnNames, columns } from "../constants";
import client from "../api/client";
import { transformModelApiObject } from "../helpers";
import { useNavigate } from "react-router-dom";

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
      setGApplicants(data);
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
      navigate('/analysis', { state: { formEntry: body, response: data[0] }});
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
      <div className="mt-5 col-span-2 shadow-lg bg-white overflow-scroll">
        <div className="flex flex-col pt-5 gap-5 bg-white rounded">
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
            <div className="my-5 px-20 text-sm">Loading... </div>
          ) : (
            <>
              <Table
                onRowClick={getPrediction}
                columnNames={["id", ...columnNames]}
                columns={["_id", ...columns]}
                rows={gApplicants}
              />
            </>
          )}
        </div>
      </div>
    </SideNavLayout>
  );
}