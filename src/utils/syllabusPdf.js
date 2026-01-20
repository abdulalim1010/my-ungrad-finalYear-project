import jsPDF from "jspdf";

export function generateSemesterSyllabusPDF({
  program,
  university,
  year,
  semester,
  subjects,
}) {
  const doc = new jsPDF();

  let y = 20;

  // ===== HEADER =====
  doc.setFontSize(18);
  doc.text(program || "Course Syllabus", 20, y);
  y += 10;
doc.setFontSize(18);
  doc.text(university || "university", 20, y);
  y += 10;


  doc.setFontSize(14);
  doc.text(`${year} - ${semester}`, 20, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Total Subjects: ${subjects.length}`, 20, y);
  y += 10;

  // ===== TABLE HEADER =====
  doc.setFontSize(12);
  doc.text("Course Code", 20, y);
  doc.text("Course Title", 55, y);
  doc.text("Credits", 155, y);
  y += 6;

  doc.line(20, y, 190, y);
  y += 6;

  // ===== SUBJECT LIST =====
  doc.setFontSize(10);

  subjects.forEach((s, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.text(s.code || "-", 20, y);
    doc.text(s.title || "-", 55, y, { maxWidth: 90 });
    doc.text(s.credits || "-", 160, y);

    y += 7;
  });

  // ===== FOOTER =====
  doc.setFontSize(9);
  doc.text(
    "Generated from official syllabus data",
    20,
    290
  );

  return doc;
}
