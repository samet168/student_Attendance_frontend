import { useState, useEffect } from "react";
import API_URL from "../../Api/api";
import "../../assets/style/ClassForm.css";
import { Link } from "react-router-dom";

const AddClass = () => {
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [teacherIds, setTeacherIds] = useState([]);

  useEffect(() => {
    API_URL.get("/teachers").then((res) => {
      setTeachers(res.data.data);
    });
  }, []);

  const toggleTeacher = (id) => {
    if (teacherIds.includes(id)) {
      setTeacherIds(teacherIds.filter((t) => t !== id));
    } else {
      setTeacherIds([...teacherIds, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API_URL.post("/classroom9", {
      name,
      room_number: roomNumber,
      teacher_ids: teacherIds,
    });

    alert("Success");
  };

  return (
    <div className="class-form-container">
      <div className="class-form-card">
        <h2>បង្កើតថ្នាក់ថ្មី</h2>

        <form onSubmit={handleSubmit}>
          {/* Class Name */}
          <div className="form-group">
            <label>ឈ្មោះថ្នាក់</label>
            <input
              type="text"
              placeholder="Year 3 - IT"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Room */}
          <div className="form-group">
            <label>បន្ទប់</label>
            <input
              type="text"
              placeholder="A-101"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>

          {/* Teachers */}
          <div className="form-group">
            <label>ជ្រើសគ្រូបង្រៀន</label>

            <div className="teacher-grid">
              {teachers.map((t) => (
                <div
                  key={t.id}
                  className={`teacher-card ${
                    teacherIds.includes(t.id) ? "active" : ""
                  }`}
                  onClick={() => toggleTeacher(t.id)}
                >
                  <div className="avatar">👨‍🏫</div>
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <Link to="/classes" className="btn-cancel">
              ← ត្រឡប់ក្រោយ
            </Link>

            <button type="submit" className="btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClass;