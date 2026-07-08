import React, { useState, useRef, useEffect } from "react";
import styles from "./User_Management.module.css";
import { toast } from "react-toastify";

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

//LOADER
import Loader from "../../../../../../../components/common/loader/Loader";

//AUDIO
import toastSuccessSound from "../../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastSuccess.mp3";
import toastWarningSound from "../../../../../../../assets/sounds/ADMIN/IT/Ticketing/toastWarning.mp3";

export default function MainAdminUserManagement({ displayName }) {
  const API = process.env.REACT_APP_API_URL;

  const [isLoading, setIsLoading] = useState(false);

  //AUDIO
  const toastSuccessAudio = new Audio(toastSuccessSound);
  const toastWarningAudio = new Audio(toastWarningSound);

  const [userCounterList, setCounterList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  //modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  //list
  const [departmentList, setDepartmentList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  //search filters
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    department: "",
    status: "",
  });

  //EFFECT

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchUserCounter(), fetchList(), fetchUserList()]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  //API
  //populate lists(department,role,statuses)
  const fetchList = async () => {
    try {
      const [departmentRes, roleRes, statusRes] = await Promise.all([
        fetch(`${API}/ticketing/mockdata/department`),
        fetch(`${API}/ticketing/mockdata/role`),
        fetch(`${API}/ticketing/mockdata/status`),
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

  //populate fetch user counter
  const fetchUserCounter = async () => {
    try {
      const response = await fetch(`${API}/ticketing/admin/usercounter`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      setCounterList(data);
    } catch (err) {
      console.error(err);
    }
  };

  //populate userlist
  const fetchUserList = async () => {
    try {
      const response = await fetch(`${API}/ticketing/admin/userlist`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setUserList(data);
    } catch (err) {
      console.error(err);
      toastWarningAudio.play();
      toast.error(err);
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
  const handleSaveUser = async (newUser) => {
    const user = { ...newUser, created_by: displayName };

    try {
      const result = await fetch(`${API}/ticketing/admin/adduser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await result.json();

      if (!data.success) {
        toastWarningAudio.play();
        return toast.warning(data.message);
      }

      fetchUserList();
      fetchUserCounter();
      toastSuccessAudio.play();
      toast.success(`Username: ${data.user.username} successfully added`);
    } catch (err) {
      console.error(err);
      toastWarningAudio.play();
      toast.error(`Server Error`);
    }

    /*     const user = { id: users.length + 1, ...newUser, lastLogin: "Never" };
    setUsers((prev) => [user, ...prev]); */
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await fetch(`${API}/ticketing/admin/updateuser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (!data.success) {
        toastWarningAudio.play();
        return toast.error(data.message);
      }

      setUserList((prev) =>
        prev.map((user) =>
          user.user_id === updatedUser.user_id ? updatedUser : user,
        ),
      );
      fetchUserCounter();
      fetchUserList();
      toastSuccessAudio.play();
      toast.success(`User id: ${data.user.user_id} successfully updated`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(
        `${API}/ticketing/admin/deleteuser/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!data.success) {
        toastWarningAudio.play();
        return toast.error(data.message);
      }

      fetchUserCounter();
      fetchUserList();
      toastSuccessAudio.play();
      toast.success(`User id: ${data.userid.user_id} successfully deleted`);
    } catch (err) {
      console.error(err);
    }
  };

  //search filter
  const filteredUsers = userList.filter((user) => {
    const search = filters.search.toLowerCase();

    const matchesSearch =
      (user.d_name ?? "").toLowerCase().includes(search) ||
      user.username.toLowerCase().includes(search) ||
      (user.email ?? "").toLowerCase().includes(search);

    const matchesRole = filters.role === "" || user.role === filters.role;

    const matchesDepartment =
      filters.department === "" || user.department === filters.department;

    const matchesStatus =
      filters.status === "" || user.status === filters.status;

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  if (isLoading) {
    return <Loader message="Loading users...." />;
  }

  return (
    <div className={styles.usermanagement_container}>
      <div className={styles.usermanagement_header}>
        <h2>User Management</h2>
        <p>Manage system users, roles and access permissions</p>
      </div>
      {/* STATISTICS */}
      <Statistics userCount={userCounterList} />
      <SearchFilter
        onAdd={() => setShowAddModal(true)}
        department={departmentList}
        role={roleList}
        status={statusList}
        filters={filters}
        setFilters={setFilters}
      />
      <UserTable
        users={filteredUsers}
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
        status={statusList}
        role={roleList}
        department={departmentList}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={showEditModal}
        user={selectedUser}
        role={roleList}
        department={departmentList}
        status={statusList}
        onClose={() => setShowEditModal(false)}
        onSave={handleUpdateUser}
      />

      {/* View User Modal */}
      <ViewUserModal
        open={showViewModal}
        user={selectedUser}
        onClose={() => setShowViewModal(false)}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        open={showDeleteModal}
        user={selectedUser}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}
