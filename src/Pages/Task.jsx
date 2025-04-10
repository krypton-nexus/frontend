import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, X, Plus, Check, Trash2, Edit } from "lucide-react";
import AdminSidebar from "../Components/AdminSidebar";
import "../CSS/Task.css";

// Main component
const Task = () => {
  // Types
  // Priority = "Low" | "Medium" | "High" | "Very High";
  // Status = "To Do" | "In Progress" | "Complete" | "Done";

  // States
  const [personalTasks, setPersonalTasks] = useState([]);
  const [clubTasks, setClubTasks] = useState([]);
  const [newPersonalTask, setNewPersonalTask] = useState("");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("status");

  // Club members list
  const clubMembers = [
    "John Smith",
    "Emma Johnson",
    "Michael Brown",
    "Sarah Davis",
    "Robert Wilson",
  ];

  // New task template
  const newTaskTemplate = {
    id: "",
    name: "",
    description: "",
    assignee: "",
    dueDate: new Date(),
    priority: "Medium",
    status: "To Do",
  };

  // Load sample data
  useEffect(() => {
    // Sample personal tasks
    const samplePersonalTasks = [
      {
        id: "pt1",
        name: "Review meeting notes",
        description: "",
        assignee: "Admin",
        dueDate: new Date(),
        priority: "Medium",
        status: "To Do",
        isPersonal: true,
      },
      {
        id: "pt2",
        name: "Prepare presentation",
        description: "",
        assignee: "Admin",
        dueDate: new Date(Date.now() + 86400000), // tomorrow
        priority: "High",
        status: "To Do",
        isPersonal: true,
      },
    ];

    // Sample club tasks
    const sampleClubTasks = [
      {
        id: "ct1",
        name: "Update website content",
        description: "Add recent event photos and update about page",
        assignee: "Sarah Davis",
        dueDate: new Date(Date.now() - 86400000), // yesterday
        priority: "Medium",
        status: "To Do",
      },
      {
        id: "ct2",
        name: "Plan fundraising event",
        description: "Coordinate with venues and prepare budget",
        assignee: "John Smith",
        dueDate: new Date(Date.now() + 172800000), // day after tomorrow
        priority: "High",
        status: "In Progress",
      },
      {
        id: "ct3",
        name: "Send newsletter",
        description: "Draft monthly newsletter and send to members",
        assignee: "Emma Johnson",
        dueDate: new Date(Date.now() + 86400000), // tomorrow
        priority: "Low",
        status: "Complete",
      },
      {
        id: "ct4",
        name: "Order new equipment",
        description: "Research and purchase new audio equipment",
        assignee: "Michael Brown",
        dueDate: new Date(Date.now() + 259200000), // 3 days from now
        priority: "Very High",
        status: "Done",
      },
    ];

    setPersonalTasks(samplePersonalTasks);
    setClubTasks(sampleClubTasks);
  }, []);

  // Get current date formatted
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");

  // Helper to generate a unique ID
  const generateId = () =>
    `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Handler for adding a new personal task
  const handleAddPersonalTask = () => {
    if (newPersonalTask.trim()) {
      const newTask = {
        id: generateId(),
        name: newPersonalTask.trim(),
        description: "",
        assignee: "Admin",
        dueDate: new Date(),
        priority: "Medium",
        status: "To Do",
        isPersonal: true,
      };
      setPersonalTasks([...personalTasks, newTask]);
      setNewPersonalTask("");
      showToast("Personal task added");
    }
  };

  // Handler for completing a personal task
  const handleCompletePersonalTask = (taskId) => {
    setPersonalTasks(
      personalTasks.map((task) =>
        task.id === taskId ? { ...task, status: "Done" } : task
      )
    );
    showToast("Task completed");
  };

  // Handler for deleting a personal task
  const handleDeletePersonalTask = (taskId) => {
    setPersonalTasks(personalTasks.filter((task) => task.id !== taskId));
    showToast("Personal task deleted");
  };

  // Handler for opening the add task modal
  const handleOpenAddTask = () => {
    setCurrentTask({ ...newTaskTemplate, id: generateId() });
    setIsAddTaskOpen(true);
  };

  // Handler for adding or updating a club task
  const handleSaveClubTask = () => {
    if (!currentTask) return;

    if (isEditTaskOpen) {
      // Update existing task
      setClubTasks(
        clubTasks.map((task) =>
          task.id === currentTask.id ? currentTask : task
        )
      );
      showToast("Task updated");
      setIsEditTaskOpen(false);
    } else {
      // Create new task
      setClubTasks([...clubTasks, currentTask]);
      showToast("New task created");
      setIsAddTaskOpen(false);
    }
  };

  // Handler for deleting a club task
  const handleDeleteClubTask = (taskId) => {
    setClubTasks(clubTasks.filter((task) => task.id !== taskId));
    showToast("Task deleted");
  };

  // Handler for editing a club task
  const handleEditClubTask = (task) => {
    setCurrentTask({ ...task });
    setIsEditTaskOpen(true);
  };

  // Simple toast function
  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }, 100);
  };

  // Filter tasks by search query
  const filteredClubTasks = clubTasks.filter((task) =>
    searchQuery
      ? task.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  // Group tasks by status or priority
  const groupedTasks = filteredClubTasks.reduce((acc, task) => {
    const key = filterType === "status" ? task.status : task.priority;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(task);
    return acc;
  }, {});

  // Get groups based on filter type
  const groups =
    filterType === "status"
      ? ["To Do", "In Progress", "Complete", "Done"]
      : ["Low", "Medium", "High", "Very High"];

  // Get overdue tasks
  const overdueTasks = clubTasks.filter(
    (task) =>
      new Date(task.dueDate).setHours(0, 0, 0, 0) <
        new Date().setHours(0, 0, 0, 0) && task.status !== "Done"
  );

  // Get upcoming tasks (next 3 days)
  const upcomingTasks = clubTasks.filter((task) => {
    const taskDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    const threeDaysLater = new Date();
    threeDaysLater.setDate(new Date().getDate() + 3);
    const threeDaysLaterMidnight = threeDaysLater.setHours(0, 0, 0, 0);

    return (
      taskDate >= today &&
      taskDate <= threeDaysLaterMidnight &&
      task.status !== "Done"
    );
  });

  // Helper function to get class names with conditions
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <div className="task-app">
      <AdminSidebar />
      <div className="container">
        <div className="panels">
          {/* Left Panel (25% Width) */}
          <div className="left-panel">
            {/* My To-Do List */}
            <div className="panel-box">
              <h2 className="panel-title">My To-Do List</h2>
              <div className="add-task-form">
                <input
                  type="text"
                  placeholder="Add a task..."
                  value={newPersonalTask}
                  onChange={(e) => setNewPersonalTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddPersonalTask();
                  }}
                />
                <button onClick={handleAddPersonalTask} className="icon-button">
                  <Plus size={16} />
                </button>
              </div>

              <ul className="task-list">
                {personalTasks.map((task) => (
                  <li
                    key={task.id}
                    className={classNames(
                      "task-item",
                      task.status === "Done" ? "task-done" : ""
                    )}
                  >
                    <span
                      className={classNames(
                        task.status === "Done" ? "task-done-text" : ""
                      )}
                    >
                      {task.name}
                    </span>
                    <div className="task-actions">
                      {task.status !== "Done" && (
                        <button
                          className="task-button outline"
                          onClick={() => handleCompletePersonalTask(task.id)}
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        className="task-button outline"
                        onClick={() => handleDeletePersonalTask(task.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Task Summary */}
            <div className="panel-box">
              <h2 className="panel-title">Task Summary</h2>
              <div className="summary-section">
                <div>
                  <h3 className="summary-title overdue">
                    Overdue Tasks ({overdueTasks.length})
                  </h3>
                  <ul className="summary-list">
                    {overdueTasks.map((task) => (
                      <li key={task.id} className="summary-item">
                        {task.name} - {task.assignee}
                      </li>
                    ))}
                    {overdueTasks.length === 0 && (
                      <li className="summary-empty">No overdue tasks</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="summary-title upcoming">
                    Upcoming Tasks ({upcomingTasks.length})
                  </h3>
                  <ul className="summary-list">
                    {upcomingTasks.map((task) => (
                      <li key={task.id} className="summary-item">
                        {task.name} - {format(new Date(task.dueDate), "MMM d")}
                      </li>
                    ))}
                    {upcomingTasks.length === 0 && (
                      <li className="summary-empty">No upcoming tasks</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel (75% Width) */}
          <div className="right-panel">
            {/* Header */}
            <div className="panel-box header">
              <div className="header-content">
                {!searchActive ? (
                  <div className="greeting">
                    <h1 className="greeting-title">Hello Admin,</h1>
                    <p className="greeting-date">Today is {currentDate}</p>
                  </div>
                ) : (
                  <div className="search-container">
                    <div className="search-input-container">
                      <Search className="search-icon" />
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                      {searchQuery && (
                        <X
                          className="search-clear"
                          onClick={() => setSearchQuery("")}
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="header-actions">
                  <button
                    className="task-button outline"
                    onClick={() => {
                      setSearchActive(!searchActive);
                      if (!searchActive) {
                        setSearchQuery("");
                      }
                    }}
                  >
                    <Search size={16} />
                  </button>
                  <button className="task-button" onClick={handleOpenAddTask}>
                    <Plus size={16} /> Add Task
                  </button>
                </div>
              </div>

              <div className="filter-options">
                <span className="filter-label">Group by:</span>
                <div className="button-group">
                  <button
                    className={classNames(
                      "filter-button",
                      filterType === "status" ? "active" : ""
                    )}
                    onClick={() => setFilterType("status")}
                  >
                    Status
                  </button>
                  <button
                    className={classNames(
                      "filter-button",
                      filterType === "priority" ? "active" : ""
                    )}
                    onClick={() => setFilterType("priority")}
                  >
                    Priority
                  </button>
                </div>
              </div>
            </div>

            {/* Task Board */}
            <div className="task-board">
              {groups.map((group) => (
                <div key={group} className="task-column">
                  <h2
                    className={classNames(
                      "column-title",
                      group === "High" || group === "Very High"
                        ? "high-priority"
                        : group === "Medium"
                        ? "medium-priority"
                        : group === "Done" || group === "Complete"
                        ? "done-status"
                        : "default-title"
                    )}
                  >
                    {group} ({groupedTasks[group]?.length || 0})
                  </h2>
                  <div className="column-content">
                    {groupedTasks[group]?.map((task) => (
                      <div
                        key={task.id}
                        className="task-card"
                        style={{
                          borderLeftColor:
                            task.priority === "Low"
                              ? "#60A5FA" // blue
                              : task.priority === "Medium"
                              ? "#F97316" // orange
                              : task.priority === "High"
                              ? "#EF4444" // red
                              : "#991B1B", // dark red for Very High
                        }}
                        onClick={() => handleEditClubTask(task)}
                      >
                        <div className="task-card-header">
                          <h3 className="task-card-title">{task.name}</h3>
                          <button
                            className="task-delete-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClubTask(task.id);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="task-card-description">
                          {task.description || "No description"}
                        </p>
                        <div className="task-card-footer">
                          <span className="task-assignee">{task.assignee}</span>
                          <span
                            className={classNames(
                              "task-due-date",
                              new Date(task.dueDate).setHours(0, 0, 0, 0) <
                                new Date().setHours(0, 0, 0, 0) &&
                                task.status !== "Done"
                                ? "overdue"
                                : ""
                            )}
                          >
                            {format(new Date(task.dueDate), "MMM d")}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!groupedTasks[group] ||
                      groupedTasks[group].length === 0) && (
                      <div className="empty-column">No tasks</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Task</h2>
              <button
                className="modal-close"
                onClick={() => setIsAddTaskOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Task Name</label>
                <input
                  type="text"
                  value={currentTask?.name || ""}
                  onChange={(e) =>
                    setCurrentTask(
                      currentTask
                        ? { ...currentTask, name: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={currentTask?.description || ""}
                  onChange={(e) =>
                    setCurrentTask(
                      currentTask
                        ? { ...currentTask, description: e.target.value }
                        : null
                    )
                  }
                ></textarea>
              </div>
              <div className="form-group">
                <label>Assignee</label>
                <select
                  value={currentTask?.assignee || ""}
                  onChange={(e) =>
                    setCurrentTask(
                      currentTask
                        ? { ...currentTask, assignee: e.target.value }
                        : null
                    )
                  }
                >
                  <option value="" disabled>
                    Select member
                  </option>
                  {clubMembers.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={
                    currentTask?.dueDate
                      ? format(new Date(currentTask.dueDate), "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setCurrentTask(
                      currentTask ? { ...currentTask, dueDate: date } : null
                    );
                  }}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={currentTask?.priority || ""}
                    onChange={(e) =>
                      setCurrentTask(
                        currentTask
                          ? {
                              ...currentTask,
                              priority: e.target.value,
                            }
                          : null
                      )
                    }
                  >
                    <option value="" disabled>
                      Set priority
                    </option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Very High">Very High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={currentTask?.status || ""}
                    onChange={(e) =>
                      setCurrentTask(
                        currentTask
                          ? {
                              ...currentTask,
                              status: e.target.value,
                            }
                          : null
                      )
                    }
                  >
                    <option value="" disabled>
                      Set status
                    </option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-button cancel"
                onClick={() => setIsAddTaskOpen(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button save"
                onClick={handleSaveClubTask}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditTaskOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button
                className="modal-close"
                onClick={() => setIsEditTaskOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Task Name</label>
                <input
                  type="text"
                  value={currentTask?.name || ""}
                  onChange={(e) =>
                    setCurrentTask(
                      currentTask
                        ? { ...currentTask, name: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={currentTask?.description || ""}
                  onChange={(e) =>
                    setCurrentTask(
                      currentTask
                        ? { ...currentTask, description: e.target.value }
                        : null
                    )
                  }
                ></textarea>
              </div>
              <div className="form-group">
                <label>Assignee</label>
                <select
                  value={currentTask?.assignee || ""}
                  onChange={(e) =>
                    setCurrentTask(
                      currentTask
                        ? { ...currentTask, assignee: e.target.value }
                        : null
                    )
                  }
                >
                  <option value="" disabled>
                    Select member
                  </option>
                  {clubMembers.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={
                    currentTask?.dueDate
                      ? format(new Date(currentTask.dueDate), "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setCurrentTask(
                      currentTask ? { ...currentTask, dueDate: date } : null
                    );
                  }}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={currentTask?.priority || ""}
                    onChange={(e) =>
                      setCurrentTask(
                        currentTask
                          ? {
                              ...currentTask,
                              priority: e.target.value,
                            }
                          : null
                      )
                    }
                  >
                    <option value="" disabled>
                      Set priority
                    </option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Very High">Very High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={currentTask?.status || ""}
                    onChange={(e) =>
                      setCurrentTask(
                        currentTask
                          ? {
                              ...currentTask,
                              status: e.target.value,
                            }
                          : null
                      )
                    }
                  >
                    <option value="" disabled>
                      Set status
                    </option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-button cancel"
                onClick={() => setIsEditTaskOpen(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button save"
                onClick={handleSaveClubTask}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
