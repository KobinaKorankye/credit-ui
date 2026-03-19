import React, { useRef, useState, useContext, useEffect } from "react";
import SideNavLayout from "../layouts/SideNavLayout";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { dateRangeStartAndEnd, filterByDate, transformModelApiObject } from "../helpers";
import client from "../api/client";
import MUIDataTable from "../components/MUITable";
import CustomLoader from "../components/CustomLoader";
import Card from "../components/Card";
import DonutChart from "../components/charts/DonutChart";
import { getKDEData } from "../components/charts/helpers";
import CurrencyLegend from "../components/charts/legends/CurrencyLegend";
import CreditDistributionChart from "../components/charts/CreditDistributionChart";
import { LuUser, LuUserCheck, LuUserCog, LuUserX } from "react-icons/lu";
import numeral from "numeral";
import CreditTrends from "../components/charts/CreditTrends";
import Modal from "../components/modals/Modal";
import { FiX } from 'react-icons/fi';
import * as Yup from 'yup';
import { Formik } from "formik";
import FormInput from "../components/formik/FormInput";
import Submit from "../components/formik/Submit";
import UserContext from "../contexts/UserContext";

const dashStatsSchema = Yup.object().shape({
  name: Yup.string()
    .required()
    .label("Name"),
  start_date: Yup.string().required().label("Start date"),
  end_date: Yup.string().required().label("End date"),
})

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);

  const [activeFilter, setActiveFilter] = useState('year')
  const [activeFilterStartDate, setActiveFilterStartDate] = useState('2020-07-01')
  const [startDate, setStartDate] = useState('2020-07-01')
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [filter, setFilter] = useState('all')
  const [dashboardData, setDashboardData] = useState({})
  const [customFilters, setCustomFilters] = useState([])
  const { user } = useContext(UserContext)
  const [showCustomFIlterCreationModal, setShowCustomFIlterCreationModal] = useState(false)
  const [taskId, setTaskId] = useState(null);
  const [filteredLoanees, setFilteredLoanees] = useState([])
  const eventSourceRef = useRef(null);

  const getPrediction = async (row) => {
    const body = transformModelApiObject(row);
    setLoading(true);
    try {
      const { data } = await client.post("/predict", body);
      navigate("/analysis", { state: { formEntry: body, response: data[0] } });
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

  const getLoanees = async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/loanees");
      setUsers(data);
    } catch (error) {
      toast.error("Failed", {
        position: "top-right",
      });
    }
    setLoading(false);
  };

  const getLoans = async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/loans?outcome=completed");
      setLoans(data);
    } catch (error) {
      toast.error("Failed", {
        position: "top-right",
      });
    }
    setLoading(false);
  };

  const getDashboardData = async () => {
    setLoading(true);
    setChartsLoading(true);
    try {
      const { data } = await client.get(`/fx/dashboard-data?filterType=${filter}${filter === 'date_range' ? `&startDate=${startDate}&endDate=${endDate}` : filter === 'date' ? `&date=${startDate}` : ''}`);
      setDashboardData(data);

      setActiveFilter(filter)
      setActiveFilterStartDate(startDate)
      setFilteredLoanees(filterByDate(loans, "date_updated", { filterType: filter, startDate, endDate, date: startDate }))

    } catch (error) {
      toast.error("Failed to load dashboard data", {
        position: "top-right",
      });
    }
    // Add a small delay to make loading states more visible
    setTimeout(() => {
      setLoading(false);
      setChartsLoading(false);
    }, 300);
  };

  const getCustomFilters = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(`/dash-stats`);
      setCustomFilters(data);

    } catch (error) {
      toast.error("Failed to load custom filters", {
        position: "top-right",
      });
    }
    setLoading(false);
  };

  const createCustomFilter = async (form) => {
    setLoading(true);
    try {
      const { data } = await client.post("/fx/create-dash-stats", form);

      setTaskId(data.task_id);
      toast.info(`Creating custom filter: ${form.name}`, {
        position: "top-right",
      });
      setShowCustomFIlterCreationModal(false)
    } catch (error) {
      toast.error("Failed", {
        position: "top-right",
      });
    }
    setLoading(false);
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
        getCustomFilters();
        setLoading(false);
        eventSource.close(); // Close the EventSource when processing is complete
        setTaskId(null); // Reset taskId
      } else if (status === 'FAILURE') {
        toast.error("Custom filter creation failed", {
          position: "top-right",
        });
        getCustomFilters();
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
    },
    {
      field: "outcome",
      headerName: "Outcome",
      width: 130,
      valueGetter: (value, row) => `${classes[row.outcome]}`,
    },
  ];

  const options = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'date', label: 'Custom Date' },
  ];

  useEffect(() => {
    if (["today", "week", "month", "year"].includes(filter)) {
      const { startDate, endDate } = dateRangeStartAndEnd(filter)
      setStartDate(startDate)
      setEndDate(endDate)
    } else if (["date"].includes(filter)) {
      setStartDate('2020-07-01')
      setEndDate(format(new Date(), "yyyy-MM-dd"))
    }
  }, [filter])

  useEffect(() => {
    getLoanees();
    getLoans();
    getDashboardData();
    getCustomFilters();
  }, []);

  useEffect(() => {
    setFilteredLoanees(filterByDate(loans, "date_updated", { filterType: filter, startDate, endDate, date: startDate }))
  }, [loans]);

  // Trigger data fetching when filters change
  useEffect(() => {
    if (filter && startDate && endDate) {
      getDashboardData();
    }
  }, [filter, startDate, endDate]);

  // Show full dashboard loading state when any critical data is loading
  const isFullDashboardLoading = loading || chartsLoading;

  return (
    <SideNavLayout>
      <div className="space-y-6 pb-6">
        {/* Header */}
        <p className="text-sm text-muted-foreground">
          Monitor loan performance and credit analytics
        </p>

        {/* Filters — always visible */}
        <div className="flex flex-wrap items-center gap-3">
          {options.map((option, index) => (
            <button
              key={index}
              className={`
                ${option.value === filter
                  ? 'text-primary-foreground bg-primary border-primary'
                  : 'text-foreground bg-background border-border hover:bg-muted'
                }
                cursor-pointer px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap
              `}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}

          {filter === 'date' && (
            <>
              <input
                type="date"
                className="h-8 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onChange={(e) => setStartDate(e.target.value)}
                value={startDate}
              />
              {(activeFilterStartDate !== startDate || activeFilter !== filter) && (
                <button
                  onClick={getDashboardData}
                  className="h-8 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              )}
            </>
          )}
        </div>

        {/* Content */}
        {isFullDashboardLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <CustomLoader />
          </div>
        ) : (
          <>
          {/* Key Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Applications</span>
                <LuUser className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground mt-2">
                {dashboardData?.application_stats?.total?.toLocaleString() || '--'}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Approved</span>
                <LuUserCheck className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-foreground mt-2">
                {dashboardData?.application_stats?.approved?.toLocaleString() || '--'}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Pending</span>
                <LuUserCog className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-foreground mt-2">
                {dashboardData?.application_stats?.pending?.toLocaleString() || '--'}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Rejected</span>
                <LuUserX className="h-4 w-4 text-destructive" />
              </div>
              <div className="text-2xl font-bold text-foreground mt-2">
                {dashboardData?.application_stats?.rejected?.toLocaleString() || '--'}
              </div>
            </Card>
          </div>

          {/* Risk Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-6">
            <Card title="NPL Ratio" className="lg:col-span-2">
              <DonutChart
                legendComponent={CurrencyLegend}
                showRatio
                ratioIndexToShow={0}
                data={dashboardData?.loan_stats?.npl_donut}
              />
            </Card>

            <Card className="lg:col-span-4">
              <CreditDistributionChart
                data={getKDEData(filteredLoanees, 'loan_amount')}
                height={350}
              />
            </Card>

            <Card title="Default Rate" className="lg:col-span-2">
              <DonutChart
                showRatio
                ratioIndexToShow={0}
                data={dashboardData?.loan_stats?.default_rate}
              />
            </Card>
          </div>

          {/* Credit Trends */}
          <Card className="w-full">
            <CreditTrends
              loanData={filteredLoanees}
            />
          </Card>

          {/* Loan Portfolio Summary */}
          <Card title="Loan Portfolio Summary" className="w-full">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mt-5">
              <div className="flex-1">
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Total Disbursed</div>
                  <div className="text-3xl lg:text-4xl font-bold text-foreground">
                    GH₵{numeral(dashboardData?.loan_stats?.summary?.total).format("0,0.00")}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mt-5">
                  <div className="text-center lg:text-left">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Minimum</div>
                    <div className="text-xl lg:text-2xl font-semibold text-foreground">
                      GH₵{numeral(dashboardData?.loan_stats?.summary?.min).format("0,0.00")}
                    </div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Average</div>
                    <div className="text-xl lg:text-2xl font-semibold text-foreground">
                      GH₵{numeral(dashboardData?.loan_stats?.summary?.avg).format("0,0.00")}
                    </div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Maximum</div>
                    <div className="text-xl lg:text-2xl font-semibold text-foreground">
                      GH₵{numeral(dashboardData?.loan_stats?.summary?.max).format("0,0.00")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Applications Table */}
          <Card title="Recent Applications" className="w-full">
            <div className="mt-4">
              <MUIDataTable
                columns={columns}
                onRowClick={getPredictionMUI}
                rows={filteredLoanees}
                pageSize={8}
              />
            </div>
          </Card>
          </>
        )}
      </div>

      <Modal isOpen={showCustomFIlterCreationModal}>
        <div onClick={() => setShowCustomFIlterCreationModal(false)} className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-xl shadow-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Create Custom Filter</h3>
              <button onClick={() => setShowCustomFIlterCreationModal(false)} className="p-1 hover:bg-muted rounded-md transition-colors">
                <FiX className="text-lg text-muted-foreground" />
              </button>
            </div>
            <Formik
              initialValues={{ name: '', start_date: '', end_date: '' }}
              validationSchema={dashStatsSchema}
              onSubmit={createCustomFilter}
            >
              <div className="space-y-5">
                <FormInput name="name" type="text" label="Filter name" placeholder="e.g. Q1 2024" />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput name="start_date" type="date" label="Start date" />
                  <FormInput name="end_date" type="date" label="End date" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomFIlterCreationModal(false)}
                    className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <Submit
                    className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors"
                    text={loading ? 'Creating...' : 'Create'}
                  />
                </div>
              </div>
            </Formik>
          </div>
        </div>
      </Modal>
    </SideNavLayout>
  );
}
