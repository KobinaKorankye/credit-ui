import React, { useState } from "react";
import SideNavLayout from "../layouts/SideNavLayout";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
// import data from "../data/data.json";
import KDEChart from "../components/KDEChart";
import PieChart from "../components/PieChart";
import { useEffect } from "react";
import dbClient from "../api/dbClient";
import { toast } from "react-toastify";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchGraphData } from "../store/graphDataSlice";
import { transformModelApiObject } from "../helpers";
import client from "../api/client";
import { columnNames, columns } from "../constants";
import MUIDataTable from "../components/MUITable";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);

  const data = useSelector((state) => state.graphData.data);

  const dispatch = useDispatch();
  const status = useSelector((state) => state.graphData.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGraphData());
    }
  }, [dispatch]);

  const getPrediction = async (row) => {
    const body = transformModelApiObject(row);
    setLoading(true);
    try {
      const { data } = await client.post("/predict", body);
      console.log(body);
      //   toast.success("Sent Successfully", {
      //     position: "top-left",
      //   });
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

  const getUsers = async () => {
    setLoading(true);
    try {
      const { data } = await dbClient.get("/users");
      // toast.success("Loaded Successfully", {
      //   position: "top-left",
      // });
      setUsers(data);
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
    getUsers();
  }, []);

  if (status !== "succeeded") {
    return <div className="font-bold text-3xl">Loading....</div>;
  }

  return (
    <SideNavLayout>
      <div className="grid grid-cols-8 gap-5">
        <div className="flex flex-col rounded-xl py-5 shadow-lg col-span-2 bg-white">
          <div className="text-amber-500 px-8 font-bold uppercase">
            Apply for a loan
          </div>
          <div className="px-8 text-sm my-auto">
            To add a loan applicant into the system, please select one of the
            options below
          </div>
          <div className="my-auto">
            <Button
              className={
                "bg-gradient-to-b from-black via-red-500 to-amber-500 hover:scale-90 duration-200 text-white rounded-lg"
              }
              text={"German"}
              onClick={() => navigate("/german")}
            />
            <Button
              className={
                "bg-gradient-to-b from-red-600 via-amber-500 to-green-700 hover:scale-90 duration-200 rounded-lg"
              }
              text={"Adehyeman"}
              onClick={() => navigate("/adehyeman")}
            />
          </div>
        </div>
        <div className="flex rounded-xl shadow-lg col-span-2 bg-white p-5 pt-10">
          <PieChart
            classArray={data["class"]}
            height={"100%"}
            title={"Loan Default Analysis"}
            showLegend
            hideToolbar
          />
        </div>
        <div className="rounded-xl shadow-lg col-span-4 bg-white p-10">
          <KDEChart
            columnArray={data["credit_amount"]}
            classArray={data["class"]}
            height={"150%"}
            title={"Credit Amount Distribution"}
            hideToolbar
          />
        </div>
      </div>
      <div className="mt-5 col-span-2">
        <div className="flex flex-col bg-white">
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
            // <Table
            //   onRowClick={getPrediction}
            //   columnNames={["id", ...columnNames, "Class"]}
            //   columns={["_id", ...columns, "class"]}
            //   rows={users}
            // />
            <div className="h-[423px]">
              <MUIDataTable onRowClick={getPredictionMUI} rows={users} />
            </div>
          )}
        </div>
      </div>
    </SideNavLayout>
  );
}
