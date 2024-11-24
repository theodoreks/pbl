import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import axios from 'axios';

export default function ProdukTable() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newDepartment, setNewDepartment] = useState({
    Name: '',
    Code: '',
    Head: '',
  });
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  const [show, setShow] = useState(false);

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [head, setHead] = useState('')

  const [ editID, setEditId] = useState('');
  const [editName, setEditName] = useState('')
  const [editCode, setEditCode] = useState('')
  const [editHead, setEditHead] = useState('')

  const [data, setData] = useState([]);

  const clear = () => {
    setNewDepartment({ Name: '', Code: '', Head: '' });
  };

  useEffect(() => {
    getData();
}, []);

const getData = () => {
    axios.get('https://localhost:7130/api/Department')
        .then((result) => {
            setData(result.data); // Menggunakan API untuk mengisi rows
        })
        .catch((error) => {
            console.error(error);
        });
};

const handleSave = () => {
  const url = 'https://localhost:7130/api/Department';
  const data = {
    "name": name,
    "code": code,
    "head": head
  };
  axios.post(url, data)
        .then((result) =>{
            getData();
            clear();
        })
};


  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    row.DepartmentName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenEdit = (id) => {
    setSelectedRow(id);
    axios.get(`https://localhost:7130/api/Department/${id}`)
    .then((result)=>{
      setEditName(result.data.name);
      setEditCode(result.data.code);
      setEditHead(result.data.head);
      setEditId(id);
    })
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleOpenDelete = (row) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleAddDepartment = () => {
    const newRow = {
      Name: newDepartment.Name,
      Code: newDepartment.Code,
      Head: newDepartment.Head
    };
    setRows([...rows, newRow]);
    setNewDepartment({ Name: '', Code: '', Head: '' });
    handleClose();
  };

  const handleEditDepartment = () => {
    const updatedRows = rows.map((row) =>
      row.Code === selectedRow.Code
        ? { ...row, DepartmentName: newDepartment.Name, Head: newDepartment.Head }
        : row
    );
    setRows(updatedRows);
    handleCloseEdit();
  };

  const handleDeleteDepartment = (id) => {
    // Display a confirmation dialog
    if (window.confirm("Are you sure you want to delete this department?")) {
        // Update rows locally
        setRows(rows.filter((row) => row.id !== id)); // or row.Code !== id

        // Make delete request
        axios.delete(`https://localhost:7130/api/Department/${id}`)
            .then((result) => {
                if (result.status === 200) {
                    console.log("Department deleted successfully.");
                    getData(); // Refresh data
                }
            })
            .catch((error) => {
                console.error("Error deleting department:", error.response || error.message);
            });

        // Close delete modal or confirmation
        handleCloseDelete();
    } else {
        console.log("Delete action cancelled.");
    }
};



  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDepartment({ ...newDepartment, [name]: value });
  };

  const handleSort = (column) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);

    const sortedRows = [...rows].sort((a, b) => {
      if (direction === 'asc') {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setRows(sortedRows);
  };

  

  return (
    <Container>
      <Grid container spacing={2} className="mb-5" alignItems="center">
        {/* Bagian kiri untuk "Department" dan "This is a list of departments" */}
        <Grid item xs={6} container direction="column" justifyContent="flex-start">
          <Typography variant="h4" gutterBottom>
            Department
          </Typography>
          <Typography variant="subtitle1">
            This is a list of departments
          </Typography>
        </Grid>

        {/* Bagian kanan untuk Search dan Button */}
        <Grid item xs={6} container justifyContent="flex-end" alignItems="center" spacing={1}>
        <TextField
              label="Search"
              variant="outlined"
              value={search}
              onChange={handleSearchChange}
              style={{ width: "200px", backgroundColor: "#FFFFFF", borderRadius: "8px" }}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
                style: { borderRadius: "8px" },
              }}
            />
          <Button
            variant="contained"
            onClick={handleOpen}
            style={{
              backgroundColor: "#3CB371",
              color: "#fff",
              borderRadius: "8px",
              padding: "15px 12px",
              marginLeft: "8px", // Gap between TextField and Button
            }}
          >
            + Add Department
          </Button>
        </Grid>
      </Grid>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                <span onClick={() => handleSort('DepartmentName')}>
                  Department Name   <SortIcon />
                </span>
              </th>
              <th scope="col" className="px-6 py-3">
          <span
            onClick={() => handleSort('Code')} 
            sx={{ color: 'black' }} // Mengatur warna teks tombol menjadi hitam
          >
            Code <SortIcon style={{ color: 'black' }} />
          </span>
        </th>

              <th scope="col" className="px-6 py-3">
                <span onClick={() => handleSort('Head')}>
                  Head of Department<SortIcon />
                </span>
              </th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length> 0 ?
            data.map ((row)=>{
              return(
                <tr key={row} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {row.name}
                </th>
                <td className="px-6 py-4">{row.code}</td>
                <td className="px-6 py-4">{row.head}</td>
                <td className="px-6 py-4">
                  <Button onClick={() => handleOpenEdit(row.id)} 
                    style={{
                      backgroundColor: "#007BFF",
                      color: "#fff",
                      borderRadius: "5px",
                      padding: "8px 20px",
                    }}
                  >
                    Edit
                  </Button>
                  <Button onClick={() => handleDeleteDepartment(row.id)}
                    style={{
                      backgroundColor: "#C82333",
                      color: "#fff",
                      borderRadius: "5px",
                      padding: "8px 15px",
                      marginLeft: "10px", // Jarak antar tombol
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
              )

            })
            :
            'loading'
        }
          </tbody>
        </table>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Department</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Nama Department" name="name" value={name} onChange={(e)=> setName (e.target.value)} fullWidth />
          <TextField margin="dense" label="Kode Department" name="code" value={code} onChange={(e)=> setCode (e.target.value)} fullWidth />
          <TextField margin="dense" label="Head of Department" name="head" value={head} onChange={(e)=> setHead (e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}  style={{ backgroundColor: "#757575", color: "#fff", borderRadius: "5px", padding: "8px 10PX"}}>Cancel</Button>
          <Button onClick={()=> handleSave()}  style={{ backgroundColor: "#3CB371", color: "#fff", borderRadius: "5px", padding: "8px 20px", marginRight:"20px", marginBlock:"5px"}}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Nama Department" name="name" value={newDepartment.Name} onChange={handleInputChange} fullWidth />
          <TextField margin="dense" label="Kode Department" name="code" value={newDepartment.Code} onChange={handleInputChange} fullWidth />
          <TextField margin="dense" label="Head of Department" name="head" value={newDepartment.Head} onChange={handleInputChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}style={{ backgroundColor: "#757575", color: "#fff", borderRadius: "5px", padding: "8px 20px"}}>Cancel</Button>
          <Button onClick={handleOpenEdit} style={{ backgroundColor: "#007BFF", color: "#fff", borderRadius: "5px", padding: "8px 20px", marginRight:"20px", marginBlock:"10px"}}>Edit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this department?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}  style={{ backgroundColor: "#757575", color: "#fff", borderRadius: "5px", padding: "8px 10PX"}}>Cancel</Button>
          <Button onClick={() => handleDeleteDepartment} style={{ backgroundColor: "#C82333", color: "#fff", borderRadius: "5px", padding: "8px 20px", marginRight:"20px", marginBlock:"5px"}}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}