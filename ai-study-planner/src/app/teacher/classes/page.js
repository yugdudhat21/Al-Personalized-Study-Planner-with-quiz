'use client';

import { useState, useEffect } from 'react';
import TeacherLayout from '@/components/layout/TeacherLayout';
import { Users, Plus, Key, Copy, Check, Trash2, Edit3, GraduationCap, ShieldCheck } from 'lucide-react';
import { useTeacherStore } from '@/store/teacherStore';
import { useAuthStore } from '@/store/authStore';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function TeacherClassesPage() {
  const { user } = useAuthStore();
  const { classes, students, fetchClasses, createClass, updateClass, deleteClass, fetchStudentsByClass, createStudentInClass } = useTeacherStore();

  const [selectedClassId, setSelectedClassId] = useState('');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Form State
  const [className, setClassName] = useState('');
  const [classSubject, setClassSubject] = useState('');
  const [editingClassObj, setEditingClassObj] = useState(null);
  const [studentName, setStudentName] = useState('');

  // Generated Credentials Banner State
  const [lastCreatedCredentials, setLastCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchClasses(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes]);

  useEffect(() => {
    if (selectedClassId) {
      fetchStudentsByClass(selectedClassId);
    }
  }, [selectedClassId]);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const newClass = await createClass({
        name: className,
        subject: classSubject,
        teacherId: user?.id,
      });
      toast.success(`Class "${newClass.name}" created!`);
      setClassName('');
      setClassSubject('');
      setIsClassModalOpen(false);
      setSelectedClassId(newClass.id);
    } catch (err) {
      toast.error(err.message || 'Failed to create class');
    }
  };

  const handleOpenEditModal = (cls) => {
    setEditingClassObj(cls);
    setClassName(cls.name);
    setClassSubject(cls.subject);
    setIsEditModalOpen(true);
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    if (!editingClassObj) return;

    try {
      await updateClass({
        id: editingClassObj.id,
        name: className,
        subject: classSubject,
      });
      toast.success(`Class updated successfully!`);
      setIsEditModalOpen(false);
      setEditingClassObj(null);
      setClassName('');
      setClassSubject('');
    } catch (err) {
      toast.error(err.message || 'Failed to update class');
    }
  };

  const handleDeleteClass = async (classId, name) => {
    if (confirm(`Are you sure you want to delete class "${name}"?`)) {
      try {
        await deleteClass(classId);
        toast.success(`Class "${name}" deleted`);
        if (selectedClassId === classId) {
          const remaining = classes.filter((c) => c.id !== classId);
          setSelectedClassId(remaining.length > 0 ? remaining[0].id : '');
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete class');
      }
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!selectedClassId) {
      toast.error('Please select or create a class first');
      return;
    }

    try {
      const res = await createStudentInClass({
        class_id: selectedClassId,
        full_name: studentName,
      });
      toast.success(`Student Account Created for ${studentName}!`);
      setLastCreatedCredentials(res.credentials);
      setStudentName('');
      setIsStudentModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to add student');
    }
  };

  const handleCopyCredentials = () => {
    if (!lastCreatedCredentials) return;
    const text = `Student ID: ${lastCreatedCredentials.student_id}\nPassword: ${lastCreatedCredentials.password}\nFull Name: ${lastCreatedCredentials.full_name}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Credentials copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedClassObj = classes.find((c) => c.id === selectedClassId);

  return (
    <TeacherLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <Users className="w-7 h-7 text-purple-500" /> Class Roster & Student Accounts
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Create and edit classes, auto-generate Student IDs & Passwords, and manage student rosters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setClassName('');
                setClassSubject('');
                setIsClassModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg glow-accent flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Create Class
            </button>
          </div>
        </div>

        {/* Credentials Banner when recently generated */}
        {lastCreatedCredentials && (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-slate-900 dark:text-emerald-100 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-emerald-900 dark:text-emerald-200">
                  New Student Credentials Generated for {lastCreatedCredentials.full_name}
                </h4>
                <p className="text-xs font-mono mt-0.5 text-emerald-800 dark:text-emerald-300">
                  Student ID: <strong>{lastCreatedCredentials.student_id}</strong> • Password: <strong>{lastCreatedCredentials.password}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyCredentials}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Credentials'}
            </button>
          </div>
        )}

        {/* Main Class Roster UI */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left 1 Col: Class Selection List */}
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Classes ({classes.length})</h3>
            <div className="space-y-2">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className={`w-full p-4 rounded-2xl border transition flex items-center justify-between ${
                    selectedClassId === cls.id
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md glow-accent font-bold'
                      : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <button
                    onClick={() => setSelectedClassId(cls.id)}
                    className="flex-1 text-left"
                  >
                    <h4 className="font-extrabold text-sm">{cls.name}</h4>
                    <p className={`text-xs mt-0.5 ${selectedClassId === cls.id ? 'text-purple-200' : 'text-slate-500 dark:text-slate-400'}`}>
                      {cls.subject} • Code: {cls.class_code}
                    </p>
                  </button>

                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleOpenEditModal(cls)}
                      className={`p-1.5 rounded-lg transition ${selectedClassId === cls.id ? 'hover:bg-purple-500 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400'}`}
                      title="Edit Class"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                      className={`p-1.5 rounded-lg transition ${selectedClassId === cls.id ? 'hover:bg-purple-500 text-red-200' : 'hover:bg-red-500/20 text-red-400'}`}
                      title="Delete Class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 3 Cols: Enrolled Students Roster */}
          <div className="lg:col-span-3 space-y-4">
            {selectedClassObj ? (
              <div className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 font-mono font-bold text-xs">
                        {selectedClassObj.class_code}
                      </span>
                      <button
                        onClick={() => handleOpenEditModal(selectedClassObj)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-purple-500/10 hover:text-purple-500 transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Class Details
                      </button>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{selectedClassObj.name} Roster</h2>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Subject: {selectedClassObj.subject}</p>
                  </div>

                  <button
                    onClick={() => setIsStudentModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-500 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Student to Class
                  </button>
                </div>

                {/* Roster Table */}
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Students Enrolled in this Class</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
                      Click &quot;Add Student to Class&quot; to auto-generate Student IDs and passwords.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400">
                          <th className="py-3 px-4">Student Name</th>
                          <th className="py-3 px-4">Student ID (Login)</th>
                          <th className="py-3 px-4">Assigned Password</th>
                          <th className="py-3 px-4">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-semibold">
                        {students.map((stu) => (
                          <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{stu.full_name}</td>
                            <td className="py-3.5 px-4 font-mono font-extrabold text-purple-600 dark:text-purple-400">{stu.student_id}</td>
                            <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">{stu.password}</td>
                            <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                              {new Date(stu.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-12">Select or create a class to manage roster.</p>
            )}
          </div>
        </div>

        {/* Create Class Modal */}
        <Modal
          isOpen={isClassModalOpen}
          onClose={() => setIsClassModalOpen(false)}
          title="Create New Class"
        >
          <form onSubmit={handleCreateClass} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Class Name
              </label>
              <input
                type="text"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. AIML5A"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject
              </label>
              <input
                type="text"
                required
                value={classSubject}
                onChange={(e) => setClassSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsClassModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm shadow-md hover:bg-purple-500 transition"
              >
                Create Class
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Class Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Class Details"
        >
          <form onSubmit={handleUpdateClass} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Class Name
              </label>
              <input
                type="text"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. AIML5A"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject
              </label>
              <input
                type="text"
                required
                value={classSubject}
                onChange={(e) => setClassSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm shadow-md hover:bg-purple-500 transition"
              >
                Save & Update Class
              </button>
            </div>
          </form>
        </Modal>

        {/* Add Student Modal */}
        <Modal
          isOpen={isStudentModalOpen}
          onClose={() => setIsStudentModalOpen(false)}
          title="Add Student & Generate Login ID"
        >
          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Student Full Name
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Alice Johnson"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 flex items-center gap-2">
              <Key className="w-4 h-4 shrink-0" />
              <span>Unique Student ID (STU-XXXX) & Password will be automatically generated.</span>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm shadow-md hover:bg-purple-500 transition"
              >
                Generate Student ID & Password
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </TeacherLayout>
  );
}
