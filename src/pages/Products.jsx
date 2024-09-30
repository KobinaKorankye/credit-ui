import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Table from "../components/Table";
import SideNavLayout from "../layouts/SideNavLayout";
import client from "../api/client";
import { filterToString, generateName, getApplicantInfoField, isValidFilter, operationDescriptions, transformModelApiObject } from "../helpers";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "../components/MUITable";
import Loader from "../loader/Loader";
import { BiPlus, BiSave, BiSearch } from "react-icons/bi";
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import Modal from "../components/modals/Modal";
import { FiX } from 'react-icons/fi'
import * as Yup from 'yup'
import { Formik } from "formik";
import FormInput from "../components/formik/FormInput";
import FormSelect from "../components/formik/FormSelect";
import Submit from "../components/formik/Submit";
import { attributeObjMapping, COLUMN_LABELS, filterAttributes, mappings, numericColumns } from "../constants";
import ObjSelect from "../components/forms/ObjSelect"
import AppInput from "../components/forms/AppInput";
import Modal2 from "../components/modals/Modal2";
import FilterRenderer from "../components/filtering/FilterRenderer";
import { TbTrash } from "react-icons/tb";
import useRefState from "../hooks/useRefState";
import CheckBox from "../components/forms/CheckBox";

const productSchema = Yup.object().shape({
    name: Yup.string()
        .required()
        .label("Name"),
    duration: Yup.number().required().positive().integer().label("Duration (months)"),
    purpose: Yup.string().required().label("Purpose"),
    credit_amount: Yup.number()
        .required()
        .positive()
        .label("Loan amount"),
})

// const purposeOptions = [
//     { label: "Car new", value: "A40" },
//     { label: "Car used", value: "A41" },
//     { label: "Furniture/equipment", value: "A42" },
//     { label: "Radio/TV", value: "A43" },
//     { label: "Domestic appliances", value: "A44" },
//     { label: "Repairs", value: "A45" },
//     { label: "Education", value: "A46" },
//     { label: "Vacation", value: "A47" },
//     { label: "Retraining", value: "A48" },
//     { label: "Business", value: "A49" },
//     { label: "Others", value: "A410" }
// ];

const purposeOptions = [
    { label: "Car new", value: "Car new" },
    { label: "Car used", value: "Car used" },
    { label: "Furniture/equipment", value: "Furniture/equipment" },
    { label: "Radio/TV", value: "Radio/TV" },
    { label: "Domestic appliances", value: "Domestic appliances" },
    { label: "Repairs", value: "Repairs" },
    { label: "Education", value: "Education" },
    { label: "Vacation", value: "Vacation" },
    { label: "Retraining", value: "Retraining" },
    { label: "Business", value: "Business" },
    { label: "Others", value: "Others" }
];


const initialValues = {
    name: '',
    duration: '',
    purpose: '',
    credit_amount: ''
};

const columns = [
    {
        field: "name",
        headerName: "Name",
        sortable: false,
        width: 260,
    },
    {
        field: "credit_amount",
        headerName: "Loan amount (GHS)",
        width: 230,
        type: 'number',
        valueGetter: (value, row) => `${row.credit_amount.toFixed(2)}`,

    },
    {
        field: "duration",
        headerName: "Loan duration (months)",
        width: 230,
        type: 'number',
    },
    {
        field: "purpose",
        headerName: "Purpose",
        width: 190,
        valueGetter: (value, row) => `${row.purpose}`,
    },
];

