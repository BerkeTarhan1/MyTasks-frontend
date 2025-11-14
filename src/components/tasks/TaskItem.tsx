import React, { useState } from 'react';
import { Task, UpdateTaskData } from '../../types';
import { taskService } from '../../services/api';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
  });
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    try {
      setLoading(true);
      const updatedTask = await taskService.updateTask(task.id, {
        title: task.title,
        description: task.description,
        isCompleted: !task.isCompleted,
      });
      onTaskUpdated(updatedTask);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const updatedTask = await taskService.updateTask(task.id, {
        ...editData,
        isCompleted: task.isCompleted,
      });
      onTaskUpdated(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await taskService.deleteTask(task.id);
        onTaskDeleted(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${
      task.isCompleted ? 'opacity-75' : ''
    }`}>
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Task title"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Task description"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={loading || !editData.title.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={handleToggleComplete}
                disabled={loading}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <h3 className={`text-lg font-medium ${
                  task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`mt-1 text-gray-600 ${
                    task.isCompleted ? 'line-through' : ''
                  }`}>
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Created: {formatDate(task.createdAt)}</span>
            {task.updatedAt !== task.createdAt && (
              <span>Updated: {formatDate(task.updatedAt)}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;