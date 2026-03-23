import paymentService from "../../services/paymentService.js";

export const makePayment = async (req,res)=>{
 try{

  const userId = req.user.id;
  const { flat_id, month, year, payment_mode } = req.body;
  console.log(flat_id);
  

  // verify that flat belongs to user
  const isOwner = await paymentService.verifyFlatOwnership(flat_id, userId);

  if(!isOwner){
   return res.status(403).json({
    success:false,
    message:"Unauthorized flat access"
   });
  }

  const record = await paymentService.getMonthlyRecord(flat_id, month, year);

  if(!record){
   return res.status(404).json({
    success:false,
    message:"Subscription not found"
   });
  }

  if(record.status === "paid"){
   return res.status(400).json({
    success:false,
    message:"Payment already completed"
   });
  }

  const amount = record.amount;

  // insert payment
  const payment = await paymentService.createPayment(flat_id, month, year, amount, payment_mode);

  // update monthly_records
  await paymentService.updateMonthlyRecord(flat_id, month, year);

  res.status(200).json({
   success:true,
   message:"Payment successful",
   receipt:payment
  });

 }catch(err){

  console.error(err);

  res.status(500).json({
   success:false,
   message:"Payment failed"
  });


 }
};