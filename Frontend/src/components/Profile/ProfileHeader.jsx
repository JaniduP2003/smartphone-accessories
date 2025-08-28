import profileImg from "../../assets/Profile.png";

const ProfileHeader = ({ name, email, avatar, memberSince }) => {
  return (
    <div className="profile-header">
      <div className="profile-avatar">
        <img src={profileImg} alt="" />
      </div>
      <div className="profile-info">
        <h1>{name}</h1>
        <p>{email}</p>
        <p className="member-since">Member since {memberSince}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
