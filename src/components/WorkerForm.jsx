import { useState } from "react";
import { POST } from "../utils/api"; // ✅ use API
import {
  TextField,
  Button,
  Paper,
  Typography,
  MenuItem
} from "@mui/material";

function WorkerForm({ campId }) {
  const [form, setForm] = useState({
  name: "",
  company: "",
  worker_id: "",
  join_date: "",
  end_date: "",
  mess: ""
});

  const [showSub, setShowSub] = useState(false);

  const [subForm, setSubForm] = useState({
    company_id: "",
    company_name: "",
    address: "",
    category: "",
    sub_name: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubChange = (e) => {
    setSubForm({ ...subForm, [e.target.name]: e.target.value });
  };

  // =========================
  // 🟩 ADD WORKER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!campId) {
      alert("Camp ID missing");
      return;
    }

    if (!form.name || !form.worker_id) {
      alert("Name and Worker ID required");
      return;
    }

    setLoading(true);

    try {
      await POST("/workers", {
        ...form,
        camp_id: campId
      });

      alert("Worker added!");

      setForm({
  name: "",
  company: "",
  worker_id: "",
  join_date: "",
  end_date: "",
  mess: ""
});

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🏢 ADD SUB CONTRACTOR
  // =========================
  const handleSubSubmit = async (e) => {
    e.preventDefault();

    try {
      await POST("/subcontractors", subForm);

      alert("Sub Contractor added!");
      setShowSub(false);

      setSubForm({
        company_id: "",
        company_name: "",
        address: "",
        category: "",
        sub_name: ""
      });

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Paper elevation={3} style={{ maxWidth: "700px", margin: "auto", padding: "30px" }}>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Worker
      </Typography>

      {/* 🔵 WORKER FORM */}
      <form onSubmit={handleSubmit}>
        <TextField label="Full Name" name="name" fullWidth margin="normal" value={form.name} onChange={handleChange} />
        <TextField label="Company" name="company" fullWidth margin="normal" value={form.company} onChange={handleChange} />
        <TextField label="Worker ID" name="worker_id" fullWidth margin="normal" value={form.worker_id} onChange={handleChange} />
<TextField
  label="Join Date"
  type="date"
  name="join_date"
  fullWidth
  margin="normal"
  value={form.join_date}
  onChange={handleChange}
  InputLabelProps={{
    shrink: true
  }}
/>

<TextField
  label="End Date"
  type="date"
  name="end_date"
  fullWidth
  margin="normal"
  value={form.end_date}
  onChange={handleChange}
  InputLabelProps={{
    shrink: true
  }}
/>
        <TextField select label="Mess Option" name="mess" fullWidth margin="normal" value={form.mess} onChange={handleChange}>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          style={{ marginTop: "20px" }}
        >
          {loading ? "Saving..." : "Save Worker"}
        </Button>
      </form>

      {/* 🔥 TOGGLE */}
      <Button
        variant="outlined"
        fullWidth
        style={{ marginTop: "20px" }}
        onClick={() => setShowSub(!showSub)}
      >
        {showSub ? "Close Sub Contractor" : "Add Sub Contractor"}
      </Button>

      {/* 🏢 SUB CONTRACTOR */}
      {showSub && (
        <form onSubmit={handleSubSubmit} style={{ marginTop: "20px" }}>

          <Typography variant="h6">Sub Contractor Details</Typography>

          <TextField label="Company ID" name="company_id" fullWidth margin="normal" value={subForm.company_id} onChange={handleSubChange} />
          <TextField label="Company Name" name="company_name" fullWidth margin="normal" value={subForm.company_name} onChange={handleSubChange} />
          <TextField label="Address" name="address" fullWidth margin="normal" value={subForm.address} onChange={handleSubChange} />
          <TextField label="Category" name="category" fullWidth margin="normal" value={subForm.category} onChange={handleSubChange} />
          <TextField label="Sub Contractor Name" name="sub_name" fullWidth margin="normal" value={subForm.sub_name} onChange={handleSubChange} />

          <Button type="submit" variant="contained" color="secondary" fullWidth style={{ marginTop: "15px" }}>
            Save Sub Contractor
          </Button>

        </form>
      )}

    </Paper>
  );
}

export default WorkerForm;