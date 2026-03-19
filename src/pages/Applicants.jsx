import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import Table from "../components/Table";
import SideNavLayout from "../layouts/SideNavLayout";
import { applicationTypes, columnNames } from "../constants";
import client from "../api/client";
import { getApplicantInfoField, transformApplicationToModelApiObject } from "../helpers";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "../components/MUITable";
import Loader from "../loader/Loader";
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import Modal from "../components/modals/Modal";
import RegularSelectAlt from "../components/RegularSelectAlt";
import UserContext from "../contexts/UserContext";

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
  const { user } = useContext(UserContext)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [applicationType, setApplicationType] = useState(user.role === 'officer' ? "pending" : user.role === 'reviewer' ? "review" : "finalize")
  const navigate = useNavigate();

  const getapplicants = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(`/loan-applications?decision=${applicationType}`);
      setApplicants(data.reverse());
    } catch (error) {
      toast.error("Failed", {
        position: "top-right",
      });
    }
    setLoading(false);
  };

  const getPredictionMUI = async (params, event, details) => {
    const body = transformApplicationToModelApiObject(params.row);
    setLoading(true);
    try {
      const { data } = await client.post("/predict", body);
      navigate("/applicant-analysis", { state: { modelBody: body, response: data[0], readableBody: { ...params.row, ...getApplicantInfoField(params.row) } } });
    } catch (error) {
      toast.error("Failed", {
        position: "top-right",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getapplicants();
  }, [applicationType]);

  const applicationTypeOptions = [
    { value: "finalize", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];
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
      <div className="flex flex-col h-full">
        {/* Header Controls — always visible */}
        <div className="flex flex-col lg:flex-row gap-4 px-4 py-2">
          <div className="flex-1 lg:max-w-md">
            <SearchBar value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder={'Applicant name'} />
          </div>

          {user.role === "approver" && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Status:</span>
              <RegularSelectAlt
                name="applicationType"
                value={applicationType}
                options={applicationTypeOptions}
                onChange={(e) => setApplicationType(e.target.value)}
                boxClassName="min-w-[140px]"
              />
            </div>
          )}

          <ActionButton
            onClick={() => navigate('/add-applicant')}
            text={'Add Applicant'}
            className={'w-full ml-auto sm:w-auto'}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            <MUIDataTable
              columns={columns}
              pageSize={10}
              onRowClick={getPredictionMUI}
              rows={applicants.filter((app) =>
                getApplicantInfoField(app).full_name.toLowerCase().search(searchText.toLowerCase()) !== -1
              )}
              loading={loading}
            />
          </div>
        )}
      </div>
    </SideNavLayout>
  );
}
