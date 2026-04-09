import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from '../../api'; 

const STATUS_BADGE = {
  pending:  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800">Pending</span>,
  approved: <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800">Approved</span>,
  rejected: <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-200 text-red-800">Rejected</span>,
};

export default function Adoptions() {
  const [requests, setRequests] = useState([]); //  
  const [filter, setFilter]     = useState('All');
  const [search, setSearch]     = useState('');
  const [detail, setDetail]     = useState(null);
  const [loading, setLoading]   = useState(true); 

  //fetch from backend
  useEffect(() => {
    async function fetchAdoptions() {
      try {
        const res = await axios.get('/adoptions');
        setRequests(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load adoption requests');
      } finally {
        setLoading(false);
      }
    }
    fetchAdoptions();
  }, []);

  const filtered = requests.filter(r =>
    (filter === 'All' || r.status === filter.toLowerCase()) &&
    (r.name?.toLowerCase().includes(search.toLowerCase()) ||       
     r.petName?.toLowerCase().includes(search.toLowerCase()))      
  );

  // calls API
  const changeStatus = async (id, status) => {
    try {
      await axios.put(`/adoptions/${id}`, { status });
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      if (detail?._id === id) setDetail(d => ({ ...d, status }));
      toast.success(`Request ${status}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  const count = s => requests.filter(r => r.status === s).length;

  // added loading state
  if (loading) return <div className="text-center py-8">Loading adoptions...</div>;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="🔍  Search by applicant or pet..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3">
        {['All','Pending','Approved','Rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-lg font-medium ${
              filter===f ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {f} ({f==='All' ? requests.length : count(f.toLowerCase())})
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">No requests found 📋</td>
              </tr>
            ) : filtered.map(r => (
              <tr key={r._id} className="hover:bg-gray-50">
                <td className="px-6 py-3">
                  <div className="font-semibold">{r.name}</div>         {/*  r.applicant */}
                  <div className="text-gray-400 text-sm">{r.email}</div>
                </td>
                <td className="px-6 py-3">{r.petName}</td>              {/*  r.pet */}
                <td className="px-6 py-3 text-gray-500">{r.phone || '—'}</td>
                <td className="px-6 py-3 text-gray-500">
                  {/* r.date, now formats from createdAt */}
                  {new Date(r.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                </td>
                <td className="px-6 py-3">{STATUS_BADGE[r.status]}</td>
                <td className="px-6 py-3 flex flex-wrap gap-2">
                  <button onClick={() => setDetail(r)} className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">View</button>
                  {r.status==='pending' && (
                    <>
                      <button onClick={() => changeStatus(r._id,'approved')} className="px-2 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300">✓ Approve</button>
                      <button onClick={() => changeStatus(r._id,'rejected')} className="px-2 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300">✕ Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={e => e.target===e.currentTarget && setDetail(null)}
        >
          <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 relative">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Request Details</h2>
              <button onClick={() => setDetail(null)} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>

            <div className="flex items-center gap-4 p-3 bg-orange-50 rounded">
              <span className="text-3xl">🐾</span>   {/* was detail.pet.split(' ')[0] */}
              <div>
                <div className="font-semibold">{detail.petName}</div>  {/* detail.pet */}
                <div className="text-sm text-gray-400">
                  {new Date(detail.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                </div>
              </div>
              <div className="ml-auto">{STATUS_BADGE[detail.status]}</div>
            </div>

            <div className="space-y-2">
              {[
                ['Applicant', detail.name],        
                ['Email',     detail.email],
                ['Phone',     detail.phone || '—'],
                ['Note',      detail.note  || '—'],
              ].map(([l,v]) => (
                <div key={l} className="flex justify-between border-b border-gray-200 py-2 text-sm">
                  <span className="text-gray-500 font-medium">{l}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </div>

            {detail.status==='pending' && (
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => { changeStatus(detail._id,'rejected'); setDetail(null); }} className="px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300">✕ Reject</button>
                <button onClick={() => { changeStatus(detail._id,'approved'); setDetail(null); }} className="px-3 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300">✓ Approve</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}