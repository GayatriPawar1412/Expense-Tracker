function Profile() {
  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <div className="profile-card">
        <div className="profile-avatar">G</div>

        <h3>Gayatri Pawar</h3>
        <p>IT Engineering Student</p>

        <div className="profile-info">
          <div>
            <span>Email</span>
            <strong>gayatri@example.com</strong>
          </div>

          <div>
            <span>Course</span>
            <strong>Information Technology</strong>
          </div>

          <div>
            <span>Year</span>
            <strong>3rd Year</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;