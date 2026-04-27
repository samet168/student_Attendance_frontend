import { useState } from "react";
import API_URL from "../../Api/api";
import "../../assets/style/ClassForm.css";
import { Link, useNavigate } from "react-router-dom";

const AddClass = ({ onClose, onSuccess }) => {
  const [name, setName]           = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("សូមបញ្ចូលឈ្មោះថ្នាក់!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await API_URL.post("/classroom", {
        name,
        room_number: roomNumber,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status) {
        onSuccess?.("បន្ថែមថ្នាក់បានជោគជ័យ! 🎉");
        setName("");
        setRoomNumber("");
        navigate("/classes");
        onClose?.();
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

        {/* ── Header ── */}
        <div className="classform-header">
          <div className="classform-header__left">
            <div className="classform-header__icon classform-header__icon--add">
              🏫
            </div>
            <div>
              <p className="classform-header__title">បន្ថែមថ្នាក់ថ្មី</p>
              <p className="classform-header__sub">បំពេញព័ត៌មានខាងក្រោម</p>
            </div>
          </div>
          <button className="classform-close" onClick={onClose} aria-label="close">
            ✕
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>
          <div className="classform-body">

            {/* Error */}
            {error && (
              <div className="classform-error">⚠️ {error}</div>
            )}

            {/* Class name */}
            <div className="classform-field">
              <label className="classform-label">
                ឈ្មោះថ្នាក់
                <span className="classform-required">*</span>
              </label>
              <input
                className="classform-input"
                type="text"
                placeholder="ឧ. ថ្នាក់ទី ១២A"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                autoFocus
              />
            </div>

            {/* Room number */}
            <div className="classform-field">
              <label className="classform-label">លេខបន្ទប់</label>
              <input
                className="classform-input"
                type="text"
                placeholder="ឧ. A-101"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
            </div>

          </div>

          {/* ── Footer ── */}
          <div className="classform-footer">
            {/* <button
              type="button"
              className="classform-btn-cancel"
              onClick={onClose}
            >
              បោះបង់
            </button> */}
            <Link to={`/classes`} className="classform-btn-cancel">
                      បោះបង់
            </Link>
            <button
              type="submit"
              className="classform-btn-submit classform-btn-submit--add"
              disabled={loading}
            >
              {loading ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុក"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddClass;