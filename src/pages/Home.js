import { DatePicker, Form, message, Select, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddEditTransaction from "../components/AddEditTransaction";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import "../resources/transactions.css";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Analatics from "../components/Analatics";
const { RangePicker } = DatePicker;
function Home() {
  const [showAddEditTransactionModal, setShowAddEditTransactionModal] =
    useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [selectedRange, setSelectedRange] = useState([]);
  const [viewType, setViewType] = useState("table");
  const getTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-1"));

      setLoading(true);
      const response = await axios.post(
        "https://fair-lime-foal-hat.cyclic.app/api/transactions/get-all-transactions",
        {
          userid: user._id,
          frequency,
          ...(frequency === "custom" && { selectedRange }),
          type,
        }
      );
      setTransactionsData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  const deleteTransaction = async (record) => {
    try {
      setLoading(true);
      await axios.post("https://fair-lime-foal-hat.cyclic.app/api/transactions/delete-transaction", {
        transactionId: record._id,
      });
      message.success("Transaction Deleted successfully");
      getTransactions();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };
  useEffect(() => {
    getTransactions();
  }, [frequency, selectedRange, type]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div>
            <EditOutlined
              onClick={() => {
                setSelectedItemForEdit(record);
                setShowAddEditTransactionModal(true);
              }}
            />
            <DeleteOutlined className="mx-3" onClick={()=>deleteTransaction(record)}/>
          </div>
        );
      },
    },
  ];

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <div className="filter d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="d-flex flex-column">
            <h6>Select Frequency</h6>
            <Select value={frequency} onChange={(value) => setFrequency(value)}>
              <Select.Option value="7">Last 1 Week</Select.Option>
              <Select.Option value="30">Last 1 Month</Select.Option>
              <Select.Option value="365">Last 1 Year</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>

            {frequency === "custom" && (
              <div className="mt-2">
                <RangePicker
                  value={selectedRange}
                  onChange={(values) => setSelectedRange(values)}
                />
              </div>
            )}
          </div>
          <div className="d-flex flex-column mx-5">
            <h6>Select Type</h6>
            <Select value={type} onChange={(value) => setType(value)}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expence">Expence</Select.Option>
            </Select>
          </div>
        </div>

        <div className="d-flex">
          <div>
            <div className="view-switch mx-5">
              <UnorderedListOutlined
                className={`mx-3 ${
                  viewType === "table" ? "active-icon" : "inactive-icon"
                } `}
                onClick={() => setViewType("table")}
                size={30}
              />
              <AreaChartOutlined
                className={`${
                  viewType === "analytics" ? "active-icon" : "inactive-icon"
                } `}
                onClick={() => setViewType("analytics")}
                size={30}
              />
            </div>
          </div>
          <button
            className="primary"
            onClick={() => setShowAddEditTransactionModal(true)}
          >
            ADD NEW
          </button>
        </div>
      </div>

      <div className="table-analtics">
        {viewType === "table" ? (
          <div className="table">
            <Table columns={columns} dataSource={transactionsData} />
          </div>
        ) : (
          <Analatics transactions={transactionsData} />
        )}
      </div>

      {showAddEditTransactionModal && (
        <AddEditTransaction
          showAddEditTransactionModal={showAddEditTransactionModal}
          setShowAddEditTransactionModal={setShowAddEditTransactionModal}
          selectedItemForEdit={selectedItemForEdit}
          getTransactions={getTransactions}
          setSelectedItemForEdit={setSelectedItemForEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default Home;

// import React, { useEffect, useState } from 'react'
// import DefaultLayout from '../components/DefaultLayout';
// import '../resources/transactions.css'
// import FormItem from 'antd/lib/form/FormItem';
// import AddEditTransaction from '../components/AddEditTransaction';
// import axios from 'axios';
// import Spinner from '../components/Spinner';
// import { DatePicker, message, Select, Table } from 'antd';
// import moment from 'moment';
// const { RangePicker } = DatePicker;

// function Home() {
//   const [showAddEditTransactionModal, setShowAddEditTransactionModal] =
//     useState(false);
//   const [loading, setLoading] = useState(false);
//   const [transactionsData, setTransactionsData] = useState([]);
//   const [frequency, setFrequency] = useState("7");
//   const [selectedRange, setSelectedRange] = useState([]);
//   const getTransactions = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("expense-1"));

//       setLoading(true);
//       const response = await axios.post(
//         "/api/transactions/get-all-transactions",
//         {
//           userid: user._id, frequency
//         }
//       );
//       // console.log(response.data);
//       setTransactionsData(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//       message.error("Something went wrong");
//     }
//   };
//   useEffect(() => {
//     getTransactions();;


//   }, [frequency])
//   const columns = [
//     {
//       title: "Date",
//       dataIndex: "date",
//       render:(text)=><label>{moment(text).utc().format('YYYY-MM-DD')}</label>

//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//     },
//     {
//       title: "Category",
//       dataIndex: "category",
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//     },
//     {
//       title: "Reference",
//       dataIndex: "reference",
//     },
//   ]

//   return (
//     <div>
//       <DefaultLayout>
//         {loading && <Spinner />}
//         <div className='filter d-flex justify-content-between align-items-center'>
//           <div className='d-flex flex-column'>
//             <h6>Select Frequency</h6>
//             <Select value={frequency} onChange={(value) => setFrequency(value)}>
//               <Select.Option value="7">Last 1 Week</Select.Option>
//               <Select.Option value="30">Last 1 Month</Select.Option>
//               <Select.Option value="365">Last 1 Year</Select.Option>
//               <Select.Option value="custom">Custom</Select.Option>
//             </Select>

//             {frequency === "custom" && (
//               <div className="mt-2">
//                 <RangePicker
//                   value={selectedRange}
//                   onChange={(values) => setSelectedRange(values)}
//                 />
//               </div>
//             )}

//           </div>
//           <div>
//             <button className='primary' onClick={() => setShowAddEditTransactionModal(true)} >ADD NEW</button>

//           </div>

//         </div>
//         <div className='table-analtics'>
//           <div className='table'>
//             <Table columns={columns} dataSource={transactionsData} />

//           </div>

//         </div>
//         {showAddEditTransactionModal && (<AddEditTransaction showAddEditTransactionModal={showAddEditTransactionModal} setShowAddEditTransactionModal={setShowAddEditTransactionModal} getTransactions={getTransactions} />)}

//       </DefaultLayout>

//     </div>
//   )
// }
// export default Home;