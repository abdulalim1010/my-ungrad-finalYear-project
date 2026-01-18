import AdminAcademicUpload from "../../components/AdminAcademicUpload";

export default function SyllabusUploadPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Upload Syllabus</h1>
      <AdminAcademicUpload type="syllabus" />
    </>
  );
}
