import { useState } from "react";
import API_URL from "../../Api/api";
import "../../assets/style/ClassForm.css";

const AddClass = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("សូមបញ្ចូលឈ្មោះថ្នាក់");
      return;
    }

    setLoading(true);

    try {
      const res = await API_URL.post("/admin/classroom", { name });

      if (res.data.status) {
        onSuccess?.("បន្ថែមថ្នាក់ជោគជ័យ!");
        setName("");
        onClose?.();
      }
    } catch (err) {
      setError(err.response?.data?.message || "មានបញ្ហាកើតឡើង");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <h2>➕ បន្ថែមថ្នាក់</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ឈ្មោះថ្នាក់"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              បោះបង់
            </button>

            <button disabled={loading}>
              {loading ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុក"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddClass;