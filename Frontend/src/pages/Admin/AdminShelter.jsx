import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";

export default function AdminShelters() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("Pending");
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchShelters = async () => {
    try {
      const r = await axios.get(`http://localhost:4000/api/admin/shelters?status=${filter}`);
      setShelters(r.data.data);
    } catch {
      toast.error("Failed to load shelters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, [filter]);

  const approve = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/api/admin/shelters/${id}/approve`);
      toast.success("Shelter approved!");
      fetchShelters();
      setSelected(null);
    } catch {
      toast.error("Failed to approve");
    }
  };

  const reject = async (id) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/admin/shelters/${id}/reject`,
        { reason: rejectReason }
      );
      toast.success("Shelter rejected");
      fetchShelters();
      setSelected(null);
      setRejectReason("");
    } catch {
      toast.error("Failed to reject");
    }
  };

  const deleteShelter = async (id) => {
    if (!window.confirm("Delete this shelter?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/admin/shelters/${id}`);
      toast.success("Deleted");
      fetchShelters();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const statusColor = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700"
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        Shelter Management
      </h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["Pending", "Approved", "Rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
              filter === s
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-20" />
          ))}
        </div>
      ) : shelters.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">🏠</div>
          <p className="text-gray-500">
            No {filter.toLowerCase()} shelters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {shelters.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between flex-wrap gap-4"
            >
              <div className="flex items-center gap-4">
                {s.logo ? (
                  <img
                    src={s.logo}
                    className="w-12 h-12 rounded-xl object-cover"
                    alt="logo"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
                    🏠
                  </div>
                )}

                <div>
                  <div className="font-bold text-gray-900">
                    {s.organizationName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {s.email} · {s.district}, {s.province}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Reg: {s.registrationNumber} · Contact: {s.contactPerson}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[s.status]}`}
                >
                  {s.status}
                </span>

                <button
                  onClick={() => setSelected(s)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <Eye size={18} />
                </button>

                {s.status === "Pending" && (
                  <>
                    <button
                      onClick={() => approve(s._id)}
                      className="bg-green-500 text-white text-xs px-4 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <CheckCircle size={13} /> Approve
                    </button>

                    <button
                      onClick={() => setSelected(s)}
                      className="bg-red-500 text-white text-xs px-4 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </>
                )}

                <button
                  onClick={() => deleteShelter(s._id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-extrabold mb-4">
              {selected.organizationName}
            </h2>

            {/* Details */}
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              {[
                ["Registration #", selected.registrationNumber],
                ["Contact Person", selected.contactPerson],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Address", selected.fullAddress],
                ["District", selected.district],
                ["Province", selected.province],
                ["Capacity", selected.capacity],
                ["Animals Supported", selected.animalTypes?.join(", ")],
                ["Website", selected.website],
                ["Description", selected.description],
              ].map(([label, value]) =>
                value ? (
                  <div key={label} className="flex gap-2">
                    <span className="font-semibold min-w-[140px]">{label}:</span>
                    <span>{value}</span>
                  </div>
                ) : null
              )}
            </div>

            {/* Documents */}
            <div className="space-y-2 mb-6">
              {[
                ["Registration Certificate", selected.documents?.registrationCertificate],
                ["Tax Document", selected.documents?.taxDocument],
                ["Owner ID Proof", selected.documents?.ownerIdProof],
              ].map(([label, url]) =>
                url ? (
                  <div key={label} className="flex gap-2 items-center">
                    <span className="font-semibold min-w-[140px]">{label}:</span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:underline text-sm font-semibold"
                    >
                      📄 View Document
                    </a>
                  </div>
                ) : null
              )}
            </div>

            {/* Reject Reason */}
            {selected.status === "Pending" && (
              <div className="mb-4">
                <input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection..."
                  className="w-full border px-4 py-2 rounded-xl"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 bg-gray-100 py-2.5 rounded-xl"
              >
                Close
              </button>

              {selected.status === "Pending" && (
                <>
                  <button
                    onClick={() => approve(selected._id)}
                    className="flex-1 bg-green-500 text-white py-2.5 rounded-xl"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(selected._id)}
                    className="flex-1 bg-red-500 text-white py-2.5 rounded-xl"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}