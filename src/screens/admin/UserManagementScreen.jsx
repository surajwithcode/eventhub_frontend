import React, { useState, useEffect } from 'react';
import { getAllUsersApi } from '../../api/adminApi';

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsersApi();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users', err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20 }}>
      <h2>User Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
            <th style={{ padding: 10, borderBottom: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: 10, borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: 10, borderBottom: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: 10, borderBottom: '1px solid #ddd' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{u.id}</td>
              <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{u.name}</td>
              <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{u.email}</td>
              <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementScreen;