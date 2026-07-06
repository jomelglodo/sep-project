import React, { useState, useRef, useEffect } from "react";
import styles from "./User_Management.module.css";

//COMPONENTS
import Statistics from "./Statistics";
import SearchFilter from "./SearchFilter";
import UserTable from "./UserTable";
import Pagination from "./Pagination";

// ==> MODALS
import AddUserModal from "../modal_forms/AddUserModal";
import EditUserModal from "../modal_forms/EditUserModal";
import ViewUserModal from "../modal_forms/ViewUserModal";
import DeleteUserModal from "../modal_forms/DeleteUserModal";

export default function MainStaffUserManagement() {
  const [showModal, setShowModal] = useState(false);
  //modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectUser, setSelectedUser] = useState(null);

  //list
  const [departmentList, setDepartmentList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const [users, setUsers] = useState([
    {
      id: 1,
      displayname: "John Doe",
      username: "jdoe",
      email: "john@email.com",
      department: "IT",
      role: "Admin",
      status: "Active",
      lastLogin: "Today 10:30 AM",
    },

    {
      id: 2,
      displayname: "Jane Smith",
      username: "jsmith",
      email: "jane@email.com",
      department: "HR",
      role: "User",
      status: "Active",
      lastLogin: "Yesterday",
    },

    {
      id: 3,
      displayname: "Michael Cruz",
      username: "mcruz",
      email: "michael@email.com",
      department: "Accounting",
      role: "Staff",
      status: "Inactive",
      lastLogin: "2 weeks ago",
    },
  ]);

  //EFFECT
  useEffect(() => {
    fetchList();
  }, []);

  //API

  const fetchList = async () => {
    try {
      const [departmentRes, roleRes, statusRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/ticketing/mockdata/department`),
        fetch(`${process.env.REACT_APP_API_URL}/ticketing/mockdata/role`),
        fetch(`${process.env.REACT_APP_API_URL}/ticketing/mockdata/status`),
      ]);

      const [department, role, status] = await Promise.all([
        departmentRes.json(),
        roleRes.json(),
        statusRes.json(),
      ]);

      setDepartmentList(department);
      setRoleList(role);
      setStatusList(status);
    } catch (err) {
      console.error(err);
    }
  };

  //HELPER FUNCTION
  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  //HANDLER
  const handleSaveUser = (newUser) => {
    const user = { id: users.length + 1, ...newUser, lastLogin: "Never" };
    setUsers((prev) => [user, ...prev]);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    );
  };

  const handleDeleteUser = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
    <div className={styles.usermanagement_container}>
      <div className={styles.usermanagement_header}>
        <h2>User Management</h2>
        <p>Manage system users, roles and access permissions</p>
      </div>
      {/* STATISTICS */}
      <Statistics />
      <SearchFilter
        onAdd={() => setShowAddModal(true)}
        department={departmentList}
        role={roleList}
        status={statusList}
      />
      <UserTable
        users={users}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Pagination />

      {/* Add User Modal */}
      <AddUserModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveUser}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={showEditModal}
        user={selectUser}
        onClose={() => setShowEditModal(false)}
        onSave={handleUpdateUser}
      />

      {/* View User Modal */}
      <ViewUserModal
        open={showViewModal}
        user={selectUser}
        onClose={() => setShowViewModal(false)}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        open={showDeleteModal}
        user={selectUser}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
