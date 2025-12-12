import React, { useEffect, useState } from "react";
import {
  Button,  Table,
  TableBody,  TableCell,
  TableContainer,  TableHead,
  TableRow,  Paper,
  Tooltip,  IconButton,
  Chip,  Box,
  CircularProgress,  useTheme
} from "@mui/material";
import { Delete, AdminPanelSettings, Person, Edit } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.short,
  }),
}));

const RoleChip = styled(Chip)(({ theme, role }) => ({
  backgroundColor: role === 'admin'
    ? theme.palette.success.light + '30'
    : theme.palette.info.light + '30',
  color: role === 'admin'
    ? theme.palette.success.dark
    : theme.palette.info.dark,
  fontWeight: 600,
  borderRadius: 4,
}));
const UserList = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteClick = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete/${userId}`, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
        credentials: "include"
      });
      const data = await response.json();
      console.log(data.message);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  
  return (
    <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh', display: "flex", alignItems: "center", justifyContent: "center" }}>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "lg",
          mt: 2,
          boxShadow: theme.shadows[4],
          overflow: 'hidden'
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ background: "#374151" }}>
            <TableRow >
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress sx={{ my: 4 }} />
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <StyledTableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{user.name || "N/A"}</TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
                  <TableCell>
                    <RoleChip
                      label={user.role}
                      role={user.role}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={user.role === "user" ? "Promote to Admin" : "Demote to User"}>
                        <IconButton
                          sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': {
                              bgcolor: theme.palette.action.hover
                            }
                          }}
                        >
                          {user.role === "user" ? (
                            <AdminPanelSettings color="success" />
                          ) : (
                            <Person color="info" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton
                          sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': {
                              bgcolor: theme.palette.action.hover
                            }
                          }}
                        >
                          <Edit color="warning" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          onClick={() => handleDeleteClick(user._id)}
                          sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': {
                              bgcolor: theme.palette.action.hover
                            }
                          }}
                        >
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Box sx={{ color: 'text.secondary' }}>
                    No users found
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;