import AdminAcademicUpload from "../../components/AdminAcademicUpload";

export default function RoutineUploadPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Upload Routine</h1>
      <AdminAcademicUpload type="routine" />
    </>
  );
}
