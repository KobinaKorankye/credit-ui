import React, { useState } from "react";
import SideNavLayout from "../layouts/SideNavLayout";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { addDays, format, max, min, parseISO } from "date-fns";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchGraphData } from "../store/graphDataSlice";
import { dateRangeStartAndEnd, filterByDate, generateName, getPredClass, getRechartsDataForPlot, getTotalOfColumn, transformModelApiObject } from "../helpers";
import client from "../api/client";
import { COLUMN_LABELS, columnNames, columns, mappings } from "../constants";
import MUIDataTable from "../components/MUITable";
import Loader from "../loader/Loader";
import Card from "../components/Card";
import DonutChart from "../components/charts/DonutChart";
import { getDefaultRateData, getKDEData, getNPLDonutData } from "../components/charts/helpers";
import CurrencyLegend from "../components/charts/legends/CurrencyLegend";
import ProbDensityChart from "../components/charts/ProbDensityChart";
import RegularSelect from "../components/RegularSelect";
import RegularInput from "../components/RegularInput";
import RegularSelectAlt from "../components/RegularSelectAlt";
import RegularInputAlt from "../components/RegularInputAlt";
import SummaryCard from "../components/SummaryCard";
import { BiCoin, BiCoinStack, BiLoaderCircle } from 'react-icons/bi';
import { LuUser, LuUserCheck, LuUserCog, LuUserMinus, LuUsers2, LuUserX } from "react-icons/lu";
import StatCard from "../components/StatCard";
import { FaUserClock } from "react-icons/fa";
import numeral from "numeral";
import BarGraph from "../components/charts/BarGraph";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [gapplicants, setGApplicants] = useState([]);

  const [activeFilter, setActiveFilter] = useState('date_range')
  const [activeFilterStartDate, setActiveFilterStartDate] = useState('2020-07-01')
  const [activeFilterEndDate, setActiveFilterEndDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [startDate, setStartDate] = useState('2020-07-01')
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [filter, setFilter] = useState('date_range')
  const [dashboardData, setDashboardData] = useState({})


  const getPrediction = async (row) => {
    const body = transformModelApiObject(row);
    setLoading(true);
    try {
      const { data } = await client.post("/predict", body);
      //   toast.success("Sent Successfully", {
      //     position: "top-left",
      //   });
      navigate("/analysis", { state: { formEntry: body, response: data[0] } });
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

  const getLoanees = async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/loanees");
      // toast.success("Loaded Successfully", {
      //   position: "top-left",
      // });
      setUsers(data);
    } catch (error) {
      toast.error("Failed", {
        position: "top-left",
      });
      console.log(error);
    }
    setLoading(false);
  };

  const getLoans = async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/loans");
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

  const getDashboardData = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(`/fx/dashboard-data?filterType=${filter}${filter == 'date_range' ? `&startDate=${startDate}&endDate=${endDate}` : filter == 'date' ? `&date=${startDate}` : ''}`);
      toast.success("Loaded Successfully", {
        position: "top-left",
      });
      setDashboardData(data);

      setActiveFilter(filter)
      setActiveFilterStartDate(startDate)
      setActiveFilterEndDate(endDate)

    } catch (error) {
      toast.error("Failed to load dashboard data", {
        position: "top-left",
      });
      console.log(error);
    }
    setLoading(false);
  };

  const getGApplicants = async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/gapplicants");
      //   toast.success("Loaded Successfully", {
      //     position: "top-left",
      //   });
      setGApplicants(data.reverse());
    } catch (error) {
      toast.error("Failed", {
        position: "top-left",
      });
      console.log(error);
    }
    setLoading(false);
  };

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
      valueGetter: (value, row) => `${classes[row.outcome]}`,
    },
  ];



  const options = [
    // { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'date', label: 'Date' },
    { value: 'date_range', label: 'Date Range' },
  ];

  const filteredLoanees = filterByDate(users, "date_created", { filterType: filter, startDate, endDate, date: startDate })
  const filteredGApplicants = filterByDate(gapplicants, "date_updated", { filterType: filter, startDate, endDate, date: startDate })

  const loaneeCreditAmounts = filteredLoanees.map((l) => l.credit_amount);

  useEffect(() => {
    if (!["date", "date_range", "all"].includes(filter)) {
      console.log("Filter: ", filter)
      const { startDate, endDate } = dateRangeStartAndEnd(filter)
      setStartDate(startDate)
      setEndDate(endDate)
    } else if (filter === "all") {
      const dates = filteredLoanees.map(item => parseISO(item["date_created"]));
      setStartDate(format(min(dates), 'yyyy-MM-dd'));
      setEndDate(format(max(dates), 'yyyy-MM-dd'),);
    } else {
      setStartDate('2020-07-01')
      setEndDate(format(new Date(), "yyyy-MM-dd"))
    }
  }, [filter])

  useEffect(() => {
    getLoanees();
    getGApplicants();
    getLoans();
    getDashboardData();
  }, []);

  return (
    <SideNavLayout>
      <Card title={'Filters'} alt className={`border border-accent`}>
        {/* <div className="flex items-end mt-2">
          <RegularSelectAlt boxClassName="w-[11vw]" onChange={(e) => setFilter(e.target.value)} value={filter} name="filter" label="Filter By" options={options} />
        </div> */}
        <div className="flex gap-4 w-full mt-4">
          {
            options.map((option, index) => (
              <div key={index} className={`${option.value === filter ? 'text-white bg-surface' : 'bg-white border border-gray-700'} cursor-pointer px-4 py-1 rounded-full text-xs`} onClick={(e) => setFilter(option.value)}>
                {option.label}
              </div>
            ))
          }
        </div>
        <div className={`flex items-end overflow-hidden duration-200 transition-all h-[4.5rem] border-t border-gray-400 mt-4`}>
          <RegularInputAlt type="date" disabled={!["date", "date_range"].includes(filter)} boxClassName="w-[11vw]" onChange={(e) => setStartDate(e.target.value)} value={startDate} name="sdt" label={["date", "today"].includes(filter) ? "Date" : "Start Date"} />
          {
            !["date", "today"].includes(filter) &&
            <RegularInputAlt type="date" disabled={!["date", "date_range"].includes(filter)} boxClassName="w-[11vw] ml-4" onChange={(e) => setEndDate(e.target.value)} value={endDate} name="edt" label={"End Date"} />
          }
          {
            ((activeFilterStartDate != startDate) || (activeFilterEndDate != endDate) || (activeFilter != filter)) &&
            <div onClick={() => {
              getDashboardData();
            }}
              className="flex cursor-pointer justify-center items-center ml-20 text-xs tracking-wider font-[600] rounded-lg hover:bg-surface-light duration-200 px-[1rem] py-[0.5rem] text-white bg-surface"
            >
              Filter
            </div>
          }
          {/* <div onClick={() => {
            // getTransactionsSummary('2020-07-01', format(new Date(), "yyyy-MM-dd")); setStartDate('2020-07-01'); setEndDate(format(new Date(), "yyyy-MM-dd")) 
          }}
            className="flex cursor-pointer justify-center items-center ml-4 text-xs tracking-wider font-[600] dark:font-[600] rounded bg-accent/60 px-[1rem] py-[0.6rem] text-black"
          >
            Reset
          </div> */}
        </div>
      </Card>
      {/* <SummaryCard 
        // viewBtnClassName={`bg-accent/30 text-black hover:border hover:border-accent/90`} 
        className={''} title={"All Loans"} value={9000} volume={9} /> */}
      {/* <div className="grid grid-cols-4 gap-4 mt-4">
        <StatCard title={'Number of Applications'} statClassName={'text-2xl text-gray-500'} className={'border border-gray-400'} noColor icon={LuUser} stat={filteredLoanees.length + filteredGApplicants.length} />
        <StatCard title={'Approved Applications'} className={''} alt icon={() => <LuUserCheck className="text-primary/50" />} stat={filteredLoanees.length} />
        <StatCard title={'Rejected Applications'} className={''} icon={() => <LuUserX className="text-secondary/50" />} stat={filteredGApplicants.filter((g) => g.status === "rejected").length} />
        <StatCard title={'Pending Applications'} className={''} alt option={2} icon={() => <LuUserCog className="text-accent/50" />} stat={filteredGApplicants.filter((g) => g.status === "pending").length} />
      </div> */}

      <div className="grid grid-cols-8 gap-4 mt-4">
        <div className="col-span-4 grid grid-cols-2 gap-4">
          <StatCard title={'Number of Applications'} statClassName={'text-2xl text-gray-500'} className={'border border-gray-400'} noColor icon={LuUser} stat={dashboardData?.application_stats?.total} />
          <StatCard title={'Approved Applications'} className={''} alt icon={() => <LuUserCheck className="text-primary/50" />} stat={dashboardData?.application_stats?.approved} />
          <StatCard title={'Pending Applications'} className={''} alt option={2} icon={() => <LuUserCog className="text-accent/50" />} stat={dashboardData?.application_stats?.pending} />
          <StatCard title={'Rejected Applications'} className={''} icon={() => <LuUserX className="text-secondary/50" />} stat={dashboardData?.application_stats?.rejected} />
        </div>
        <Card title={'Average Number of Applications'} titleClassName={'text-gray-700'} className={'col-span-4'}>
          <div className="pt-5 mt-1 w-full">
            <BarGraph grid height={200} data={getRechartsDataForPlot(dashboardData?.application_stats?.total, { filterType: activeFilter, startDate: activeFilterStartDate, endDate: activeFilterEndDate, date: activeFilterStartDate })} />
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-8 gap-4 mt-4">
        <Card title={'NPL Ratio'} className={'col-span-2'}>
          <DonutChart legendComponent={CurrencyLegend} showRatio ratioIndexToShow={0} data={dashboardData?.loan_stats?.npl_donut} />
        </Card>
        <Card title={'Credit Distribution'} className={'col-span-4'}>
          {/* <div className="pt-5 mt-1 w-full bg-gray-100 shadow-lg"> */}
          <ProbDensityChart hideY data={getKDEData(filteredLoanees, 'credit_amount')} />
          {/* </div> */}
          {/* <KDEChart
            title={COLUMN_LABELS["credit_amount"]}
            columnName={"credit_amount"}
            height={250}
            columnArray={[...data["credit_amount"]]}
            classArray={[...data["class"]]}
          /> */}
        </Card>
        <Card title={'Default Rate'} className={'col-span-2'}>
          <DonutChart showRatio ratioIndexToShow={0} data={dashboardData?.loan_stats?.default_rate} />
        </Card>
      </div>
      <div className="grid grid-cols-5 gap-4 mt-4">
        <Card alt className={'border border-gray-400 col-span-5'}
          containerClassName={``}
          titleClassName={`text-gray-700 uppercase`}
          title={`Disbursed Loans`}>
          <div className="flex gap-10 mt-4">
            <div className="flex-1">
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-dark w-full flex items-center">
                    <div className={`text-gray-500 uppercase`}>Total</div>
                  </div>
                  <div className={'text-4xl text-right font-medium text-surface-light'}>GH₵{numeral(dashboardData?.loan_stats?.summary?.total).format("0,0.00")}</div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4 mt-4 items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-dark w-full flex items-center">
                    <div className={`text-gray-500 uppercase`}>Min</div>
                  </div>
                  <div className={'text-2xl font-medium text-gray-600'}>GH₵{numeral(dashboardData?.loan_stats?.summary?.min).format("0,0.00")}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-dark w-full flex items-center">
                    <div className={`text-gray-500 uppercase`}>Avg</div>
                  </div>
                  <div className={'text-2xl font-medium text-gray-600'}>GH₵{numeral(dashboardData?.loan_stats?.summary?.avg).format("0,0.00")}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-dark w-full flex items-center">
                    <div className={`text-gray-500 uppercase`}>Max</div>
                  </div>
                  <div className={'text-2xl font-medium text-gray-600'}>GH₵{numeral(dashboardData?.loan_stats?.summary?.max).format("0,0.00")}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-4 col-span-2">
        <div className="flex flex-col bg-white">
          {/* <div className="flex gap-4 items-center">
            <div className="md:w-[50%]">
              <SearchBar
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                // placeholder={`Type to search by ${filter}`}
              />
            </div>
          </div> */}
          {loading ? (
            <div className="bg-white h-[423px] flex flex-col items-center justify-center w-full overflow-auto">
              <Loader height={200} width={200} />
              <div className="font-semibold">Loading...</div>
            </div>
          ) : (
            // <Table
            //   onRowClick={getPrediction}
            //   columnNames={["id", ...columnNames, "Class"]}
            //   columns={["_id", ...columns, "class"]}
            //   rows={users}
            // />
            <div className="h-[423px]">
              <MUIDataTable
                columns={columns}
                onRowClick={getPredictionMUI}
                rows={loans}
              />
            </div>
          )}
        </div>
      </div>
    </SideNavLayout>
  );
}
