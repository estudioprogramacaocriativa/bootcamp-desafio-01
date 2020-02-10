const express = require("express");
const server = express();

server.use(express.json());

let projects = [
  { id: "1", title: "Projeto 1", tasks: [] },
  { id: "2", title: "Projeto 2", tasks: [] },
  { id: "3", title: "Projeto 3", tasks: [] }
];

let counter = 0;

function existRow(req, res, next) {
  const project = projects[req.params.id];

  if (!project)
    return res.status(400).json({ message: `This project does\'t exist!` });

  req.project = project;

  next();
}

server.use((req, res, next) => {
  res.on("finish", () => {
    counter += 1;
    console.log(counter);

    next();
  });

  next();
});

server.post("/projects", (req, res) => {
  const data = {
    id: req.body.id,
    title: req.body.title,
    tasks: []
  };

  projects.push(data);

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", existRow, (req, res) => {
  return res.json(req.project);
});

server.put("/projects/:id", existRow, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const find = projects.find(el => el.id === id);
  find.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", existRow, (req, res) => {
  const { id } = req.params;
  const popProject = projects.filter(el => el.id !== id);

  projects = popProject;

  return res.send();
});

server.post("/projects/:id/tasks", existRow, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  const find = projects.find(el => el.id === id);

  find.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