const predictionColumns = [
    {
        field: "id", headerName: "ID", width: 100
    },
    {
        field: "full_name",
        headerName: "Full name",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 260,
        valueGetter: (value, row) => getApplicantInfoField(row).full_name,
    },
    {
        // field: "repayment_proba",
        headerName: "Probability of Repayment",
        width: 230,
        type: 'number',
        valueGetter: (value, row) => `${row.repayment_proba.toFixed(2)}`,
    },
];

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSource, setLoadingSource] = useState("update");
    const [response, setResponse] = useState({});
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCustomerDetailModalOpen, setIsCustomerDetailModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddFilterModalOpen, setIsAddFilterModalOpen] = useState(false);
    const [isUpdateFormFieldDisabled, setIsUpdateFormFieldDisabled] = useState(false);
    const [isComposeMode, setIsComposeMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProductFilters, setSelectedProductFilters] = useRefState({});
    const [isCustomerOnly, setIsCustomerOnly] = useState(false)
    const [useModel, setUseModel] = useState(false)
    const [filters, setFilters] = useRefState({})
    const [subFilter, setSubFilter] = useState({})
    const [eligibleNumber, setEligibleNumber] = useState(5)
    const [latestLogicalOp, setLatestLogicalOp] = useState('or')

    const navigate = useNavigate();

    const getProducts = async () => {
        try {
            const { data } = await client.get("/products");
            //   toast.success("Loaded Successfully", {
            //     position: "top-left",
            //   });
            setProducts(data.reverse());
            console.log(data);
        } catch (error) {
            toast.error("Failed", {
                position: "top-left",
            });
            console.log(error);
        }
    };

    const createProduct = async (form, { resetForm }) => {
        setLoading(true);
        setLoadingSource("create");
        try {
            const { data } = await client.post("/products", {
                ...form, filters: Object.keys(filters).length !== 0 ? filters : null, eligible_customers: null
            });
            setProducts((prev) => [data, ...prev]);
            toast.success("Created successfully", {
                position: "top-left",
            });
            console.log(data);
            setIsCreateModalOpen(false)
        } catch (error) {
            toast.error("Failed", {
                position: "top-left",
            });
            console.log(error);
        }
        setLoading(false);
    };

    const updateProduct = async (form, { resetForm }) => {
        setLoading(true);
        setLoadingSource("update");
        try {
            const { data } = await client.put("/products", {
                ...form,
                filters: Object.keys(selectedProductFilters).length === 0 ? null : selectedProductFilters,
                eligible_customers: selectedProduct?.eligible_customers
            });
            setProducts((prev) => prev.map((prod) => prod.id == data.id ? data : prod))
            toast.success("Update successful", {
                position: "top-left",
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

    const getEligible = async () => {
        setLoading(true);
        setLoadingSource("eligible");
        try {
            const { data } = await client.get(`/fx/get-eligible/${selectedProduct.id}?limit=${eligibleNumber}${isCustomerOnly ? "&type=customers" : ''}`);
            console.log(data);
            toast.success("Processed Successfully", {
                position: "top-left",
            });
            setProducts((prev) => prev.map((prod) => prod.id == data.id ? data : prod))
            setSelectedProduct(data)
            setSelectedProductFilters(data.filters || {})
        } catch (error) {
            toast.error("Failed", {
                position: "top-left",
            });
            console.log(error);
        }
        setLoading(false);
    };

    const showProductDetails = async (params, event, details) => {
        setSelectedProduct(params.row)
        setSelectedProductFilters(params.row.filters || {})
        setIsDetailModalOpen(true)
    };

    const showCustomerDetails = async (params, event, details) => {
        setSelectedCustomer(params.row)
        setIsCustomerDetailModalOpen(true)
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            await getProducts();
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (!isCreateModalOpen) {
            setFilters({})
        }
    }, [isCreateModalOpen]);

    useEffect(() => {
        if (!isDetailModalOpen) {
            setSelectedProduct(null)
        }
    }, [isDetailModalOpen]);

    return (
        <SideNavLayout>
            <Modal isOpen={isCreateModalOpen}>
                <div onClick={() => { setIsCreateModalOpen(false) }} className="w-screen h-screen overflow-y-auto flex flex-col p-10 items-center bg-black/50">
                    <div onClick={(e) => { e.stopPropagation() }} className="max-w-full bg-white px-14 pt-5 pb-10 rounded">
                        <div className="flex justify-end"> <FiX className="text-lg cursor-pointer" onClick={() => { setIsCreateModalOpen(false) }} /></div>
                        <div className="text-xl font-semibold">Create Product</div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={productSchema}
                            onSubmit={createProduct}
                        >
                            <div className="flex flex-col mt-10">
                                <div className="grid grid-cols-2 gap-x-5 gap-y-8">
                                    <FormInput name={'name'} type={'text'} label={'Product name'} placeholder="Product name" />
                                    <FormInput name={'duration'} type={'number'} label={'Duration (months)'} placeholder="Duration (months)" />
                                    <FormSelect name={'purpose'} label={'Purpose'} options={purposeOptions} />
                                    <FormInput name={'credit_amount'} type={'number'} label={'Max loan amount (GH₵)'} placeholder="0.00" />
                                </div>
                                <div className="text-base font-semibold mt-10">Filters</div>
                                <FilterRenderer filter={filters} filters={filters} setFilters={setFilters} />
                                {
                                    Object.keys(filters).length === 0 ?
                                        <div className="flex mt-5">
                                            <ActionButton onClick={() => { setSubFilter({ attribute: ' ' }); setIsAddFilterModalOpen(true) }} className={'bg-primary text-white'} text={'Add Filter'} />
                                        </div>
                                        :
                                        <div className="flex mt-5 gap-5">
                                            <ActionButton onClick={() => { setSubFilter({ attribute: ' ' }); setIsComposeMode(true); setIsAddFilterModalOpen(true) }} className={'bg-primary text-white'} text={'Compose'} />
                                            <ActionButton onClick={() => { setFilters({}); setIsComposeMode(false); }} icon={TbTrash} className={'bg-secondary text-white'} text={'Clear'} />
                                        </div>
                                }
                                {
                                    Object.keys(filters).length !== 0 &&
                                    <div className="flex bg-gray-100 border border-gray-300 shadow rounded-lg py-1 font-mono mt-8 text-sm">{filterToString(filters)}</div>
                                }

                                {
                                    loading ?
                                        <div className={'bg-surface-light text-white px-4 py-3 text-center text-sm rounded mt-12 w-full'}>Loading...</div>
                                        :
                                        (
                                            (Object.keys(filters).length !== 0 && !isValidFilter(filters)) ?
                                                <div className="text-alt text-sm py-3">Filter Invalid! Please make sure no values are empty</div>
                                                :
                                                <Submit className={'bg-surface-light text-white py-3 text-sm rounded-lg mt-12 w-full'} text={'Create Product'} />
                                        )
                                }
                            </div>
                        </Formik>
                    </div>
                </div>
            </Modal>

            <Modal2 isOpen={isAddFilterModalOpen}>
                <div onClick={() => { setIsAddFilterModalOpen(false) }} className="w-screen h-screen flex flex-col items-center p-20 items-center bg-black/50">
                    <div onClick={(e) => { e.stopPropagation() }} className="max-w-full max-h-full overflow-y-auto bg-white px-14 pt-5 pb-10 rounded">
                        <div className="flex justify-end"> <FiX className="text-lg cursor-pointer" onClick={() => { setIsAddFilterModalOpen(false) }} /></div>
                        <div className="text-xl font-semibold">{isComposeMode ? 'Compose Filter' : 'Add Filter'}</div>
                        {
                            isComposeMode &&
                            <div className="flex px-5 mt-5">
                                <ObjSelect noEmpty value={latestLogicalOp} onChange={(e) => { setLatestLogicalOp(e.target.value) }} name={'log_op'} label={'Boolean operation'} options={{ or: 'OR', and: 'AND' }} />
                            </div>
                        }
                        <div className="grid grid-cols-3 gap-x-5 gap-y-8 px-5 mt-3">
                            <ObjSelect value={subFilter?.attribute} onChange={(e) => { setSubFilter((prev) => ({ ...prev, attribute: e.target.value })) }} name={'attribute'} label={'Attribute'} options={filterAttributes} />
                            {subFilter.attribute !== " " && (
                                <>
                                    {
                                        [...numericColumns, 'income'].includes(subFilter.attribute) ?
                                            <>
                                                <ObjSelect value={subFilter?.operation} onChange={(e) => { setSubFilter((prev) => ({ ...prev, operation: e.target.value })) }} name={'operation'} label={'Operation'} options={operationDescriptions} />
                                                <AppInput value={subFilter?.operand} onChange={(e) => { setSubFilter((prev) => ({ ...prev, operand: e.target.value })) }} name={'operand'} label={'Operand'} />
                                            </>
                                            :
                                            <>
                                                <ObjSelect value={subFilter?.operation} onChange={(e) => { setSubFilter((prev) => ({ ...prev, operation: e.target.value })) }} name={'operation'} label={'Operation'} options={{ eq: "equals", neq: 'not equal to' }} />
                                                <ObjSelect sameValue value={subFilter?.operand} onChange={(e) => { setSubFilter((prev) => ({ ...prev, operand: e.target.value })) }} name={'operand'} label={'Operand'} options={attributeObjMapping[subFilter.attribute]} />
                                            </>
                                    }
                                </>
                            )}
                        </div>
                        {
                            (subFilter.operand && subFilter.operation && (!isComposeMode || (isComposeMode && (latestLogicalOp !== 'none')))) &&
                            <>
                                <div className="mx-5 mt-5">
                                    <div className="flex bg-gray-100 border border-gray-300 shadow rounded-xl px-4 py-1 font-mono mt-8 text-sm">{filterToString(subFilter)}</div>
                                    <ActionButton text={'Save'} noIcon onClick={() => {
                                        if (isCreateModalOpen) {
                                            const resultingFilter = isComposeMode ? { [latestLogicalOp]: [filters, subFilter] } : subFilter
                                            setFilters(resultingFilter); setIsAddFilterModalOpen(false);
                                        } else if (isDetailModalOpen) {
                                            const resultingFilter = isComposeMode ? { [latestLogicalOp]: [selectedProductFilters, subFilter] } : subFilter
                                            setSelectedProductFilters(resultingFilter); setIsAddFilterModalOpen(false);
                                        }
                                    }} className={'bg-primary text-white mt-5'} />
                                </div>
                            </>
                        }

                    </div>
                </div>
            </Modal2>
            <Modal2 isOpen={isCustomerDetailModalOpen}>
                <div onClick={() => { setIsCustomerDetailModalOpen(false) }} className="w-screen h-screen flex flex-col items-center p-20 items-center bg-black/50">
                    <div onClick={(e) => { e.stopPropagation() }} className="max-w-full max-h-full overflow-y-auto bg-white px-14 pt-5 pb-10 rounded">
                        <div className="flex justify-end"> <FiX className="text-lg cursor-pointer" onClick={() => { setIsCustomerDetailModalOpen(false) }} /></div>
                        <div className="text-xl font-semibold mb-10">Customer Details</div>
                        {selectedCustomer &&
                            Object.entries(getApplicantInfoField(selectedCustomer)).map(([key, value]) => (
                                <div className="flex gap-3">
                                    <div className="font-semibold">{key}:</div>
                                    <div className="">{value}</div>
                                </div>
                            ))
                        }
                        {selectedCustomer &&
                            Object.entries(selectedCustomer).map(([key, value]) => {
                                if (["nc_info", "customer", "id"].includes(key)) {
                                    return null
                                }
                                return (
                                    <div className="flex gap-3">
                                        <div className="font-semibold">{key}:</div>
                                        <div className="">{value}</div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            </Modal2>
            <Modal isOpen={isDetailModalOpen}>
                <div onClick={() => { setIsDetailModalOpen(false) }} className="w-screen h-screen flex flex-col p-10 items-center bg-black/50">
                    <div onClick={(e) => { e.stopPropagation() }} className="flex flex-col w-full h-full bg-white overflow-y-auto px-14 pt-5 pb-10 rounded">
                        <div className="flex justify-end"> <FiX className="text-lg cursor-pointer" onClick={() => { setIsDetailModalOpen(false) }} /></div>
                        <div className="text-xl font-semibold">Product Details</div>
                        <div className="flex-1 grid grid-cols-2 gap-10">
                            <Formik
                                initialValues={selectedProduct}
                                validationSchema={productSchema}
                                onSubmit={updateProduct}
                            >
                                <div>
                                    <div className="flex flex-col mt-10">
                                        <div className="grid grid-cols-2 gap-x-5 gap-y-8">
                                            <FormInput disabled={isUpdateFormFieldDisabled} name={'name'} type={'text'} label={'Product name'} placeholder="Product name" />
                                            <FormInput disabled={isUpdateFormFieldDisabled} name={'duration'} type={'number'} label={'Duration (months)'} placeholder="Duration (months)" />
                                            <FormSelect disabled={isUpdateFormFieldDisabled} name={'purpose'} label={'Purpose'} options={purposeOptions} />
                                            <FormInput disabled={isUpdateFormFieldDisabled} name={'credit_amount'} type={'number'} label={'Max loan amount (GH₵)'} placeholder="0.00" />
                                        </div>
                                    </div>

                                    <div className="text-base font-semibold mt-10">Filters</div>
                                    <FilterRenderer filter={selectedProductFilters} filters={selectedProductFilters} setFilters={setSelectedProductFilters} />
                                    {
                                        Object.keys(selectedProductFilters).length === 0 ?
                                            <div className="flex mt-5">
                                                <ActionButton onClick={() => { setSubFilter({ attribute: ' ' }); setIsAddFilterModalOpen(true) }} className={'bg-primary text-white'} text={'Add Filter'} />
                                            </div>
                                            :
                                            <div className="flex mt-5 gap-5">
                                                <ActionButton onClick={() => { setSubFilter({ attribute: ' ' }); setIsComposeMode(true); setIsAddFilterModalOpen(true) }} className={'bg-primary text-white'} text={'Compose'} />
                                                <ActionButton onClick={() => { setSelectedProductFilters({}); setIsComposeMode(false); }} icon={TbTrash} className={'bg-secondary text-white'} text={'Clear'} />
                                            </div>
                                    }
                                    {
                                        Object.keys(selectedProductFilters).length !== 0 &&
                                        <div className="flex bg-gray-100 border border-gray-300 shadow rounded-lg py-1 font-mono mt-8 text-sm">{filterToString(selectedProductFilters)}</div>
                                    }

                                    <div className="flex w-full justify-between mt-12">
                                        <ActionButton className={`${isUpdateFormFieldDisabled ? 'bg-primary' : 'bg-alt'} text-white px-4 py-3 text-sm rounded`} noIcon text={isUpdateFormFieldDisabled ? 'Edit' : 'Lock'} onClick={() => setIsUpdateFormFieldDisabled(!isUpdateFormFieldDisabled)} />
                                        {
                                            !isUpdateFormFieldDisabled &&
                                            (loading ?
                                                <div className={'bg-surface-light text-white px-4 py-3 text-center text-sm rounded'}>Loading...</div>
                                                :
                                                <Submit className={'bg-surface-light text-white px-4 py-3 text-sm rounded'} text={'Update Product'} />)
                                        }
                                    </div>
                                </div>
                            </Formik>
                            <div className="flex flex-col overflow-y-auto h-full">
                                <div className="text-sm font-medium mb-3">Eligible Customers</div>
                                <MUIDataTable
                                    columns={predictionColumns}
                                    pageSize={10}
                                    onRowClick={showCustomerDetails}
                                    rows={selectedProduct?.eligible_customers ? selectedProduct.eligible_customers : []}
                                />
                                <div className="flex">
                                    <AppInput type={'number'} label={"Limit"} value={eligibleNumber} onChange={(e) => setEligibleNumber(e.target.value)} />
                                </div>
                                <div className="flex gap-5 mt-4 text-alt font-semibold">
                                    <div className="flex gap-3 items-center">
                                        <div className="text-sm">Customers only</div>
                                        <CheckBox checked={isCustomerOnly} onChange={() => { setIsCustomerOnly((prev) => !prev) }} />
                                    </div>
                                    {/* <div className="flex gap-3 items-center">
                                        <div className="text-sm">No model</div>
                                        <CheckBox checked={useModel} onChange={() => { setUseModel((prev) => !prev) }} />
                                    </div> */}
                                </div>
                                <ActionButton className={`bg-primary text-white px-4 py-3 mt-4 text-sm rounded`} noIcon text={'Find most eligible'} onClick={getEligible} />
                            </div>

                        </div>

                    </div>
                </div>
            </Modal>
            <div className="flex-1 relative">
                <div className="absolute w-full h-full top-0 flex flex-col bg-white rounded">
                    {loading ? (
                        <div className="bg-white h-[623px] flex flex-col items-center justify-center w-full overflow-auto">
                            <Loader height={200} width={200} />
                            <div className="font-semibold">Loading...</div>
                        </div>
                    ) : (
                        <>
                            <div className="flex px-4 py-2">
                                <SearchBar placeholder={'Product name'} />
                                <ActionButton onClick={() => { setIsCreateModalOpen(true) }} text={'Add Product'} className={'ml-auto bg-surface-light text-white'} />
                            </div>
                            <div className="h-full">
                                <MUIDataTable
                                    columns={columns}
                                    pageSize={10}
                                    onRowClick={showProductDetails}
                                    rows={products}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </SideNavLayout>
    );
}
