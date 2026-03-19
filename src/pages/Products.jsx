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

import FilterRenderer from "../components/filtering/FilterRenderer";
import { TbTrash } from "react-icons/tb";
import useRefState from "../hooks/useRefState";
import CheckBox from "../components/forms/CheckBox";
import Card from "../components/Card";

// Simple Tab Components for Modal
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
      active
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
    }`}
  >
    {children}
  </button>
);

const TabContainer = ({ children }) => (
  <div className="flex items-center space-x-1 bg-muted rounded-lg p-1 w-fit">
    {children}
  </div>
);

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
        width: 200,
        valueGetter: (value, row) => getApplicantInfoField(row).full_name,
    },
    {
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
    const [taskId, setTaskId] = useState(null);
    const [activeTab, setActiveTab] = useState('product-info');
    const [searchText, setSearchText] = useState('');
    const eventSourceRef = useRef(null);

    const navigate = useNavigate();

    const getProducts = async () => {
        try {
            const { data } = await client.get("/products");
            setProducts(data.reverse());
            setSelectedProduct(data.find((prod) => prod.id === selectedProduct?.id))
        } catch (error) {
            toast.error("Failed", {
                position: "top-right",
            });
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
            setIsCreateModalOpen(false)
        } catch (error) {
            toast.error("Failed", {
                position: "top-right",
            });
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
            setProducts((prev) => prev.map((prod) => prod.id === data.id ? data : prod))
        } catch (error) {
            toast.error("Failed", {
                position: "top-right",
            });
        }
        setLoading(false);
    };

    const getEligible = async () => {
        setLoading(true);
        setLoadingSource("eligible");
        try {
            // Start the Celery task
            const { data } = await client.get(`/fx/get-eligible/${selectedProduct.id}?limit=${eligibleNumber}${isCustomerOnly ? "&type=customers" : ''}`);
            setTaskId(data.task_id); // Set the taskId in state to trigger the useEffect
            setSelectedProduct({ ...selectedProduct, processing: true })
            setProducts(products.map((prod) => selectedProduct.id === prod.id ? { ...prod, processing: true } : prod))
        } catch (error) {
            toast.error("Failed to start processing", {
                position: "top-right",
            });
            setSelectedProduct({ ...selectedProduct, processing: false })
            setProducts(products.map((prod) => selectedProduct.id === prod.id ? { ...prod, processing: false } : prod))
        }

        setLoading(false);
    };

    const contactEligible = async () => {
        setLoading(true);
        setLoadingSource("contact");
        try {
            // Start the Celery task
            const { data } = await client.get(`/fx/contact-eligible/${selectedProduct.id}`);
        } catch (error) {
            toast.error("Failed to start processing", {
                position: "top-right",
            });
            setSelectedProduct({ ...selectedProduct, processing: false })
            setProducts(products.map((prod) => selectedProduct.id === prod.id ? { ...prod, processing: false } : prod))
        }

        setLoading(false);
    };

    const showProductDetails = async (params, event, details) => {
        setSelectedProduct(params.row)
        setEligibleNumber(params.row?.eligible_customers ? params.row?.eligible_customers.length : 0)
        setSelectedProductFilters(params.row.filters || {})
        setIsDetailModalOpen(true)
    };

    const showCustomerDetails = async (params, event, details) => {
        setSelectedCustomer(params.row)
        setIsCustomerDetailModalOpen(true)
    };

    useEffect(() => {
        if (!taskId) return;

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        // Create a new EventSource to listen for task updates
        const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL || "http://54.246.247.31:8001"}/fx/task-status/${taskId}`);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
            const { status } = JSON.parse(event.data);

            if (status === 'SUCCESS') {
                // Fetch updated product data when processing is complete
                getProducts();
                setLoading(false);
                eventSource.close(); // Close the EventSource when processing is complete
                setTaskId(null); // Reset taskId
            } else if (status === 'FAILURE') {
                toast.error("Processing failed", {
                    position: "top-right",
                });
                setLoading(false);
                eventSource.close(); // Close the EventSource on failure
                setTaskId(null); // Reset taskId
            }
        };

        return () => {
            // Clean up EventSource if the component unmounts or taskId changes
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, [taskId]);

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
                <div
                    onClick={() => { setIsCreateModalOpen(false) }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                >
                    <div
                        onClick={(e) => { e.stopPropagation() }}
                        className="bg-background w-full max-w-4xl h-full max-h-[90vh] overflow-y-auto rounded-xl shadow-lg border border-border"
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-background border-b border-border p-6 z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">Create Product</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Create a new loan product with eligibility criteria
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setIsCreateModalOpen(false) }}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <FiX className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <Card title="Product Information" className="w-full">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={productSchema}
                                    onSubmit={createProduct}
                                >
                                    <div className="space-y-6">
                                        {/* Basic Product Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormInput
                                                name="name"
                                                type="text"
                                                label="Product name"
                                                placeholder="Product name"
                                            />
                                            <FormInput
                                                name="duration"
                                                type="number"
                                                label="Duration (months)"
                                                placeholder="Duration (months)"
                                            />
                                            <FormSelect
                                                name="purpose"
                                                label="Purpose"
                                                options={purposeOptions}
                                            />
                                            <FormInput
                                                name="credit_amount"
                                                type="number"
                                                label="Max loan amount (GH₵)"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        {/* Eligibility Filters Section */}
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-semibold text-foreground">Eligibility Filters</h4>
                                            <FilterRenderer filter={filters} filters={filters} setFilters={setFilters} />

                                            {Object.keys(filters).length === 0 ? (
                                                <div className="flex">
                                                    <ActionButton
                                                        onClick={() => { setSubFilter({ attribute: ' ' }); setIsAddFilterModalOpen(true) }}
                                                        variant="default"
                                                        text="Add Filter"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex gap-3">
                                                    <ActionButton
                                                        onClick={() => { setSubFilter({ attribute: ' ' }); setIsComposeMode(true); setIsAddFilterModalOpen(true) }}
                                                        variant="outline"
                                                        text="Compose"
                                                    />
                                                    <ActionButton
                                                        onClick={() => { setFilters({}); setIsComposeMode(false); }}
                                                        icon={TbTrash}
                                                        variant="destructive"
                                                        text="Clear"
                                                    />
                                                </div>
                                            )}

                                            {Object.keys(filters).length !== 0 && (
                                                <div className="bg-muted border border-border rounded-lg p-3 font-mono text-sm text-foreground">
                                                    {filterToString(filters)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Submit Section */}
                                        <div className="pt-4 border-t border-border">
                                            {(loading && loadingSource === 'create') ? (
                                                <div className="bg-primary/70 text-primary-foreground px-4 py-3 text-center text-sm rounded-lg w-full">
                                                    Loading...
                                                </div>
                                            ) : (
                                                Object.keys(filters).length !== 0 && !isValidFilter(filters) ? (
                                                    <div className="text-destructive text-sm py-3 text-center">
                                                        Filter Invalid! Please make sure no values are empty
                                                    </div>
                                                ) : (
                                                    <Submit
                                                        className="bg-primary text-primary-foreground py-3 text-sm rounded-lg w-full hover:bg-primary/90 transition-colors"
                                                        text="Create Product"
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </Formik>
                            </Card>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isAddFilterModalOpen}>
                <div
                    onClick={() => { setIsAddFilterModalOpen(false) }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                >
                    <div
                        onClick={(e) => { e.stopPropagation() }}
                        className="bg-background w-full max-w-3xl h-full max-h-[90vh] overflow-y-auto rounded-xl shadow-lg border border-border"
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-background border-b border-border p-6 z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">
                                        {isComposeMode ? 'Compose Filter' : 'Add Filter'}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {isComposeMode
                                            ? 'Combine existing filters with logical operations'
                                            : 'Define eligibility criteria for the product'
                                        }
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setIsAddFilterModalOpen(false) }}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <FiX className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <Card title="Filter Configuration" className="w-full">
                                <div className="space-y-6">
                                    {/* Boolean Operation for Compose Mode */}
                                    {isComposeMode && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Boolean Operation</label>
                                            <ObjSelect
                                                noEmpty
                                                value={latestLogicalOp}
                                                onChange={(e) => { setLatestLogicalOp(e.target.value) }}
                                                name="log_op"
                                                label="Boolean operation"
                                                options={{ or: 'OR', and: 'AND' }}
                                            />
                                        </div>
                                    )}

                                    {/* Filter Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <ObjSelect
                                            value={subFilter?.attribute}
                                            onChange={(e) => { setSubFilter((prev) => ({ ...prev, attribute: e.target.value })) }}
                                            name="attribute"
                                            label="Attribute"
                                            options={filterAttributes}
                                        />

                                        {subFilter.attribute !== " " && (
                                            <>
                                                {[...numericColumns, 'income'].includes(subFilter.attribute) ? (
                                                    <>
                                                        <ObjSelect
                                                            value={subFilter?.operation}
                                                            onChange={(e) => { setSubFilter((prev) => ({ ...prev, operation: e.target.value })) }}
                                                            name="operation"
                                                            label="Operation"
                                                            options={operationDescriptions}
                                                        />
                                                        <AppInput
                                                            value={subFilter?.operand}
                                                            onChange={(e) => { setSubFilter((prev) => ({ ...prev, operand: e.target.value })) }}
                                                            name="operand"
                                                            label="Operand"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <ObjSelect
                                                            value={subFilter?.operation}
                                                            onChange={(e) => { setSubFilter((prev) => ({ ...prev, operation: e.target.value })) }}
                                                            name="operation"
                                                            label="Operation"
                                                            options={{ eq: "equals", neq: 'not equal to' }}
                                                        />
                                                        <ObjSelect
                                                            sameValue
                                                            value={subFilter?.operand}
                                                            onChange={(e) => { setSubFilter((prev) => ({ ...prev, operand: e.target.value })) }}
                                                            name="operand"
                                                            label="Operand"
                                                            options={attributeObjMapping[subFilter.attribute]}
                                                        />
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Filter Preview and Save */}
                                    {(subFilter.operand && subFilter.operation && (!isComposeMode || (isComposeMode && (latestLogicalOp !== 'none')))) && (
                                        <div className="space-y-4 pt-4 border-t border-border">
                                            <div>
                                                <label className="text-sm font-medium text-foreground mb-2 block">Filter Preview</label>
                                                <div className="bg-muted border border-border rounded-lg p-3 font-mono text-sm text-foreground">
                                                    {filterToString(subFilter)}
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <ActionButton
                                                    text="Save Filter"
                                                    noIcon
                                                    variant="default"
                                                    onClick={() => {
                                                        if (isCreateModalOpen) {
                                                            const resultingFilter = isComposeMode ? { [latestLogicalOp]: [filters, subFilter] } : subFilter
                                                            setFilters(resultingFilter); setIsAddFilterModalOpen(false);
                                                        } else if (isDetailModalOpen) {
                                                            const resultingFilter = isComposeMode ? { [latestLogicalOp]: [selectedProductFilters, subFilter] } : subFilter
                                                            setSelectedProductFilters(resultingFilter); setIsAddFilterModalOpen(false);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isCustomerDetailModalOpen}>
                <div
                    onClick={() => { setIsCustomerDetailModalOpen(false) }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                >
                    <div
                        onClick={(e) => { e.stopPropagation() }}
                        className="bg-background w-full max-w-4xl h-full max-h-[90vh] overflow-y-auto rounded-xl shadow-lg border border-border"
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-background border-b border-border p-6 z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">Customer Details</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        View detailed customer information and eligibility data
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setIsCustomerDetailModalOpen(false) }}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <FiX className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Customer Status Card */}
                            <Card title="Customer Status" className="w-full">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-muted-foreground">Customer Status:</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        selectedCustomer?.customer
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                    }`}>
                                        {selectedCustomer?.customer ? 'Existing Customer' : 'New Applicant'}
                                    </span>
                                </div>
                            </Card>

                            {/* Personal Information Card */}
                            {selectedCustomer && (
                                <Card title="Personal Information" className="w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(getApplicantInfoField(selectedCustomer)).map(([key, value], index) => (
                                            <div key={index} className="space-y-1">
                                                <label className="text-sm font-medium text-muted-foreground capitalize">
                                                    {key.replace(/_/g, ' ')}
                                                </label>
                                                <div className="text-sm text-foreground font-medium">
                                                    {value || 'N/A'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Additional Details Card */}
                            {selectedCustomer && (
                                <Card title="Additional Details" className="w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(selectedCustomer)
                                            .filter(([key]) => !["nc_info", "customer", "id"].includes(key))
                                            .map(([key, value], index) => (
                                                <div key={index} className="space-y-1">
                                                    <label className="text-sm font-medium text-muted-foreground capitalize">
                                                        {key.replace(/_/g, ' ')}
                                                    </label>
                                                    <div className="text-sm text-foreground font-medium">
                                                        {typeof value === 'number' ? value.toFixed(2) : (value || 'N/A')}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isDetailModalOpen}>
                <div
                    onClick={() => { setIsDetailModalOpen(false) }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                >
                    <div
                        onClick={(e) => { e.stopPropagation() }}
                        className="bg-background w-full max-w-6xl h-full max-h-[90vh] overflow-y-auto rounded-xl shadow-lg border border-border"
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-background border-b border-border p-6 z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">Product Details</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Manage product information and eligible customers
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setIsDetailModalOpen(false) }}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <FiX className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* Tab Navigation */}
                            <div className="flex justify-center mb-6">
                                <TabContainer>
                                    <TabButton
                                        active={activeTab === 'product-info'}
                                        onClick={() => setActiveTab('product-info')}
                                    >
                                        Product Information
                                    </TabButton>
                                    <TabButton
                                        active={activeTab === 'customer-targeting'}
                                        onClick={() => setActiveTab('customer-targeting')}
                                    >
                                        Customer Targeting
                                    </TabButton>
                                </TabContainer>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'product-info' && (
                                <Card title="Product Information" className="h-fit">
                                    <Formik
                                        initialValues={selectedProduct}
                                        validationSchema={productSchema}
                                        onSubmit={updateProduct}
                                    >
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormInput
                                                    disabled={isUpdateFormFieldDisabled}
                                                    name={'name'}
                                                    type={'text'}
                                                    label={'Product name'}
                                                    placeholder="Product name"
                                                />
                                                <FormInput
                                                    disabled={isUpdateFormFieldDisabled}
                                                    name={'duration'}
                                                    type={'number'}
                                                    label={'Duration (months)'}
                                                    placeholder="Duration (months)"
                                                />
                                                <FormSelect
                                                    disabled={isUpdateFormFieldDisabled}
                                                    name={'purpose'}
                                                    label={'Purpose'}
                                                    options={purposeOptions}
                                                />
                                                <FormInput
                                                    disabled={isUpdateFormFieldDisabled}
                                                    name={'credit_amount'}
                                                    type={'number'}
                                                    label={'Max loan amount (GH₵)'}
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            {/* Filters Section */}
                                            <div className="space-y-4">
                                                <h4 className="text-lg font-semibold text-foreground">Eligibility Filters</h4>
                                                <FilterRenderer
                                                    filter={selectedProductFilters}
                                                    filters={selectedProductFilters}
                                                    setFilters={setSelectedProductFilters}
                                                />

                                                {Object.keys(selectedProductFilters).length === 0 ? (
                                                    <div className="flex">
                                                        <ActionButton
                                                            onClick={() => { setSubFilter({ attribute: ' ' }); setIsAddFilterModalOpen(true) }}
                                                            className={'bg-primary text-primary-foreground'}
                                                            text={'Add Filter'}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-3">
                                                        <ActionButton
                                                            onClick={() => { setSubFilter({ attribute: ' ' }); setIsComposeMode(true); setIsAddFilterModalOpen(true) }}
                                                            className={'bg-primary text-primary-foreground'}
                                                            text={'Compose'}
                                                        />
                                                        <ActionButton
                                                            onClick={() => { setSelectedProductFilters({}); setIsComposeMode(false); }}
                                                            icon={TbTrash}
                                                            variant="destructive"
                                                            text={'Clear'}
                                                        />
                                                    </div>
                                                )}

                                                {Object.keys(selectedProductFilters).length !== 0 && (
                                                    <div className="bg-muted border border-border rounded-lg p-3 font-mono text-sm text-foreground">
                                                        {filterToString(selectedProductFilters)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-between pt-4 border-t border-border">
                                                <ActionButton
                                                    variant={isUpdateFormFieldDisabled ? 'default' : 'outline'}
                                                    noIcon
                                                    text={isUpdateFormFieldDisabled ? 'Edit' : 'Lock'}
                                                    onClick={() => setIsUpdateFormFieldDisabled(!isUpdateFormFieldDisabled)}
                                                />
                                                {!isUpdateFormFieldDisabled && (
                                                    (loading && loadingSource === 'update') ? (
                                                        <div className="bg-primary/70 text-primary-foreground px-4 py-2 text-center text-sm rounded-lg">
                                                            Loading...
                                                        </div>
                                                    ) : (
                                                        <Submit
                                                            className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-lg hover:bg-primary/90 transition-colors"
                                                            text="Update Product"
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </Formik>
                                </Card>
                            )}

                            {/* Customer Targeting Tab */}
                            {activeTab === 'customer-targeting' && (
                                <Card title="Eligible Customers" className="h-fit">
                                    <div className="space-y-4">
                                        {/* Header Actions */}
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-muted-foreground">
                                                Manage and contact eligible customers for this product
                                            </p>
                                            {selectedProduct?.eligible_customers?.length && (
                                                (loading && loadingSource === 'contact') ? (
                                                    <div className="bg-primary/70 text-primary-foreground px-3 py-2 text-center text-sm rounded-lg">
                                                        Sending...
                                                    </div>
                                                ) : (
                                                    <ActionButton
                                                        className="px-3 py-2 rounded-lg"
                                                        noIcon
                                                        text="Send offer messages"
                                                        onClick={contactEligible}
                                                    />
                                                )
                                            )}
                                        </div>

                                        {/* Data Table */}
                                        <div className="border border-border rounded-lg overflow-hidden">
                                            <MUIDataTable
                                                columns={predictionColumns}
                                                pageSize={10}
                                                onRowClick={showCustomerDetails}
                                                rows={selectedProduct?.eligible_customers ? selectedProduct.eligible_customers : []}
                                            />
                                        </div>

                                        {/* Controls */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                                            <div className="space-y-3">
                                                <AppInput
                                                    type="number"
                                                    label="Limit"
                                                    value={eligibleNumber}
                                                    onChange={(e) => setEligibleNumber(e.target.value)}
                                                />
                                                <div className="flex items-center gap-3">
                                                    <CheckBox
                                                        checked={isCustomerOnly}
                                                        onChange={() => { setIsCustomerOnly((prev) => !prev) }}
                                                    />
                                                    <label className="text-sm font-medium text-foreground">
                                                        Customers only
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex items-end">
                                                {(loading && loadingSource === 'eligible') || selectedProduct?.processing ? (
                                                    <div className="w-full bg-primary/70 text-primary-foreground px-4 py-3 text-center text-sm rounded-lg">
                                                        Processing...
                                                    </div>
                                                ) : (
                                                    <ActionButton
                                                        className="w-full bg-primary text-primary-foreground px-4 py-3 text-sm rounded-lg hover:bg-primary/90 transition-colors"
                                                        noIcon
                                                        text="Find most eligible"
                                                        onClick={getEligible}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
            <div className="flex flex-col w-full h-full">
                {/* Header Controls — always visible */}
                <div className="flex flex-col lg:flex-row gap-4 px-4 py-2">
                    <div className="flex-1 lg:max-w-md">
                        <SearchBar value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder={'Product name'} />
                    </div>

                    <ActionButton
                        onClick={() => { setIsCreateModalOpen(true) }}
                        text={'Add Product'}
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
                            onRowClick={showProductDetails}
                            rows={products.filter((product) =>
                                product.name?.toLowerCase().includes(searchText.toLowerCase())
                            )}
                            loading={loading}
                        />
                    </div>
                )}
            </div>
        </SideNavLayout>
    );
}
