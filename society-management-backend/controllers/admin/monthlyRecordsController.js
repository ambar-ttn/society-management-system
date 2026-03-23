import pool from "../../config/db.js";
import monthlyRecordService from "../../services/monthlyRecordService.js";

// GET MONTHLY RECORDS
export const getMonthlyRecords = async (req,res)=>{
 try{

  let { month, year, page } = req.query;

  const limit = 10;
  const currentPage = parseInt(page) || 1;
  const offset = (currentPage - 1) * limit;

  const monthNumber = monthlyRecordService.getMonthNumber(month);

  // total records count
  const totalRecords = await monthlyRecordService.getTotalRecordsCount(monthNumber, year);

  const records = await monthlyRecordService.getMonthlyRecords(monthNumber, year, limit, offset);
   console.log(records);

  return res.status(200).json({
    success:true,
    records: records,
    currentPage: currentPage,
    totalPages: Math.ceil(totalRecords / limit),
    totalRecords: totalRecords
  });

 }catch(error){

  console.error("Get Monthly Records Error:",error);

  return res.status(500).json({
    success:false,
    message:"Error fetching monthly records"
  });

 }
};


// UPDATE PAYMENT STATUS
export const updateMonthlyRecord = async (req,res)=>{
 try{

  const { id } = req.params;
  const { status } = req.body;

  if(!["paid","pending"].includes(status)){
   return res.status(400).json({
    success:false,
    message:"Invalid status"
   });
  }

  const record = await monthlyRecordService.getRecordById(id);

  if(!record){
   return res.status(404).json({
    success:false,
    message:"Record not found"
   });
  }

  const updated = await monthlyRecordService.updateRecordStatus(id, status);

  // if paid → insert payment
  if(status === "paid"){

   const paymentExists = await monthlyRecordService.checkPaymentExists(
     record.flat_id, record.month, record.year
   );

   if(!paymentExists){

    await monthlyRecordService.insertPayment(
      record.flat_id, record.month, record.year, record.amount, "Manual"
    );

   }
  }

  return res.status(200).json({
   success:true,
   message:"Payment status updated successfully",
   data: updated
  });

 }catch(error){

  console.error("Update Monthly Record Error:",error);

  return res.status(500).json({
   success:false,
   message:"Error updating record"
  });

 }
};