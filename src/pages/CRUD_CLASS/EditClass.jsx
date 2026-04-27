import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../../Api/api";
import "../../assets/style/ClassForm.css";

const EditClass = ({ id: propId, onClose, onSuccess }) => {
  const { id: paramId } = useParams();
  const id = propId || paramId;

  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ── Load data ──
  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFetching(false);
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API_URL.get(`/classroom/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(res.data?.data?.name ?? "");
        setRoomNumber(res.data?.data?.room_number ?? "");
      } catch (err) {
        setError("មិនអាចទាញព័ត៌មានថ្នាក់!");
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

  // ── Update ──
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("សូមបញ្ចូលឈ្មោះថ្នាក់!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await API_URL.post(`/classroom/${id}`, {
        name,
        room_number: roomNumber,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status) {
        onSuccess?.("កែប្រែថ្នាក់បានជោគជ័យ! ✅");
        onClose?.();
        navigate("/classes");
      }
    } catch (err) {
      setError(err.response?.data?.message || "មានបញ្ហាកើតឡើង!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="classform-overlay" onClick={onClose}>
      <div className="classform-box" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="classform-header">
          <div>
            <p className="classform-header__title">កែប្រែថ្នាក់</p>
            <p className="classform-header__sub">ID: {id}</p>
          </div>
          <button className="classform-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <form onSubmit={handleUpdate}>
          <div className="classform-body">

            {error && (
              <div className="classform-error">⚠️ {error}</div>
            )}

            {/* Name Field */}
            <div className="classform-field">
              <label>
                ឈ្មោះថ្នាក់ 
                <span className="classform-required">*</span>
              </label>
              {fetching ? (
                <div className="loading-text">កំពុងទាញទិន្នន័យ...</div>
              ) : (
                <input
                  type="text"
                  className="classform-input"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="ឧ. ថ្នាក់ទី ១០ ក"
                  required
                  disabled={loading || fetching}
                />
              )}
            </div>

            {/* Room Number Field */}
            <div className="classform-field">
              <label>លេខបន្ទប់</label>
              {fetching ? (
                <div className="loading-text">កំពុងទាញទិន្នន័យ...</div>
              ) : (
                <input
                  type="text"
                  className="classform-input"
                  value={roomNumber}
                  onChange={(e) => {
                    setRoomNumber(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="ឧ. A-205"
                  disabled={loading || fetching}
                />
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="classform-footer">
            <button
              type="button"
              className="classform-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              បោះបង់
            </button>

            <button
              type="submit"
              className="classform-btn-submit classform-btn-submit--edit"
              disabled={loading || fetching}
            >
              {loading ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុកការផ្លាស់ប្តូរ"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditClass;