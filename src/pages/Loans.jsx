import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Table from "../components/Table";
import SideNavLayout from "../layouts/SideNavLayout";
import { applicationTypes, columnNames } from "../constants";
import client from "../api/client";
import { getApplicantInfoField, transformModelApiObject } from "../helpers";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "../components/MUITable";
import Loader from "../loader/Loader";
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import Modal from "../components/modals/Modal";
import RegularSelectAlt from "../components/RegularSelectAlt";
import { capitalize } from "@mui/material";

const classes = ["Defaulted", "Repaid"];

const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
        field: "full_name",
        headerName: "Full name",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 260,
    },
    {
        field: "loan_amount",
        headerName: "Loan amount (GHS)",
        width: 230,
        type: "number",
        valueGetter: (value, row) => `${row.loan_amount.toFixed(2)}`,
    },
    {
        field: "duration_in_months",
        headerName: "Loan duration (months)",
        width: 230,
        type: "number",
    },
    {
        field: "purpose",
        headerName: "Purpose",
        width: 190,
        // valueGetter: (value, row) => `${mappings[row.purpose]}`,
    },
    {
        field: "outcome",
        headerName: "Outcome",
        width: 130,
        valueGetter: (value, row) => `${classes[row.outcome] || 'Pending'}`,
    },
];

export default function Loans() {
    const [loans, setLoans] = useState([]);
    const [loansType, setLoansType] = useState('pending');
    const [loading, setLoading] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');

    const navigate = useNavigate();

    const getLoans = async () => {
        setLoading(true);
        try {
            const { data } = await client.get(`/loans?outcome=${loansType}`);
            // toast.success("Loaded Successfully", {
            //   position: "top-right",
            // });
            setLoans(data);
        } catch (error) {
            toast.error("Failed", {
                position: "top-right",
            });
        }
        setLoading(false);
    };

    const getPredictionMUI = async (params, event, details) => {
        const body = transformModelApiObject(params.row);
        setLoading(true);
        try {
            const { data } = await client.post("/predict", body);
            navigate("/analysis", {
                state: { modelBody: body, response: data[0], readableBody: params.row },
            });
        } catch (error) {
            toast.error("Failed", {
                position: "top-right",
            });
        }
        setLoading(false);
    };


    useEffect(() => {
        getLoans();
    }, [loansType]);

    const LOAN_TYPES = ["pending", "completed", "defaulted", "repaid"]

    // Prepare options for the select dropdown
    const loanTypeOptions = LOAN_TYPES.map(type => ({
        value: type,
        label: capitalize(type)
    }));

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

                    <div className="flex items-center gap-3 ml-auto">
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                            Filter by:
                        </span>
                        <RegularSelectAlt
                            name="loanType"
                            value={loansType}
                            options={loanTypeOptions}
                            onChange={(e) => setLoansType(e.target.value)}
                            boxClassName="min-w-[140px]"
                        />
                    </div>
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
                            rows={loans.filter((loan) =>
                                loan.full_name.toLowerCase().search(searchText.toLowerCase()) !== -1
                            )}
                            loading={loading}
                        />
                    </div>
                )}
            </div>
        </SideNavLayout>
    );
}
