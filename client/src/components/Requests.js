import React, { forwardRef, Component } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import jwt_decode from "jwt-decode";

import Button from "@material-ui/core/Button";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import CancelIcon from "@material-ui/icons/Cancel";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Cancel: forwardRef((props, ref) => <CancelIcon {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export default class Requests extends Component {
  constructor() {
    super();
    this.state = {
      columns: [
        { title: "Title", field: "title" },
        { title: "Author", field: "author" },
        { title: "Publisher", field: "publisher" },
        { title: "Status", field: "status" },
        { title: "Issue Days", field: "allotted_days" },
      ],
      data: [],
    };
  }
  componentDidMount() {
    axios
      .get("book/requests", {
        headers: {
          Authorization: `bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((response) => {
        this.setState({ data: response.data });
      });
  }
  issueRequestUpdate = (rowData) => {
    let token = localStorage.getItem("jwt");

    axios
      .post(
        "/user/request-book-and-update",
        { user_id: jwt_decode(token).sub, book_details: rowData },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        }
        console.log(response.data);
        this.componentDidMount();
      })
      .catch((e) => {
        console.log(e);
        alert(e);
      });
  };

  render() {
    return (
      <div>
        <MaterialTable
          title="Issue Requests"
          columns={this.state.columns}
          data={this.state.data}
          icons={tableIcons}
          actions={[
            {
              icon: () => (
                <Button
                  variant="outlined"
                  color="default"
                  className="button"
                  startIcon={<Check />}
                >
                  Accept
                </Button>
              ),
              tooltip: "Accept book issue request",
              onClick: (event, rowData) => {
                rowData.status = "active";
                this.issueRequestUpdate(rowData);
              },
            },
            {
              icon: () => (
                <Button
                  variant="outlined"
                  color="default"
                  className="button"
                  startIcon={<CancelIcon />}
                >
                  Reject
                </Button>
              ),
              tooltip: "Reject book issue request",
              onClick: (event, rowData) => {
                rowData.status = "rejected";
                this.issueRequestUpdate(rowData);
              },
            },
          ]}
        />
      </div>
    );
  }
}
