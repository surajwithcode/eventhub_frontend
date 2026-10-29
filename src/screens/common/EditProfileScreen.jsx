import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import InputField from '../../components/common/InputField';
import CustomButton from '../../components/common/CustomButton';

const EditProfileScreen = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div style={{ maxWidth: 400, margin: '30px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSave}>
        <InputField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <CustomButton title="Save Changes" style={{ width: '100%' }} />
      </form>
    </div>
  );
};

export default EditProfileScreen;