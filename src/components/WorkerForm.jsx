import { useState } from "react";
import { POST } from "../utils/api";
import "./WorkerForm.css";
import {
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import logo from "../assets/logo.png";

import "./WorkerForm.css";

function WorkerForm({ campId }) {

  const DEFAULT_COMPANY = "EOG Resources";

  const [form, setForm] = useState({
    name: "",
    company: DEFAULT_COMPANY,
    worker_id: "",
    mobile: "",
    join_date: "",
    end_date: "",
    mess: "No",
    employee_type: "staff",
    device_user_id: "",
  });

  // COMPANY MODAL

  const [openSubModal, setOpenSubModal] = useState(false);

  const [subForm, setSubForm] = useState({
    company_name: "",
    address: "",
    trn: ""
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE FORM
  // =========================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // =========================
  // HANDLE COMPANY FORM
  // =========================

  const handleSubChange = (e) => {

    setSubForm({
      ...subForm,
      [e.target.name]: e.target.value
    });

  };

  // =========================
  // EMPLOYEE TYPE
  // =========================

  const handleTypeChange = (type) => {

    if (type === "staff") {

      setForm({
        ...form,
        employee_type: "staff",
        company: DEFAULT_COMPANY
      });

    }

    else if (type === "visitor") {

      setForm({
        ...form,
        employee_type: "visitor",
        company: ""
      });

    }

    else {

      setForm({
        ...form,
        employee_type: "third_party",
        company: ""
      });

    }
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {

    setForm({
      name: "",
      company: DEFAULT_COMPANY,
      worker_id: "",
      mobile: "",
      join_date: "",
      end_date: "",
      mess: "No",
      employee_type: "staff",
      device_user_id: "",
    });

  };

  // =========================
  // SAVE EMPLOYEE
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    if (!campId) {
      alert("Camp ID missing");
      return;
    }

    if (!form.name || !form.worker_id) {
      alert("Name and Employee ID required");
      return;
    }

    // MOBILE VALIDATION

    if (form.mobile && form.mobile.length < 10) {
      alert("Mobile number must be 10 digits");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    // JOIN DATE VALIDATION

    if (form.join_date && form.join_date > today) {
      alert("Join date cannot be future date");
      return;
    }

    // END DATE VALIDATION

    if (form.end_date && form.end_date <= today) {
      alert("End date must be future date");
      return;
    }

    setLoading(true);

    try {

      await POST("/workers", {
        ...form,
        camp_id: campId
      });

      alert("Employee added successfully!");

      resetForm();

    } catch (err) {

      alert(err.message);

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // SAVE COMPANY
  // =========================

  const handleSubSubmit = async (e) => {

    e.preventDefault();

    try {

      await POST("/subcontractors", subForm);

      alert("Company added!");

      // AUTO FILL COMPANY

      setForm((prev) => ({
        ...prev,
        company: subForm.company_name
      }));

      setOpenSubModal(false);

      setSubForm({
        company_name: "",
        address: "",
        trn: ""
      });

    } catch (err) {

      alert(err.message);

    }
  };

  return (

    <div className="employee-page">

      {/* MAIN CARD */}

      <div className="employee-card">

        {/* LEFT PANEL */}

        <div className="left-panel">

          <img
            src={logo}
            alt="logo"
            className="company-logo"
          />

          <Typography
            variant="h3"
            className="left-title"
          >
            EOG
          </Typography>

          <Typography
            variant="h4"
            className="left-subtitle"
          >
            Camp Management
          </Typography>

          <p className="left-description">
            Employee registration and workforce
            management portal for camp administration.
          </p>

        </div>

        {/* RIGHT PANEL */}

        <div className="right-panel">

          <Typography
            variant="h4"
            className="form-title"
          >
            Add Employee
          </Typography>

          {/* EMPLOYEE TYPE */}

          <div className="employee-type-box">

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.employee_type === "staff"}
                  onChange={() => handleTypeChange("staff")}
                />
              }
              label="Staff"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.employee_type === "visitor"}
                  onChange={() => handleTypeChange("visitor")}
                />
              }
              label="Visitor"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.employee_type === "third_party"}
                  onChange={() => handleTypeChange("third_party")}
                />
              }
              label="Third Party"
            />

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="employee-form"
          >

            {/* FULL NAME */}

            <TextField
              label="Full Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
            />

            {/* COMPANY */}

            <div className="company-row">

              <TextField
                label="Company"
                name="company"
                fullWidth
                value={form.company}
                onChange={handleChange}
                disabled={form.employee_type === "staff"}
              />

              {(form.employee_type === "visitor" ||
                form.employee_type === "third_party") && (

                <IconButton
                  color="primary"
                  onClick={() => setOpenSubModal(true)}
                >
                  <AddIcon />
                </IconButton>

              )}

            </div>

            {/* EMPLOYEE ID */}

            <TextField
              label="Employee ID"
              name="worker_id"
              fullWidth
              value={form.worker_id}
              onChange={handleChange}
            />

            {/* MOBILE */}

            <TextField
              label="Mobile Number"
              name="mobile"
              fullWidth
              value={form.mobile}
              onChange={(e) => {

                const value = e.target.value.replace(/\D/g, "");

                setForm({
                  ...form,
                  mobile: value
                });

              }}
              inputprops={{
                maxLength: 10
              }}
            />

              <TextField
  label="Biometric User ID"
  name="device_user_id"
  fullWidth
  value={form.device_user_id}
  onChange={handleChange}
/>

            {/* JOIN DATE */}

            <TextField
              label="Join Date"
              type="date"
              name="join_date"
              fullWidth
              value={form.join_date}
              onChange={handleChange}
             slotProps={{
    inputLabel: {
      shrink: true
    }
  }}
              inputprops={{
                max: new Date().toISOString().split("T")[0]
              }}
            />

            {/* END DATE */}

            <TextField
              label="End Date"
              type="date"
              name="end_date"
              fullWidth
              value={form.end_date}
              onChange={handleChange}
              slotProps={{
    inputLabel: {
      shrink: true
    }
  }}
              inputprops={{
                min: new Date().toISOString().split("T")[0]
              }}
            />

            {/* MESS */}

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.mess === "Yes"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mess: e.target.checked ? "Yes" : "No"
                    })
                  }
                />
              }
              label="Mess Required"
            />

            {/* BUTTONS */}

            <div className="button-group">

              <Button
                type="button"
                variant="outlined"
                onClick={resetForm}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Employee"}
              </Button>

            </div>

          </form>

        </div>

      </div>

      {/* ========================= */}
      {/* COMPANY MODAL */}
      {/* ========================= */}

      <Dialog
        open={openSubModal}
        onClose={() => setOpenSubModal(false)}
        maxWidth="md"
        fullWidth
      >

        <DialogTitle>
          Add Company
        </DialogTitle>

        <form onSubmit={handleSubSubmit}>

          <DialogContent className="modal-form">

            <TextField
              label="Company Name"
              name="company_name"
              fullWidth
              value={subForm.company_name}
              onChange={handleSubChange}
            />

            <TextField
              label="Address"
              name="address"
              fullWidth
              value={subForm.address}
              onChange={handleSubChange}
            />

            <TextField
              label="Tax Registration Number (TRN)"
              name="trn"
              fullWidth
              value={subForm.trn}
              onChange={handleSubChange}
            />

          </DialogContent>

          <DialogActions>

            <Button
              onClick={() => setOpenSubModal(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
            >
              Save Company
            </Button>

          </DialogActions>

        </form>

      </Dialog>

    </div>
  );
}

export default WorkerForm;