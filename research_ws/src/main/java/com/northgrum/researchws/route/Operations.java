package com.northgrum.researchws.route;

import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.HashMap;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooby.Jooby;
import org.jooby.hbm.UnitOfWork;

import com.northgrum.researchws.entities.CLActive;
import com.northgrum.researchws.entities.CLChange;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import java.io.FileOutputStream;
/**
 * @author bwatts
 * 
 * CREATE DATE: 2018 APR 13
 * PURPOSE:
 * NOTES:
 * ============================================================================================================================================
 * CHANGE HISTORY
 * ============================================================================================================================================
 */
public class Operations extends Jooby {

	private static final int dbAddSuccess = 201;
	private static final int dbEditSuccess = 200;
	private static final int dbDeleteSuccess = 204;
	private static final int dbFailure = 500;
	
	{
		get("/list/CLRequestActive", req -> {
			return require(UnitOfWork.class).apply(em -> {
				return em.createQuery("from " + CLActive.class.getName() + " order by LOWER(requestTag), requestTag, LOWER(requestValue), requestValue, LOWER(requestTagLevel2), requestTagLevel2, LOWER(requestValueLevel2), requestValueLevel2").getResultList();
			});
		});

		get("/get/requestTag", req -> {
			return require(UnitOfWork.class).apply(em -> {
				return em.createQuery("select distinct requestTag from " + CLActive.class.getName() + " where requestTag is not null order by LOWER(requestTag), requestTag").getResultList();
			});
		});

		get("/get/requestValue", req -> {
			return require(UnitOfWork.class).apply(em -> {
				return em.createQuery("select distinct requestValue from " + CLActive.class.getName() + " where requestValue is not null order by LOWER(requestValue), requestValue").getResultList();
			});
		});

		get("/get/requestTagLevel2", req -> {
			return require(UnitOfWork.class).apply(em -> {
				return em.createQuery("select distinct requestTagLevel2 from " + CLActive.class.getName() + " where requestTagLevel2 is not null order by LOWER(requestTagLevel2), requestTagLevel2").getResultList();
			});
		});

		get("/get/requestValueLevel2", req -> {
			return require(UnitOfWork.class).apply(em -> {
				return em.createQuery("select distinct requestValueLevel2 from " + CLActive.class.getName() + " where requestValueLevel2 is not null order by LOWER(requestValueLevel2), requestValueLevel2").getResultList();
			});
		});
		
		get("/list/CLRequestChange", req -> {
			return require(UnitOfWork.class).apply(em -> {
				return em.createQuery("from " + CLChange.class.getName() + " order by id").getResultList();
			});
		});

		post("/add/CLRequestActive", req -> {
			HashMap<String, Object> items = req.body().to(HashMap.class);
			CLActive newActive = new CLActive();

			if(items.get("requestTag") != null) { newActive.setRequestTag(items.get("requestTag").toString()); }
			if(items.get("requestValue") != null) { newActive.setRequestValue(items.get("requestValue").toString()); }
			if(items.get("requestTagLevel2") != null) { newActive.setRequestTagLevel2(items.get("requestTagLevel2").toString()); }
			if(items.get("requestValueLevel2") != null) { newActive.setRequestValueLevel2(items.get("requestValueLevel2").toString()); }
			newActive.setEdited(0);

			try {
				return require(UnitOfWork.class).apply(em -> {
					em.save(newActive);
					return dbAddSuccess;
				});
			}
			catch (Exception e) {
				return dbFailure;
			}
		});

		post("/add/CLRequestChange", req -> {
			HashMap<String, Object> items = req.body().to(HashMap.class);
			CLChange newChange = new CLChange();

			if(items.get("id") != null) { newChange.setID(Integer.parseInt(items.get("id").toString())); }
			if(items.get("dateLog") != null) { newChange.setDateLog(items.get("dateLog").toString()); }
			if(items.get("action") != null) { newChange.setAction(items.get("action").toString()); }
			if(items.get("requestTag") != null) { newChange.setRequestTag(items.get("requestTag").toString()); }
			if(items.get("requestValue") != null) { newChange.setRequestValue(items.get("requestValue").toString()); }
			if(items.get("requestTagLevel2") != null) { newChange.setRequestTagLevel2(items.get("requestTagLevel2").toString()); }
			if(items.get("requestValueLevel2") != null) { newChange.setRequestValueLevel2(items.get("requestValueLevel2").toString()); }
			if(items.get("edited") != null) { newChange.setEdited(Integer.parseInt(items.get("edited").toString())); }

			try {
				return require(UnitOfWork.class).apply(em -> {
					em.save(newChange);
					return dbAddSuccess;
				});
			}
			catch (Exception e) {
				return dbFailure;
			}
		});

		post("/edit/CLRequestActive", req -> {
			CLActive existingCLActive = req.body().to(CLActive.class);
			try {
				return require(UnitOfWork.class).apply(em -> {
					em.update(existingCLActive);
					return dbEditSuccess;
				});
			}
			catch (Exception e) {
				return dbFailure;
			}
		});

		post("/edit/CLRequestChange", req -> {
			CLChange existingCLChange = req.body().to(CLChange.class);
			existingCLChange.setEdited(1);

			try {
				return require(UnitOfWork.class).apply(em -> {
					em.update(existingCLChange);
					return dbEditSuccess;
				});
			}
			catch (Exception e) {
				return dbFailure;
			}
		});

		post("/delete/CLRequestActive/requestTag", req -> {
			HashMap<String, Object> items = req.body().to(HashMap.class);
			CLActive clActive = new CLActive();
			if(items.get("requestTag") != null) { clActive.setRequestTag(items.get("requestTag").toString()); }
			if(items.get("requestValue") != null) { clActive.setRequestValue(items.get("requestValue").toString()); }
			if(items.get("requestTagLevel2") != null) { clActive.setRequestTagLevel2(items.get("requestTagLevel2").toString()); }
			if(items.get("requestValueLevel2") != null) { clActive.setRequestValueLevel2(items.get("requestValueLevel2").toString()); }

			try {
				return require(UnitOfWork.class).apply(em -> {
					String request_tag = items.get("requestTag").toString();
					em.createQuery("delete from " + CLActive.class.getName() + " where requestTag = :requestTag").setParameter("requestTag", request_tag).executeUpdate();
					return dbDeleteSuccess;
				});
			}
			catch (Exception e) {
				return dbFailure;
			}
		});

		post("/delete/CLRequestActive/requestValue", req -> {
			HashMap<String, Object> items = req.body().to(HashMap.class);
			CLActive clActive = new CLActive();
			if(items.get("requestTag") != null) { clActive.setRequestTag(items.get("requestTag").toString()); }
			if(items.get("requestValue") != null) { clActive.setRequestValue(items.get("requestValue").toString()); }
			if(items.get("requestTagLevel2") != null) { clActive.setRequestTagLevel2(items.get("requestTagLevel2").toString()); }
			if(items.get("requestValueLevel2") != null) { clActive.setRequestValueLevel2(items.get("requestValueLevel2").toString()); }

			try {
				return require(UnitOfWork.class).apply(em -> {
					String request_tag = items.get("requestTag").toString();
					String request_value = items.get("requestValue").toString();
					em.createQuery("delete from " + CLActive.class.getName() + " where requestTag = :requestTag and requestValue = :requestValue").setParameter("requestTag", request_tag).setParameter("requestValue", request_value).executeUpdate();
					return dbDeleteSuccess;
				});
			}
			catch (Exception e) {
				return dbFailure;
			}
		});

		post("/delete/CLRequestActive/requestTagLevel2", req -> {
			HashMap<String, Object> items = req.body().to(HashMap.class);
			CLActive clActive = new CLActive();
			if(items.get("requestTag") != null) { clActive.setRequestTag(items.get("requestTag").toString()); }
			if(items.get("requestValue") != null) { clActive.setRequestValue(items.get("requestValue").toString()); }
			if(items.get("requestTagLevel2") != null) { clActive.setRequestTagLevel2(items.get("requestTagLevel2").toString()); }
			if(items.get("requestValueLevel2") != null) { clActive.setRequestValueLevel2(items.get("requestValueLevel2").toString()); }

			try {
				return require(UnitOfWork.class).apply(em -> {
					String request_tag = items.get("requestTag").toString();
					String request_value = items.get("requestValue").toString();
					String request_tag_level2 = items.get("requestTagLevel2").toString();
					em.createQuery("delete from " + CLActive.class.getName() + " where requestTag = " + request_tag + " and requestValue = " + request_value + " and requestTagLevel2 = " + request_tag_level2).executeUpdate();
					return dbDeleteSuccess;
				});
			}
			catch (Exception e) {
				return dbFailure;
			}
		});

		post("/delete/CLRequestActive/requestValueLevel2", req -> {
			HashMap<String, Object> items = req.body().to(HashMap.class);
			CLActive clActive = new CLActive();
			if(items.get("requestTag") != null) { clActive.setRequestTag(items.get("requestTag").toString()); }
			if(items.get("requestValue") != null) { clActive.setRequestValue(items.get("requestValue").toString()); }
			if(items.get("requestTagLevel2") != null) { clActive.setRequestTagLevel2(items.get("requestTagLevel2").toString()); }
			if(items.get("requestValueLevel2") != null) { clActive.setRequestValueLevel2(items.get("requestValueLevel2").toString()); }

			try {
				return require(UnitOfWork.class).apply(em -> {
					String request_tag = items.get("requestTag").toString();
					String request_value = items.get("requestValue").toString();
					String request_tag_level2 = items.get("requestTagLevel2").toString();
					String request_value_level2 = items.get("requestValueLevel2").toString();
					em.createQuery("delete from " + CLActive.class.getName() + " where requestTag = " + request_tag + " and requestValue = " + request_value + " and requestTagLevel2 = " + request_tag_level2 + " and requestValueLevel2 = " + request_value_level2).executeUpdate();
					return dbDeleteSuccess;
				});
			}
			catch (Exception e) {
				return dbFailure;
			}
		});

		get("/generate40xls", (req, rsp) -> {

			XSSFWorkbook workbook = new XSSFWorkbook();
			CreationHelper createHelper = workbook.getCreationHelper();
			require(UnitOfWork.class).apply(em -> {
				XSSFSheet activeSheet = workbook.createSheet();
				workbook.setSheetName(workbook.getSheetIndex(activeSheet), "Active");
				activeSheet.createFreezePane(0,1);
				writeActiveHeader(workbook, activeSheet);
				int rowNum = 1;
				List<CLActive> activeList = em.createQuery("from " + CLActive.class.getName() + " order by LOWER(requestTag), requestTag, LOWER(requestValue), requestValue, LOWER(requestTagLevel2), requestTagLevel2, LOWER(requestValueLevel2), requestValueLevel2").getResultList();
				for(CLActive active: activeList)
				{
					rowNum = writeActiveRow(rowNum, workbook, activeSheet, active);
				}
				rowNum = writeFooter(rowNum, activeSheet, 1);

				XSSFSheet changeSheet = workbook.createSheet();
				workbook.setSheetName(workbook.getSheetIndex(changeSheet), "Change");
				changeSheet.createFreezePane(0,1);
				writeChangeHeader(workbook, changeSheet);
				rowNum = 1;
				List<CLChange> changeList = em.createQuery("from " + CLChange.class.getName() + " order by ID").getResultList();
				for(CLChange change: changeList)
				{
					rowNum = writeChangeRow(rowNum, workbook, changeSheet, change);
				}
				rowNum = writeFooter(rowNum, changeSheet, 2);
				return 200;
			});

			File file = new File("CL_Request_Non-Static_Values_CLS.xls");
			FileOutputStream fileOut = new FileOutputStream(file);
			workbook.write(fileOut);
			fileOut.close();
			workbook.close();
			rsp.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").header("Content-Disposition", "attachment; filename=CL_Request_Non-Static_Values_CLS.xls").status(200)
			.download(file);
		});
	}
	private void writeActiveHeader(XSSFWorkbook workbook, XSSFSheet sheet) {
		Row row = sheet.createRow(0);
		ArrayList<String> header = new ArrayList<String>();
		header.add("Request tag");
		header.add("Request Value");
		header.add("Request tag (level 2)");
		header.add("Request Value (level 2)");
		sheet.setColumnWidth(0,12100);
		sheet.setColumnWidth(1,18600);
		sheet.setColumnWidth(2,9000);
		sheet.setColumnWidth(3,13300);
		int colNum = 0;
		CellStyle style = workbook.createCellStyle();
		Font font = workbook.createFont();
		font.setBold(true);
		font.setFontHeightInPoints((short) 10);
		style.setFont(font);
		for(String data: header)
		{
			Cell cell = row.createCell(colNum++);
			cell.setCellStyle(style);
			cell.setCellValue(data);
		}
	}

