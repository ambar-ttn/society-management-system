import pool from "../../config/db.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import reportService from "../../services/reportService.js";

export const getReport = async (req,res)=>{
  try{

    const { month, year, format } = req.query;

    // GENERATE REPORT DATA USING SERVICE
    const reportData = await reportService.generateReportData(month, year);

     
    // CSV DOWNLOAD
     
    if(format === "csv"){

      const parser = new Parser();
      const csv = parser.parse(reportData.payment_mode_breakdown);
      // json object --> csv string

      res.header("Content-Type","text/csv");
      res.attachment("financial-report.csv");

      return res.send(csv);
    }

    // PDF DOWNLOAD
    if(format === "pdf"){

      const doc = new PDFDocument();

      res.setHeader("Content-Type","application/pdf");
      res.setHeader("Content-Disposition","attachment; filename=report.pdf");

      doc.pipe(res);

      doc.fontSize(18).text("Society Financial Report",{align:"center"});
      doc.moveDown();

      doc.text(`Total Flats: ${reportData.summary.total_flats}`);
      doc.text(`Paid Payments: ${reportData.summary.paid_count}`);
      doc.text(`Pending Payments: ${reportData.summary.pending_count}`);
      doc.text(`Total Collected: ₹${reportData.summary.total_collected}`);

      doc.moveDown();
      doc.text("Payment Mode Breakdown:");

      reportData.payment_mode_breakdown.forEach(p=>{
        doc.text(`${p.mode} : ${p.count} payments | ₹${p.amount}`);
      });

      doc.end();
      return;
    }

    // NORMAL JSON RESPONSE
    res.json({
      success:true,
      report:reportData
    });

  }
  catch(error){
    console.error("Report Error:",error);

    res.status(500).json({
      success:false,
      message:"Error generating report"
    });
  }
};