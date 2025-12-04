import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-gray-50">{children}</div>
    </>
  );
};

export default AdminLayout;