	private void writeChangeHeader(XSSFWorkbook workbook, XSSFSheet sheet) {
		Row row = sheet.createRow(0);
		ArrayList<String> header = new ArrayList<String>();
		header.add("Date");
		header.add("Action");
		header.add("Request v4.1 tag");
		header.add("Request v4.1 Value");
		header.add("Request v4.1 tag (level 2)");
		header.add("Request v4.1 Value (level 2)");
		sheet.setColumnWidth(0,2300);
		sheet.setColumnWidth(1,2300);
		sheet.setColumnWidth(2,10500);
		sheet.setColumnWidth(3,24000);
		sheet.setColumnWidth(4,9000);
		sheet.setColumnWidth(5,13300);
		int colNum = 0;
		CellStyle style = workbook.createCellStyle();
		Font font = workbook.createFont();
		font.setBold(true);
		font.setFontHeightInPoints((short) 10);
		style.setFont(font);
		for(String data: header)
		{
			Cell cell = row.createCell(colNum++);
			cell.setCellStyle(style);
			cell.setCellValue(data);
		}
	}

	private int writeActiveRow(int rowNumber, XSSFWorkbook workbook, XSSFSheet sheet, CLActive clActive) 
	{
		int rowNum = rowNumber;
		Row row = sheet.createRow(rowNum++);
		ArrayList<String> activeData = new ArrayList<String>();
		if(clActive.getRequestTag() != null) { activeData.add(clActive.getRequestTag()); }
		else { activeData.add(""); }
		if(clActive.getRequestValue() != null) { activeData.add(clActive.getRequestValue()); }
		else { activeData.add(""); }
		if(clActive.getRequestTagLevel2() != null) { activeData.add(clActive.getRequestTagLevel2()); }
		if(clActive.getRequestValueLevel2() != null) { 
			if(activeData.size() != 3) {
				activeData.add("");
			}
			activeData.add(clActive.getRequestValueLevel2()); 
		}
		int colNum = 0;
		XSSFFont font = workbook.createFont();
		font.setFontHeightInPoints((short) 10);
  
		for(String data: activeData)
		{
			CellStyle style = workbook.createCellStyle();
			style.setVerticalAlignment(VerticalAlignment.TOP);
			style.setFont(font);
			if(clActive.getEdited() == 1)
			{
				style.setFillForegroundColor(IndexedColors.YELLOW.getIndex());
				style.setFillPattern(CellStyle.SOLID_FOREGROUND); 
			}
			Cell cell = row.createCell(colNum);
			style.setWrapText(true);
			cell.setCellStyle(style);
			cell.setCellValue(data);
			colNum++;
		}
		return rowNum;
	}

