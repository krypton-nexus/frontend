import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
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
  const [error, setError] = useState(null);
  const [loading, setLoadingMembers] = useState(true);
  const [clubMembers, setClubMembers] = useState("");
  const [personalTasks, setPersonalTasks] = useState([]);
  const [clubTasks, setClubTasks] = useState([]);
  const [newPersonalTask, setNewPersonalTask] = useState("");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("status");
  const [studentEmail, setStudentEmail] = useState("");
  const [clubId, setClubId] = useState("");
  const [token, setToken] = useState(null);

  // Fetch token and club details
  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setStudentEmail(decoded.email);
        setClubId(decoded.club_id);
        setToken(token);
      } catch (err) {
        console.error("Invalid token", err);
        setError("Failed to decode token. Please log in again.");
      }
    } else {
      console.error("No token found");
      setError("User is not authenticated. Please log in.");
    }
  }, []);

  // Function to fetch club members
  const fetchClubMembers = async () => {
    if (!clubId || !token) return;

    setLoadingMembers(true);
    setError(null);

    try {
      const response = await fetch(
        `http://13.247.207.132:5000/membership/list?club_id=${clubId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Transform the data to combine first and last names and keep member_id
      const members = data.memberships.map((member) => ({
        id: member.member_id,
        email: member.email,
        name: `${member.first_name} ${member.last_name}`,
        fullName: member.full_name,
        status: member.status,
      }));

      setClubMembers(members);
    } catch (err) {
      console.error("Error fetching club members:", err);
      setError("Failed to load club members");
    } finally {
      setLoadingMembers(false);
    }
  };

  // Fetch members when clubId or token changes
  useEffect(() => {
    fetchClubMembers();
  }, [clubId, token]);
  // // Club members list
  // const clubMembers = [
  //   "John Smith",
  //   "Emma Johnson",
  //   "Michael Brown",
  //   "Sarah Davis",
  //   "Robert Wilson",
  // ];

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
  const fetchPersonalTasks = async () => {
    try {
      const response = await fetch(
        `http://13.247.207.132:5000/task/admin?admin_email=${studentEmail}&club_id=${clubId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      return data.tasks.map((task) => ({
        id: `pt-${task.task_id}`,
        name: task.task_name,
        description: task.description || "",
        assignee: "Admin",
        dueDate: task.due_date ? new Date(task.due_date) : new Date(),
        priority: task.priority || "Medium",
        status: task.status || "To Do",
        isPersonal: true,
      }));
    } catch (error) {
      console.error("Failed to fetch personal tasks:", error);
      throw error;
    }
  };

  const fetchClubTasks = async () => {
    try {
      const response = await fetch(
        `http://13.247.207.132:5000/task/club/${clubId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      return data.tasks.map((task) => ({
        id: `ct-${task.task_id}`,
        name: task.title,
        description: task.description || "",
        assignee: task.assignee_details?.full_name || "Unassigned",
        assigneeId: task.assignee_details?.membership_id || null,
        dueDate:
          task.due_date && task.due_date !== "None"
            ? new Date(task.due_date)
            : new Date(Date.now() + 86400000 * 3), // Default: 3 days from now
        priority: task.priority || "Medium",
        status: task.status || "To Do",
      }));
    } catch (error) {
      console.error("Failed to fetch club tasks:", error);
      throw error;
    }
  };
  // Call them together like this:
  const loadAllTasks = async () => {
    try {
      const [personalTasks, clubTasks] = await Promise.all([
        fetchPersonalTasks(),
        fetchClubTasks(),
      ]);
      setPersonalTasks(personalTasks);
      setClubTasks(clubTasks);
    } catch (error) {
      setError("Failed to load tasks");
    }
  };
  useEffect(() => {
    // Only fetch if we have the required values
    if (token && studentEmail && clubId) {
      loadAllTasks();
    }
  }, [token, studentEmail, clubId]); // Re-run when these dependencies change

  // Get current date formatted
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");

  // Helper to generate a unique ID
  const generateId = () =>
    `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Handler for adding a new personal task
  const handleAddPersonalTask = async () => {
    if (!newPersonalTask.trim() || !token) return;

    try {
      const response = await fetch("http://13.247.207.132:5000/task/admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_email: studentEmail,
          club_id: clubId,
          task_name: newPersonalTask.trim(), // Note: Corrected from "task_naem" to "task_name"
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTask = await response.json();

      // Add the new task to state
      setPersonalTasks((prev) => [
        ...prev,
        {
          id: `pt-${newTask.task_id}`, // Assuming API returns task_id
          name: newPersonalTask.trim(),
          description: "",
          assignee: "Admin",
          dueDate: new Date(),
          priority: "Medium",
          status: "To Do",
          isPersonal: true,
        },
      ]);

      setNewPersonalTask("");
      showToast("Personal task added successfully");
    } catch (error) {
      console.error("Error adding personal task:", error);
      showToast("Failed to add personal task");
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
    console.log("Opening add task modal");
    setCurrentTask({
      ...newTaskTemplate,
      id: `task-${Date.now()}`,
      dueDate: new Date(),
    });
    setIsAddTaskOpen(true);
  };

  // Handler for adding or updating a club task
  const handleSaveClubTask = async () => {
    if (!currentTask) return;

    try {
      // Common data preparation
      const formattedDueDate = format(currentTask.dueDate, "yyyy-MM-dd");
      const taskData = {
        title: currentTask.name,
        description: currentTask.description,
        assignee_id: currentTask.assigneeId,
        club_id: clubId,
        due_date: formattedDueDate,
        priority: currentTask.priority,
        status: currentTask.status,
      };

      // CREATE NEW TASK
      if (!isEditTaskOpen) {
        const response = await fetch(
          "http://13.247.207.132:5000/task/clubtask",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
          }
        );

        if (!response.ok) throw new Error("Failed to create task");

        const newTask = await response.json();

        setClubTasks((prev) => [
          ...prev,
          {
            id: `ct-${newTask.task_id}`,
            name: newTask.title,
            description: newTask.description,
            assignee:
              clubMembers.find((m) => m.id === newTask.assignee_id)?.name ||
              "Unassigned",
            assigneeId: newTask.assignee_id,
            dueDate: new Date(newTask.due_date),
            priority: newTask.priority,
            status: newTask.status,
          },
        ]);

        showToast("Task created successfully");
        setIsAddTaskOpen(false);
      }
      // UPDATE EXISTING TASK
      else {
        const taskId = currentTask.id.replace("ct-", "");
        const response = await fetch(
          `http://13.247.207.132:5000/task/clubtask/${taskId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
          }
        );
        console.log(response);
        if (!response.ok) throw new Error("Failed to update task");

        const updatedTask = await response.json();

        setClubTasks((prev) =>
          prev.map((task) =>
            task.id === currentTask.id
              ? {
                  ...task,
                  name: updatedTask.title,
                  description: updatedTask.description,
                  assignee:
                    clubMembers.find((m) => m.id === updatedTask.assignee_id)
                      ?.name || task.assignee,
                  assigneeId: updatedTask.assignee_id,
                  dueDate: updatedTask.due_date
                    ? new Date(updatedTask.due_date)
                    : task.dueDate,
                  priority: updatedTask.priority,
                  status: updatedTask.status,
                }
              : task
          )
        );

        showToast("Task updated successfully");
        loadAllTasks();
        setIsEditTaskOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(error.message || "Operation failed");
    }
  };

  // Handler for deleting a club task
  // Handler for deleting a club task
  const handleDeleteClubTask = async (taskId) => {
    try {
      const apiTaskId = taskId.replace("ct-", ""); // Remove the prefix we added
      console.log(apiTaskId);
      const response = await fetch(
        `http://13.247.207.132:5000/task/delete/club/${apiTaskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the tasks after successful deletion
      await loadAllTasks();
      showToast("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast("Failed to delete task");
    }
  };

  // Handler for editing a club task
  const handleEditClubTask = async (task) => {
    try {
      // First, get the latest task details from the server
      const taskId = task.id.replace("ct-", "");
      const response = await fetch(
        `http://13.247.207.132:5000/task/${taskId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: currentTask.name,
            description: currentTask.description,
            assignee_id: currentTask.assigneeId,
            due_date: format(currentTask.dueDate, "yyyy-MM-dd"),
            priority: currentTask.priority,
            status: currentTask.status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTask = await response.json();
      console.log(updatedTask);
      // Update the local state with the updated task
      setClubTasks((prev) =>
        prev.map((task) =>
          task.id === currentTask.id
            ? {
                ...task,
                name: updatedTask.title,
                description: updatedTask.description,
                assignee:
                  clubMembers.find((m) => m.id === updatedTask.assignee_id)
                    ?.name || task.assignee,
                assigneeId: updatedTask.assignee_id,
                dueDate: updatedTask.due_date
                  ? new Date(updatedTask.due_date)
                  : task.dueDate,
                priority: updatedTask.priority,
                status: updatedTask.status,
              }
            : task
        )
      );

      showToast("Task updated successfully");
      setIsEditTaskOpen(false);
    } catch (error) {
      console.error("Error fetching task details:", error);
      showToast("Failed to load task details");
      // Fallback to local data if API fails
      setCurrentTask({ ...task });
      setIsEditTaskOpen(true);
    }
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
    <div className="view-events-container">
      <AdminSidebar />

      <div className="task-app">
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
                  <button
                    onClick={handleAddPersonalTask}
                    className="icon-button">
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
                      )}>
                      <span
                        className={classNames(
                          task.status === "Done" ? "task-done-text" : ""
                        )}>
                        {task.name}
                      </span>
                      <div className="task-actions">
                        {task.status !== "Done" && (
                          <button
                            className="task-button outline"
                            onClick={() => handleCompletePersonalTask(task.id)}>
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          className="task-button outline"
                          onClick={() => handleDeletePersonalTask(task.id)}>
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
                          {task.name} -{" "}
                          {format(new Date(task.dueDate), "MMM d")}
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
                      }}>
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
                      onClick={() => setFilterType("status")}>
                      Status
                    </button>
                    <button
                      className={classNames(
                        "filter-button",
                        filterType === "priority" ? "active" : ""
                      )}
                      onClick={() => setFilterType("priority")}>
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
                      )}>
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
                          onClick={() => handleEditClubTask(task)}>
                          <div className="task-card-header">
                            <h3 className="task-card-title">{task.name}</h3>
                            <button
                              className="task-delete-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClubTask(task.id);
                              }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="task-card-description">
                            {task.description || "No description"}
                          </p>
                          <div className="task-card-footer">
                            <span className="task-assignee">
                              {task.assignee}
                            </span>
                            <span
                              className={classNames(
                                "task-due-date",
                                new Date(task.dueDate).setHours(0, 0, 0, 0) <
                                  new Date().setHours(0, 0, 0, 0) &&
                                  task.status !== "Done"
                                  ? "overdue"
                                  : ""
                              )}>
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
                  onClick={() => setIsAddTaskOpen(false)}>
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
                    }></textarea>
                </div>
                <div className="form-group">
                  <label>Assignee</label>
                  <select
                    value={currentTask?.assigneeId || ""}
                    onChange={(e) => {
                      const selectedMember = clubMembers.find(
                        (m) => m.id.toString() === e.target.value
                      );
                      setCurrentTask({
                        ...currentTask,
                        assignee: selectedMember?.name || "", // For display
                        assigneeId: selectedMember?.id || null, // For API (membership_id)
                      });
                    }}>
                    <option value="" disabled>
                      Select member
                    </option>
                    {clubMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.email})
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
                      }>
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
                      }>
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
                  onClick={() => setIsAddTaskOpen(false)}>
                  Cancel
                </button>
                <button
                  className="modal-button save"
                  onClick={handleSaveClubTask}>
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
                  onClick={() => setIsEditTaskOpen(false)}>
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
                    }></textarea>
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
                    }>
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
                      }>
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
                      }>
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
                  onClick={() => setIsEditTaskOpen(false)}>
                  Cancel
                </button>
                <button
                  className="modal-button save"
                  onClick={handleSaveClubTask}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
