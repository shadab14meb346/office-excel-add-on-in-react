import * as React from "react";
import { fetchUsers } from "../http/users";

const PopulateSheetWithUserTable = () => {
  const showLoadingText = () => {
    Excel.run((context) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      const headerRange = sheet.getRange("A1");
      headerRange.values = [["Fetching..."]];

      // sync the context to run the previous API call, and return.
      return context.sync();
    });
  };
  const populateSheet = async () => {
    showLoadingText();
    const data = await fetchUsers();
    writeToSheet(data);
  };
  const writeToSheet = (data: any) => {
    Excel.run((context) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();

      const columnHeaders = Object.keys(data[0]);
      const headerRange = sheet.getRange("A1:U1");
      headerRange.values = [columnHeaders];
      headerRange.format.fill.color = "#4472C4";
      headerRange.format.font.color = "white";

      const usersRows = data
        .map((row) => {
          return {
            ...row,
            roles: row.roles.join(","),
          };
        })
        .map((row) => Object.values(row));
      const dataRange = sheet.getRange("A2:U11");
      dataRange.values = usersRows;

      // sync the context to run the previous API call, and return.
      return context.sync();
    });
  };
  return (
    <>
      <p>Populate the sheet from user table of the db</p>
      <button onClick={populateSheet}>Populate Sheet</button>
    </>
  );
};

export default PopulateSheetWithUserTable;