	private int writeChangeRow(int rowNumber, XSSFWorkbook workbook, XSSFSheet sheet, CLChange clChange)
	{
		int rowNum = rowNumber;
		Row row = sheet.createRow(rowNum++);
		ArrayList<String> changeData = new ArrayList<String>();
		if(clChange.getDateLog() != null) { changeData.add(clChange.getDateLog().toString()); }
		else { changeData.add(""); }
		if(clChange.getAction() != null) { changeData.add(clChange.getAction()); }
		else { changeData.add(""); }
		if(clChange.getRequestTag() != null) { changeData.add(clChange.getRequestTag()); }
		else { changeData.add(""); }
		if(clChange.getRequestValue() != null) { changeData.add(clChange.getRequestValue()); }
		else { changeData.add(""); }
		if(clChange.getRequestTagLevel2() != null) { changeData.add(clChange.getRequestTagLevel2()); }
		if(clChange.getRequestValueLevel2() != null) { 
			if(changeData.size() != 5) {
				changeData.add("");
			}
			changeData.add(clChange.getRequestValueLevel2()); 
		}
		int colNum = 0;
		XSSFFont font = workbook.createFont();
		font.setFontHeightInPoints((short) 10);
		boolean first = true;

		for(String data: changeData)
		{
			CellStyle style = workbook.createCellStyle();
			style.setVerticalAlignment(VerticalAlignment.TOP);
			if(first) {
				style.setAlignment(HorizontalAlignment.RIGHT);
				first = false;
			}

			style.setFont(font);
			if(clChange.getEdited() == 1)
			{
				style.setFillForegroundColor(IndexedColors.YELLOW.getIndex());
				style.setFillPattern(CellStyle.SOLID_FOREGROUND); 
			}
			Cell cell = row.createCell(colNum);
			style.setWrapText(true);
			cell.setCellStyle(style);
			cell.setCellValue(data);
			colNum++;
		}
		return rowNum;
	}

	private int writeFooter(int rowNumber, XSSFSheet sheet, int mode) {
		int rowNum = rowNumber;
		Row row = sheet.createRow(rowNum++);
		ArrayList<String> footerData = new ArrayList<String>();
		footerData.add("");
		footerData.add("");
		footerData.add("");
		footerData.add("");
		if(mode == 2)
		{
			footerData.add("");
			footerData.add("");
		}

		int colNum = 0;
		for(String data: footerData)
		{
			Cell cell = row.createCell(colNum++);
			cell.setCellValue(data);
		}
		return rowNum;
	}
}