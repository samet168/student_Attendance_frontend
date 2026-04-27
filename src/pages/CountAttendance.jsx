import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API = "http://127.0.0.1:8000/api";

const CountStudentAttendance = () => {
  const [searchParams] = useSearchParams();
  const classroomId = searchParams.get("classroom_id");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${API}/attendance/count-student?classroom_id=${classroomId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classroomId) fetchData();
  }, [classroomId]);

  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">
        📊 វត្តមានតាមសិស្ស
      </h2>

      {loading ? (
        <p>កំពុងទាញទិន្នន័យ...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>សិស្ស ID</th>
              <th>សរុប</th>
              <th>វត្តមាន</th>
              <th>អវត្តមាន</th>
              <th>យឺត</th>
              <th>មានច្បាប់</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.student_id} className="text-center border">
                <td>{item.student_id}</td>
                <td>{item.total}</td>
                <td className="text-green-600 font-bold">{item.present}</td>
                <td className="text-red-600">{item.absent}</td>
                <td className="text-yellow-600">{item.late}</td>
                <td className="text-blue-600">{item.permission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default CountStudentAttendance;