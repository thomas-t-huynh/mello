const initialData = {
  tasks: {
    "task-1": { id: "task-1", content: "Eat" },
    "task-2": { id: "task-2", content: "Code" },
    "task-3": { id: "task-3", content: "Sleep" },
    "task-4": { id: "task-4", content: "Code" }
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Things to do",
      taskIds: ["task-1", "task-2", "task-3", "task-4"]
    },
    "column-2": {
      id: "column-2",
      title: "Doing",
      taskIds: []
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      taskIds: []
    }
  },
  columnOrder: ["column-1", "column-2", "column-3"]
};

export default initialData;
