import AdminAcademicUpload from "../../components/AdminAcademicUpload";

export default function NotesUploadPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Upload Notes</h1>
      <AdminAcademicUpload type="note" />
    </>
  );
}
