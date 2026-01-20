import AdminAcademicUpload from "../../components/AdminAcademicUpload";


export default function BooksUploadPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Upload Books</h1>
      <AdminAcademicUpload type="book" />
    </>
  );
}
