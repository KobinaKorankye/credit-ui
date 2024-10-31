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
            //   position: "top-left",
            // });
            setLoans(data);
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
            //   toast.success("Sent Successfully", {
            //     position: "top-left",
            //   });
            navigate("/analysis", {
                state: { modelBody: body, response: data[0], readableBody: params.row },
            });
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
        getLoans();
    }, [loansType]);

    const LOAN_TYPES = ["pending", "completed", "defaulted", "repaid"]

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

                                <div className="flex ml-auto gap-10 mr-10">
                                    {
                                        LOAN_TYPES.map((loan_type) => (
                                            <div onClick={() => { setLoansType(loan_type) }} className={`flex items-center mr-auto gap-2 text-dark cursor-pointer hover:text-primary text-[0.9vw] justify-between`}>
                                                <div>{capitalize(loan_type)}</div>
                                                <input
                                                    type="radio"
                                                    value={loan_type}
                                                    checked={loansType === loan_type}
                                                    onChange={() => { setLoansType(loan_type) }}
                                                    style={{ accentColor: "blue" }}
                                                    className=" w-4 h-4 border-[1px]"
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="h-full">
                                <MUIDataTable
                                    columns={columns}
                                    pageSize={10}
                                    onRowClick={getPredictionMUI}
                                    rows={loans.filter((loan) =>
                                        loan.full_name.toLowerCase().search(searchText.toLowerCase()) !== -1
                                    )}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </SideNavLayout>
    );
}
