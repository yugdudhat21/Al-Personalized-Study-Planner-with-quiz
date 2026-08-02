'use client';

import { useState, useEffect } from 'react';
import TeacherLayout from '@/components/layout/TeacherLayout';
import { BookCheck, Plus, Calendar, FileText, ExternalLink, Upload, CheckCircle2 } from 'lucide-react';
import { useTeacherStore } from '@/store/teacherStore';
import { useAuthStore } from '@/store/authStore';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function TeacherAssignmentsPage() {
  const { user } = useAuthStore();
  const { classes, assignments, fetchClasses, fetchAssignments, createAssignment } = useTeacherStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classId, setClassId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchClasses(user.id);
      fetchAssignments();
    }
  }, [user]);

  useEffect(() => {
    if (classes.length > 0 && !classId) {
      setClassId(classes[0].id);
    }
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 7);
    setDueDate(defaultDue.toISOString().split('T')[0]);
  }, [classes]);

  // Handle PDF / Notes Document File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      // Set data URL or object link as fileUrl
      setFileUrl(evt.target.result);
      toast.success(`PDF/File "${file.name}" attached successfully!`);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classId) {
      toast.error('Please select a class!');
      return;
    }

    try {
      await createAssignment({
        class_id: classId,
        teacher_id: user?.id,
        title,
        description,
        due_date: dueDate,
        file_url: fileUrl,
      });

      toast.success(`Assignment "${title}" posted!`);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setFileUrl('');
      setFileName('');
    } catch (err) {
      toast.error(err.message || 'Failed to create assignment');
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <BookCheck className="w-7 h-7 text-indigo-500" /> Class Homework & Assignments
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Upload PDF notes, homework instructions, resource files, and set due dates for student classes.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg glow-accent flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Create Assignment
          </button>
        </div>

        {assignments.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <BookCheck className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Assignments Posted</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Post homework tasks, deadlines, and learning resources for your students.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md glow-accent hover:bg-indigo-500 transition inline-block"
            >
              Post First Assignment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((asg) => (
              <div key={asg.id} className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-extrabold text-xs">
                      {asg.classes?.name || 'Class Task'}
                    </span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Due: {new Date(asg.due_date).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-1">{asg.title}</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{asg.description}</p>
                </div>

                {asg.file_url && (
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={asg.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open PDF / Resource File
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Assignment Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Post New Class Assignment"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Class
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {classes.length === 0 ? (
                  <option value="" className="bg-slate-900 text-white">No Classes Found (Create Class First)</option>
                ) : (
                  classes.map((cls) => (
                    <option key={cls.id} value={cls.id} className="bg-slate-900 text-white">
                      {cls.name} ({cls.subject})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Assignment Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 5 Homework Problem Set"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description / Instructions
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write homework instructions for students..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Direct File Upload Component */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Upload PDF / Notes File
              </label>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs hover:bg-indigo-500/20 cursor-pointer flex items-center gap-2 transition">
                  <Upload className="w-4 h-4" /> Choose PDF File
                  <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
                {fileName && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {fileName}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Or Enter Resource File URL (Optional)
              </label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://example.com/homework.pdf"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-500 transition"
              >
                Post Assignment
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </TeacherLayout>
  );
}
