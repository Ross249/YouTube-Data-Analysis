import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useFetchData from "../hooks/useFetchData";
import Link from "@mui/material/Link";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const RankTable = (props) => {
  const type = props.type;
  const url =
    type === "times"
      ? "http://localhost:4001/api/data/times-rank"
      : "http://localhost:4001/api/data/duration-rank";
  const { data, loading } = useFetchData(url);

  return (
    <>
      {loading && <div>Loading</div>}
      {!loading && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 600 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Rank</StyledTableCell>
                <StyledTableCell>Channel</StyledTableCell>
                <StyledTableCell>
                  {type === "times" ? `Times` : `Duration (hours)`}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((d, i) => (
                <StyledTableRow key={d.name}>
                  <StyledTableCell component="th" scope="row">
                    {i + 1}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Link href={d.channel_url} underline="hover">
                      {d.name}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell>
                    {type === "times" ? d.counts : d.duration}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default RankTable;
