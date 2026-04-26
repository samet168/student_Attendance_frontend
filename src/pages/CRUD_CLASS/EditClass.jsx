import { useState, useEffect } from "react";
import API_URL from "../../Api/api";
import "../../assets/style/ClassForm.css";

const EditClass = ({ id, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // load data
  useEffect(() => {
    const fetchData = async () => {
      const res = await API_URL.get(`/admin/classroom/${id}`);
      setName(res.data.data.name);
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API_URL.post(`/admin/classroom/${id}`, { name });

      if (res.data.status) {
        onSuccess?.("កែប្រែជោគជ័យ!");
        onClose?.();
      }
    } catch {
      alert("មានបញ្ហា!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <h2>✏️ កែប្រែថ្នាក់</h2>

        <form onSubmit={handleUpdate}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              បោះបង់
            </button>

            <button disabled={loading}>
              {loading ? "កំពុងរក្សាទុក..." : "💾 កែប្រែ"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditClass;