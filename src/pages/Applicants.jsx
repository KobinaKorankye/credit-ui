import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Table from "../components/Table";
import SideNavLayout from "../layouts/SideNavLayout";
import { applicationTypes, columnNames } from "../constants";
import client from "../api/client";
import { getApplicantInfoField, getPredictionMUI, transformApplicationToModelApiObject, transformModelApiObject } from "../helpers";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "../components/MUITable";
import Loader from "../loader/Loader";
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import Modal from "../components/modals/Modal";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "full_name",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 260,
    valueGetter: (value, row) => getApplicantInfoField(row).full_name,
  },
  {
    field: "credit_amount",
    headerName: "Loan amount (GHS)",
    width: 230,
    type: 'number',
    valueGetter: (value, row) => row.loan_amount_requested.toFixed(2),

  },
  {
    field: "duration_in_months",
    headerName: "Loan duration (months)",
    width: 230,
    type: 'number',
  },
  {
    field: "purpose",
    headerName: "Purpose",
    width: 190,
  },

  {
    field: "decision",
    headerName: "Decision",
    width: 190,
    valueGetter: (value, row) => row.decision || "pending",
  },
];

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [response, setResponse] = useState({});
  const [applicationType, setApplicationType] = useState(applicationTypes.pending)
  const navigate = useNavigate();

  const getapplicants = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(`/loan-applications?decision=${applicationType}`);
      //   toast.success("Loaded Successfully", {
      //     position: "top-left",
      //   });
      setApplicants(data.reverse());
      console.log(data);
    } catch (error) {
      toast.error("Failed", {
        position: "top-left",
      });
      console.log(error);
    }
    setLoading(false);
  };

  // const getPrediction = async (row) => {
  //   const body = transformModelApiObject(row);
  //   setLoading(true);
  //   try {
  //     const { data } = await client.post("/predict", body);
  //     console.log(body);
  //     //   toast.success("Sent Successfully", {
  //     //     position: "top-left",
  //     //   });
  //     setResponse(data[0]);
  //     navigate("/analysis", { state: { formEntry: body, response: data[0] } });
  //     console.log(data);
  //   } catch (error) {
  //     toast.error("Failed", {
  //       position: "top-left",
  //     });
  //     console.log(error);
  //   }
  //   setLoading(false);
  // };

  const getPredictionMUI = async (params, event, details) => {
    const body = transformApplicationToModelApiObject(params.row);
    setLoading(true);
    try {
      const { data } = await client.post("/predict", body);
      console.log(body);
      //   toast.success("Sent Successfully", {
      //     position: "top-left",
      //   });
      navigate("/applicant-analysis", { state: { modelBody: body, response: data[0], readableBody: params.row } });
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
    getapplicants();
  }, [applicationType]);

  return (
    <SideNavLayout>
      <Modal isOpen={isCreateModalOpen}>
        <div onClick={() => { setIsCreateModalOpen(false) }} className="w-screen h-screen flex flex-col p-10 items-center bg-black/50">
          <div onClick={(e) => { e.stopPropagation() }} className="w-[50%] h-full bg-white">

          </div>
        </div>
      </Modal>
      <Modal isOpen={isDetailModalOpen}>
        <div onClick={() => { setIsDetailModalOpen(false) }} className="w-screen h-screen flex flex-col p-10 items-center bg-black/50">
          <div onClick={(e) => { e.stopPropagation() }} className="w-full h-full bg-white">

          </div>
        </div>
      </Modal>
      <div className="flex-1 relative">
        <div className="absolute w-full h-full top-0 flex flex-col bg-white rounded">
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
            <div className="bg-white h-[623px] flex flex-col items-center justify-center w-full overflow-auto">
              <Loader height={200} width={200} />
              <div className="font-semibold">Loading...</div>
            </div>
          ) : (
            <>
              <div className="flex px-4 py-2">
                <SearchBar placeholder={'Applicant name'} />
                <ActionButton onClick={() => { setIsCreateModalOpen(true) }} text={'Add Applicant'} className={'ml-auto bg-surface-light text-white'} />
              </div>
              <div className="h-full">
                <MUIDataTable
                  columns={columns}
                  pageSize={10}
                  onRowClick={getPredictionMUI}
                  rows={applicants}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </SideNavLayout>
  );
}
